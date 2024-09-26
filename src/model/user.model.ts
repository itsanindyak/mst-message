import mongoose, { Schema, Document } from "mongoose";
import { Message, MessageShema } from "./message.model";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifycode: string;
  verifycodeExpiry: Date;
  isverified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserShema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  verifycode: {
    type: String,
    required: [true, "Verify code is required."],
  },
  verifycodeExpiry: {
    type: Date,
    required: [true, "Verify code Expiry is required."],
  },
  isverified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    required: [true, ""],
    default: true,
  },
  messages: [MessageShema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserShema);

export default UserModel;
