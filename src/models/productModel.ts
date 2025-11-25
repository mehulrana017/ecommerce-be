import mongoose, { Document, Schema } from "mongoose";

// Interface for the Product model
interface IProduct extends Document {
  name: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
  category: number;
  tags: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Product schema definition
const productSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // For search functionality
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: Number,
      required: true,
      index: true, // For filtering by category
    },
    tags: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Add text index for name field to enable text search
productSchema.index({ name: "text" });

// Product model
const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
export type { IProduct };
