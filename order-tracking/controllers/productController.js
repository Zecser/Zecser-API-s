const Product = require('../models/Product');


exports.createProduct = async (req, res) => {
try {
const newProduct = new Product(req.body);
const savedProduct = await newProduct.save();
res.status(201).json(savedProduct);
} catch (err) {
res.status(500).json({ error: err.message });
}
};


exports.getProducts = async (req, res) => {
try {
const products = await Product.find();
res.json(products);
} catch (err) {
res.status(500).json({ error: err.message });
}
};

exports.getProductById = async (req, res) => {
try {
const product = await Product.findById(req.params.id);
if (!product) return res.status(404).json({ message: 'Product not found' });
res.json(product);
} catch (err) {
res.status(500).json({ error: err.message });
}
};
