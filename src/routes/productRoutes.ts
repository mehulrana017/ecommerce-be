import express, { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController";
import { getProductById, getProducts } from "../controllers/productController";

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
