import mongoose, { Document, Schema } from "mongoose";

// Interface for the Category model
interface ICategory extends Document {
  categoryId: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Category schema definition
const categorySchema: Schema = new Schema(
  {
    categoryId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Category model
const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
export type { ICategory };
