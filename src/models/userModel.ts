import mongoose, { Document, Schema } from "mongoose";

// User role enum
export enum UserRole {
  USER = "user",
  ADMIN = "admin"
}

// Interface for the User model
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

// User schema definition
const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// User model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
