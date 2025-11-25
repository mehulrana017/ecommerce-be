import express, { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController";
import { getProductById, getProducts } from "../controllers/productController";
import {
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder,
} from "../controllers/orderController";

const router: Router = express.Router();

/**
 * Route to list all the orders
 */
router.get("/orders", getOrders);

/**
 * Route to get order by orders id
 */
router.get("/orders/:id", getOrderById);

/**
 * Route to create new order
 */
router.post("/orders/new", createOrder);

/**
 * Route to get order by orders id
 */
router.post("/orders/:id", cancelOrder);

export default router;
