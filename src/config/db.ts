import mongoose from "mongoose";

/**
 * Connects to MongoDB using the provided URI.
 * @param uri - MongoDB connection string.
 */
const connectToDatabase = async (uri: string): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log("✅ Database connected successfully");
  } catch (error: unknown) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectToDatabase;
