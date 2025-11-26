import express, { Router } from "express";
import { authenticateToken } from "../middlewares/auth.ts";
import {
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder,
} from "../controllers/orderController.ts";

const router: Router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

/**
 * GET /api/v1/orders
 * List all user's orders
 */
router.get("/", getOrders);

/**
 * GET /api/v1/orders/:id
 * Get order by ID
 */
router.get("/:id", getOrderById);

/**
 * POST /api/v1/orders
 * Create new order
 */
router.post("/", createOrder);

/**
 * POST /api/v1/orders/:id/cancel
 * Cancel order
 */
router.post("/:id/cancel", cancelOrder);

export default router;
