import express, { type Request, type Response, type Router } from "express";
import Stripe from "stripe";
import Order from "../src/models/orderModel.ts";
import Cart from "../src/models/cartModel.ts";
import Product from "../src/models/productModel.ts";

// Initialize Stripe with proper key validation
const getStripeInstance = (): Stripe => {
  const apiKey = process.env.STRIPE_SECRET_KEY || "";
  if (!apiKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured in environment variables"
    );
  }
  return new Stripe(apiKey, {
    apiVersion: "2025-11-17.clover",
  });
};

const stripe = getStripeInstance();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

const router: Router = express.Router();

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (request: Request, response: Response) => {
    const sig = request.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("event.type", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        try {
          const userId = session.metadata?.userId;
          const cartId = session.metadata?.cartId;

          if (!userId || !cartId) {
            console.error("Missing metadata in session");
            break;
          }

          // Get cart with product details
          const cart = await Cart.findById(cartId).populate("items.productId");

          if (!cart) {
            console.error("Cart not found:", cartId);
            break;
          }

          // Filter out items with deleted products
          const validItems = cart.items.filter(
            (item: any) => item.productId !== null
          );

          if (validItems.length === 0) {
            console.error("No valid items in cart");
            break;
          }

          // Create order products array
          const orderProducts = validItems.map((item: any) => {
            const product = item.productId as any;
            return {
              productId: product._id,
              name: product.name,
              price: item.price,
              quantity: item.quantity,
              subtotal: item.price * item.quantity,
            };
          });

          // Create order
          const order = new Order({
            userId,
            products: orderProducts,
            totalPrice: cart.totalPrice,
            totalDiscount: 0,
            status: "pending",
            shippingAddress: {
              street: session.customer_details?.address?.line1 || "N/A",
              city: session.customer_details?.address?.city || "N/A",
              state: session.customer_details?.address?.state || "N/A",
              zipCode: session.customer_details?.address?.postal_code || "N/A",
              country: session.customer_details?.address?.country || "N/A",
            },
          });

          await order.save();

          // Update product stock (only for valid items)
          for (const item of validItems) {
            await Product.findByIdAndUpdate(item.productId, {
              $inc: { stock: -item.quantity },
            });
          }

          // Clear cart
          cart.items = [];
          cart.totalPrice = 0;
          await cart.save();

          console.log("Order created successfully:", order.orderId);
        } catch (error) {
          console.error("Error processing checkout session:", error);
          return response.status(500).send("Internal Server Error");
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return response.json({ received: true });
  }
);

export default router;
