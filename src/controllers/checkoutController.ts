import type { Response } from "express";
import Stripe from "stripe";
import Cart from "../models/cartModel";
import type { AuthRequest } from "../middlewares/auth";

// Initialize Stripe with proper key validation
const getStripeInstance = (): Stripe => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured in environment variables"
    );
  }
  return new Stripe(apiKey, {
    apiVersion: "2025-11-17.clover",
  });
};

let stripe: Stripe;

/**
 * POST /api/v1/checkout/create-session
 * Create Stripe Checkout session
 */
export const createCheckoutSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Initialize Stripe lazily
    if (!stripe) {
      stripe = getStripeInstance();
    }

    const userId = req.userId;

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    // Filter out items with deleted products and verify stock availability
    const validItems = [];
    const invalidProducts = [];

    for (const item of cart.items) {
      console.log("item", item);
      const product = item.productId as any;

      // Check if product exists
      if (!product) {
        invalidProducts.push("Product no longer exists");
        continue;
      }

      // Check if product is active
      if (!product.isActive) {
        invalidProducts.push(product.name);
        continue;
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
        return;
      }

      validItems.push(item);
    }

    console.log("invalidProducts", invalidProducts);

    // If there are invalid products, inform the user
    if (invalidProducts.length > 0) {
      res.status(400).json({
        message: `Some products in your cart are no longer available: ${invalidProducts.join(
          ", "
        )}. Please remove them from your cart.`,
      });
      return;
    }

    // If no valid items remain
    if (validItems.length === 0) {
      res.status(400).json({ message: "Cart has no valid items" });
      return;
    }

    // Create line items for Stripe using only valid items
    const lineItems = validItems.map((item: any) => {
      const product = item.productId as any;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
            images: product.images.filter((img: string) => img), // Filter out empty images
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/orders?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/?canceled=true`,
      metadata: {
        userId: userId!,
        cartId: cart._id.toString(),
      },
    });

    res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Error creating checkout session" });
  }
};
