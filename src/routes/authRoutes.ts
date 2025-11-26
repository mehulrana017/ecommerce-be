import express, { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController.ts";

const router: Router = express.Router();

/**
 * Route to register new user
 */
router.post("/register", registerUser);

/**
 * Route to login
 */
router.post("/login", loginUser);

export default router;
