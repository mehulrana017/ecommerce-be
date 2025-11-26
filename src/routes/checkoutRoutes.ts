import express, { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import { createCheckoutSession } from "../controllers/checkoutController";

const router: Router = express.Router();

/**
 * POST /api/v1/checkout/create-session
 * Create Stripe checkout session (requires auth)
 */
router.post("/create-session", authenticateToken, createCheckoutSession);

export default router;
