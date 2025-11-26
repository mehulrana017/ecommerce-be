import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { UserRole } from "../models/userModel";

/**
 * Register a new user
 */
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name: username, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists." });
      return;
    }

    // Hash the password before saving it to the DB
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with role validation
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role && Object.values(UserRole).includes(role)
        ? role
        : UserRole.USER  // Default to USER if invalid or not provided
    });

    await newUser.save();

    // Return user without password, but include role
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    res
      .status(201)
      .json({ message: "User created successfully", user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error Registering User" });
  }
};

/**
 * Log in an existing user
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "30d" }
    );

    // Return token and user info with role
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};
