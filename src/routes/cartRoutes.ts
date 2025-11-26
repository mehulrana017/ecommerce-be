import express, { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController";

const router: Router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

/**
 * GET /api/v1/cart
 * Get user's cart
 */
router.get("/", getCart);

/**
 * POST /api/v1/cart/items
 * Add item to cart
 */
router.post("/items", addToCart);

/**
 * PUT /api/v1/cart/items/:id
 * Update cart item quantity
 */
router.put("/items/:id", updateCartItem);

/**
 * DELETE /api/v1/cart/items/:id
 * Remove item from cart
 */
router.delete("/items/:id", removeFromCart);

/**
 * DELETE /api/v1/cart
 * Clear cart
 */
router.delete("/", clearCart);

export default router;
