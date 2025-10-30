import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
  status: 'created' | 'paid' | 'failed';
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: Date;
  verifiedAt?: Date;
}

const PaymentSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'INR' },
  receipt: { type: String, required: true },
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  createdAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date },
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
