const crypto = require('crypto');

// Load environment variables from .env file if it exists
require('dotenv').config();

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node generateSignature.js <razorpay_order_id> <razorpay_payment_id>');
  process.exit(1);
}

const razorpayOrderId = args[0];
const razorpayPaymentId = args[1];
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeySecret) {
  console.error('Please set RAZORPAY_KEY_SECRET in your .env file or environment variables');
  process.exit(1);
}

const sign = razorpayOrderId + '|' + razorpayPaymentId;
const expectedSignature = crypto
  .createHmac('sha256', razorpayKeySecret)
  .update(sign)
  .digest('hex');

console.log('Generated Signature:', expectedSignature);
console.log('Use this in your Postman request body as razorpay_signature');
console.log('Note: Ensure razorpay_payment_id is a valid test payment ID, not the order ID.');
