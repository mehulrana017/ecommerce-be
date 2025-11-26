import mongoose, { Document, Schema } from "mongoose";

// Interface for embedded product details in orders
interface IOrderProduct {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

// Interface for shipping address
interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const OrderStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
// Interface for the Order model
interface IOrder extends Document {
  orderId: string;
  userId: mongoose.Types.ObjectId;
  products: IOrderProduct[];
  totalPrice: number;
  totalDiscount: number;
  couponApplied: string | null;
  shippingAddress: IShippingAddress;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Embedded product schema
const orderProductSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

// Shipping address schema
const shippingAddressSchema = new Schema(
  {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

// Order schema definition
const orderSchema: Schema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        // Generate unique order ID: ORD-YYYYMMDD-RANDOM
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `ORD-${dateStr}-${random}`;
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // For querying orders by user
    },
    products: {
      type: [orderProductSchema],
      required: true,
      validate: {
        validator: function (products: IOrderProduct[]) {
          return products.length > 0;
        },
        message: "Order must contain at least one product",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    couponApplied: {
      type: String,
      default: null,
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      index: true, // For filtering orders by status
    },
  },
  { timestamps: true }
);

// Order model
const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
export { OrderStatus };
export type { IOrder, IOrderProduct, IShippingAddress };
