import express, { Router } from "express";
import {
  getProductById,
  getProducts,
} from "../controllers/productController.ts";

const router: Router = express.Router();

/**
 * Route to list all the products
 */
router.get("/products", getProducts);

/**
 * Route to get product by product id
 */
router.get("/products/:id", getProductById);

export default router;
