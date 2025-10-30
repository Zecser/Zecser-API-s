
import mongoose, { Schema, Document } from "mongoose";
import { IRole } from "./Role.js";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: mongoose.Types.ObjectId | IRole;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;




