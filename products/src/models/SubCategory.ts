import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubcategory extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  description?: string;
  createdAt: Date;
}

const SubcategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String },
  },
  { timestamps: true }
);

// Use an existing model if already compiled (prevents OverwriteModelError during hot-reload)
const Subcategory: Model<ISubcategory> =
  (mongoose.models && (mongoose.models.Subcategory as Model<ISubcategory>)) ||
  mongoose.model<ISubcategory>("Subcategory", SubcategorySchema);

export default Subcategory;
