import mongoose, { Document, Schema } from "mongoose";

// Interface for cart items
interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // Price at the time of adding to cart
  product?: any; // Will be populated
}

// Interface for the Cart model
interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  calculateTotal(): number;
}

// Cart item schema
const cartItemSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true } // Enable _id for cart items
);

// Cart schema
const cartSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One cart per user
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Method to calculate total price
cartSchema.methods.calculateTotal = function () {
  this.totalPrice = this.items.reduce(
    (total: number, item: ICartItem) => total + item.price * item.quantity,
    0
  );
  return this.totalPrice;
};

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
export type { ICart, ICartItem };
