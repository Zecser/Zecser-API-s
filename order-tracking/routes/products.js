/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Product description
 *         price:
 *           type: number
 *           description: Product price
 *         category:
 *           type: string
 *           description: Product category
 *         stock:
 *           type: integer
 *           description: Quantity available
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of all products
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get one product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *   put:
 *     summary: Update an existing product
 *   delete:
 *     summary: Delete a product
 */

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


router.post('/', async (req, res) => {
try {
const newProduct = new Product(req.body);
const savedProduct = await newProduct.save();
res.status(201).json(savedProduct);
} catch (err) {
res.status(500).json({ error: err.message });
}
});


router.get('/', async (req, res) => {
try {
const products = await Product.find();
res.json(products);
} catch (err) {
res.status(500).json({ error: err.message });
}
});


router.get('/:id', async (req, res) => {
try {
const product = await Product.findById(req.params.id);
if (!product)
return res.status(404).json({ message: 'Product not found' });
res.json(product);
} catch (err) {
res.status(500).json({ error: err.message });
}
});

module.exports = router;

