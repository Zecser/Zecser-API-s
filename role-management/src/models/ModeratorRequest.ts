import mongoose, { Schema, Document } from "mongoose";

export interface IModeratorRequest extends Document {
  userId: mongoose.Types.ObjectId;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewComments?: string;
}

const ModeratorRequestSchema = new Schema<IModeratorRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },
    reason: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    appliedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewComments: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IModeratorRequest>("ModeratorRequest", ModeratorRequestSchema);
