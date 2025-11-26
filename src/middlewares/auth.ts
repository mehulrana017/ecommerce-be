import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request to include userId
export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ message: "Access token required" });
      return;
    }

    const secret = process.env.JWT_SECRET || "secret";
    const decoded = jwt.verify(token, secret) as { userId: string };

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
