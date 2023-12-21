import mongoose from "mongoose";
import { ObjectId } from "../utils";
export enum UserRole {
  User = "USER",
  Admin = "ADMIN",
}
export type User = {
  _id: ObjectId;
  username: string;
  email: string | undefined;
  role: UserRole;
};
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: String,
    role: {
      type: String,
      enum: [UserRole.User, UserRole.Admin],
      default: "USER",
    },
  },
  { collection: "users" }
);
export default userSchema;
