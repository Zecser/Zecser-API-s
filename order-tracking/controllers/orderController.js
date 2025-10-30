const Order = require('../models/Order');
const Product = require('../models/Product');


exports.createOrder = async (req, res) => {
try {
const { userId, items } = req.body;
if (!items || items.length === 0) return res.status(400).json({ error: 'No items in order' });

let totalAmount = 0;
const detailedItems = [];

for (let item of items) {
const product = await Product.findById(item.productId);
if (!product) return res.status(404).json({ error: `Product ${item.productId} not found` });

totalAmount += product.price * item.qty;
detailedItems.push({
productId: product._id,
name: product.name,
qty: item.qty,
price: product.price
});
}

const newOrder = new Order({ userId, items: detailedItems, totalAmount, status: 'pending' });
const savedOrder = await newOrder.save();
res.status(201).json(savedOrder);

} catch (err) {
res.status(500).json({ error: err.message });
}
};


exports.getOrders = async (req, res) => {
try {
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 5;
const skip = (page - 1) * limit;

const orders = await Order.find().skip(skip).limit(limit);
const total = await Order.countDocuments();

res.json({
totalOrders: total,
currentPage: page,
totalPages: Math.ceil(total / limit),
orders
});
} catch (err) {
res.status(500).json({ error: err.message });
}
};


exports.getOrderById = async (req, res) => {
try {
const order = await Order.findById(req.params.id);
if (!order) return res.status(404).json({ message: 'Order not found' });
res.json(order);
} catch (err) {
res.status(500).json({ error: err.message });
}
};


exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.deleteOrder = async (req, res) => {
try {
await Order.findByIdAndDelete(req.params.id);
res.json({ message: 'Order deleted successfully' });
} catch (err) {
res.status(500).json({ error: err.message });
}
};
