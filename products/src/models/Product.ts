import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category: Types.ObjectId;
  subcategory?: Types.ObjectId;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  price: { type: Number, required: true, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  subcategory: { type: Schema.Types.ObjectId, ref: "Subcategory" },
}, { timestamps: true });

ProductSchema.index({ name: 1, category: 1, subcategory: 1 });

export default mongoose.model<IProduct>("Product", ProductSchema);
