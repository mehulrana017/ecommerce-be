import { type Response } from "express";
import Order, { OrderStatus } from "../models/orderModel";
import Product from "../models/productModel";
import type { AuthRequest } from "../middlewares/auth";

/**
 * List all Orders
 * - Regular users: See only their own orders
 * - Admins: See all orders
 */
export const getOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    // Users see only their orders
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

/**
 * Get order by order ID
 * - Users can only view their own orders
 * - Admins can view any order
 */
export const getOrderById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Check ownership
    if (order.userId.toString() !== userId) {
      res.status(403).json({ message: "Access denied. Not your order." });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order" });
  }
};

/**
 * Place an Order
 * - Authenticated users can create orders
 * - Order is automatically associated with logged-in user
 */
export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { products, shippingAddress, couponApplied } = req.body;

    // Validate required fields
    if (!products || !Array.isArray(products) || products.length === 0) {
      res.status(400).json({ message: "Products array is required" });
      return;
    }

    if (!shippingAddress) {
      res.status(400).json({ message: "Shipping address is required" });
      return;
    }

    // Validate products exist and calculate totals
    let totalPrice = 0;
    const orderProducts = [];

    for (const item of products) {
      if (!item.productId || !item.quantity) {
        res.status(400).json({
          message: "Each product must have productId and quantity",
        });
        return;
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        res.status(400).json({
          message: `Product not found: ${item.productId}`,
        });
        return;
      }

      // Check if product is active
      if (!product.isActive) {
        res.status(400).json({
          message: `Product is not available: ${product.name}`,
        });
        return;
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
        return;
      }

      const subtotal = product.price * item.quantity;
      totalPrice += subtotal;

      orderProducts.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal,
      });
    }

    // Create order
    const newOrder = new Order({
      userId,
      products: orderProducts,
      totalPrice,
      totalDiscount: 0, // Implement coupon logic later
      couponApplied: couponApplied || null,
      shippingAddress,
      status: OrderStatus.PENDING,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};

/**
 * Cancel Order
 * - Users can only cancel their own orders
 * - Admins can cancel any order
 * - Only pending/processing orders can be cancelled
 */
export const cancelOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Check ownership
    if (order.userId.toString() !== userId) {
      res.status(403).json({ message: "Access denied. Not your order." });
      return;
    }

    // Check if order can be cancelled
    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      res.status(400).json({
        message: `Cannot cancel order with status: ${order.status}`,
      });
      return;
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Error cancelling order" });
  }
};
