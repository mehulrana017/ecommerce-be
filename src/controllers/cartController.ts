import type { Response } from "express";
import Cart from "../models/cartModel.ts";
import Product from "../models/productModel.ts";
import type { AuthRequest } from "../middlewares/auth.ts";

/**
 * GET /api/v1/cart
 * Get user's cart with populated product details
 */
export const getCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    // Create empty cart if doesn't exist
    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
      await cart.save();
    }

    // Remove items with deleted products from the database
    const originalLength = cart.items.length;
    cart.items = cart.items.filter((item: any) => item.productId !== null);

    // If items were removed, save the cart and recalculate total
    if (cart.items.length !== originalLength) {
      cart.calculateTotal();
      await cart.save();
    }

    const validItems = cart.items;

    const formattedCart = {
      id: cart._id.toString(),
      userId: cart.userId.toString(),
      items: validItems.map((item: any) => ({
        id: item._id.toString(),
        productId: item.productId._id.toString(),
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total: cart.totalPrice,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };

    res.status(200).json(formattedCart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

/**
 * POST /api/v1/cart/items
 * Add item to cart
 */
export const addToCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || !quantity || quantity < 1) {
      res.status(400).json({ message: "Invalid product or quantity" });
      return;
    }

    // Check if product exists and is available
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      res.status(404).json({ message: "Product not found or unavailable" });
      return;
    }

    // Check stock
    if (product.stock < quantity) {
      res.status(400).json({ message: "Insufficient stock" });
      return;
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex]!.quantity + quantity;

      // Check stock for updated quantity
      if (product.stock < newQuantity) {
        res.status(400).json({ message: "Insufficient stock" });
        return;
      }

      cart.items[existingItemIndex]!.quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        productId: product._id,
        quantity,
        price: product.price,
      } as any);
    }

    // Recalculate total
    cart.calculateTotal();
    await cart.save();

    // Populate and return
    await cart.populate("items.productId");

    // Filter out items with deleted products
    const validItems = cart.items.filter((item: any) => item.productId !== null);

    const formattedCart = {
      id: cart._id.toString(),
      userId: cart.userId.toString(),
      items: validItems.map((item: any) => ({
        id: item._id.toString(),
        productId: item.productId._id.toString(),
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total: cart.totalPrice,
    };

    res.status(200).json(formattedCart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding item to cart" });
  }
};

/**
 * PUT /api/v1/cart/items/:id
 * Update cart item quantity
 */
export const updateCartItem = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      res.status(400).json({ message: "Invalid quantity" });
      return;
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item._id.toString() === cartItemId
    );

    if (itemIndex === -1) {
      res.status(404).json({ message: "Item not found in cart" });
      return;
    }

    // If quantity is 0, remove item
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      // Verify stock
      const product = await Product.findById(cart.items[itemIndex]!.productId);
      if (!product || product.stock < quantity) {
        res.status(400).json({ message: "Insufficient stock" });
        return;
      }

      cart.items[itemIndex]!.quantity = quantity;
    }

    cart.calculateTotal();
    await cart.save();
    await cart.populate("items.productId");

    // Filter out items with deleted products
    const validItems = cart.items.filter((item: any) => item.productId !== null);

    const formattedCart = {
      id: cart._id.toString(),
      userId: cart.userId.toString(),
      items: validItems.map((item: any) => ({
        id: item._id.toString(),
        productId: item.productId._id.toString(),
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total: cart.totalPrice,
    };

    res.status(200).json(formattedCart);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Error updating cart item" });
  }
};

/**
 * DELETE /api/v1/cart/items/:id
 * Remove item from cart
 */
export const removeFromCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const cartItemId = req.params.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item._id.toString() === cartItemId
    );

    if (itemIndex === -1) {
      res.status(404).json({ message: "Item not found in cart" });
      return;
    }

    cart.items.splice(itemIndex, 1);
    cart.calculateTotal();
    await cart.save();
    await cart.populate("items.productId");

    // Filter out items with deleted products
    const validItems = cart.items.filter((item: any) => item.productId !== null);

    const formattedCart = {
      id: cart._id.toString(),
      userId: cart.userId.toString(),
      items: validItems.map((item: any) => ({
        id: item._id.toString(),
        productId: item.productId._id.toString(),
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total: cart.totalPrice,
    };

    res.status(200).json(formattedCart);
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Error removing item from cart" });
  }
};

/**
 * DELETE /api/v1/cart
 * Clear entire cart
 */
export const clearCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Error clearing cart" });
  }
};
