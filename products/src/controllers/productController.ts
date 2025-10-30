import { Request, Response } from "express";
import Product from "../models/Product";
import Category from "../models/Category";
import Subcategory from "../models/SubCategory";

/* Create product */
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, category, subcategory } = req.body;

  // basic validation
  if (!name || !price || !category) {
    return res.status(400).json({ message: "name, price and category are required." });
  }

  // check category exists
  const cat = await Category.findById(category);
  if (!cat) return res.status(404).json({ message: "Category not found." });

  // if subcategory provided, ensure it belongs to category
  if (subcategory) {
    const sub = await Subcategory.findById(subcategory);
    if (!sub) return res.status(404).json({ message: "Subcategory not found." });
    if (sub.category.toString() !== category) {
      return res.status(400).json({ message: "Subcategory does not belong to given category." });
    }
  }

  const product = await Product.create({ name, description, price, category, subcategory });
  res.status(201).json(product);
};


/* Get single product */
export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const p = await Product.findById(id).populate("category").populate("subcategory");
  if (!p) return res.status(404).json({ message: "Product not found." });
  res.json(p);
};

/* Update product */
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const update = req.body;

  // if updating category or subcategory, additional checks could be added (omitted for brevity)
  const p = await Product.findByIdAndUpdate(id, update, { new: true });
  if (!p) return res.status(404).json({ message: "Product not found." });
  res.json(p);
};

/* Delete product */
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const p = await Product.findByIdAndDelete(id);
  if (!p) return res.status(404).json({ message: "Product not found." });
  res.json({ message: "Product deleted." });
};

export const listProducts = async (req: Request, res: Response) => {
  try {
    const { category, subcategory, q, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    const filter: any = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (q) {
      // Case-insensitive search by product name or description
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category")
      .populate("subcategory")
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 }); 

    res.json({
      items: products,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).json({ message: "Server error" });
  }
};