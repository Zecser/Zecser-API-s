const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
userId: { type: String, required: true },
items: [
{
productId: String,
name: String,
qty: Number,
price: Number
}
],
totalAmount: { type: Number, required: true },
status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
