import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDatabase from "./config/db.ts";
import authRoutes from "./routes/authRoutes.ts";
import productRoutes from "./routes/productRoutes.ts";
import orderRoutes from "./routes/orderRoutes.ts";
import cartRoutes from "./routes/cartRoutes.ts";
import checkoutRoutes from "./routes/checkoutRoutes.ts";
import stripeWebhook from "../webhooks/stripeWebhook.ts";
import { seedDatabase } from "./scripts/seed.ts";

// Load environment variables
dotenv.config();

// Initialize the Express app
const app: Application = express();

// Enable CORS
app.use(cors());

// IMPORTANT: Webhook route BEFORE express.json() middleware
// Stripe webhooks need raw body
app.use("/api/v1/checkout/webhook", stripeWebhook);

// Middleware for parsing JSON requests
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/checkout", checkoutRoutes);

// Error handling middleware
// app.use((err: Error, req: Request, res: Response) => {
//   console.error("Error:", err.message);
//   res
//     .status(500)
//     .json({ message: "Internal Server Error", error: err.message });
// });

// Connect to MongoDB and seed database
const startServer = async (): Promise<void> => {
  const dbUri = process.env.MONGO_URI || "";
  await connectToDatabase(dbUri);
  await seedDatabase();
};

startServer();

export default app;
