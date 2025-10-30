"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createOrder = void 0;
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = __importDefault(require("../utils/razorpay"));
const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        const options = {
            amount: amount * 100, // Razorpay expects amount in paisa
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay_1.default.orders.create(options);
        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};
exports.createOrder = createOrder;
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto_1.default
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');
        if (razorpay_signature === expectedSign) {
            // Payment verified successfully
            res.json({ success: true, message: 'Payment verified successfully' });
        }
        else {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    }
    catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
};
exports.verifyPayment = verifyPayment;
