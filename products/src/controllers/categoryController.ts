import { Request, Response } from "express";
import Category from "../models/Category";
import Subcategory from "../models/SubCategory";

/* Create category */
export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const existing = await Category.findOne({ name });
  if (existing) return res.status(400).json({ message: "Category already exists." });

  const cat = await Category.create({ name, description });
  res.status(201).json(cat);
};

/* List categories */
export const listCategories = async (req: Request, res: Response) => {
  const cats = await Category.find().sort({ createdAt: -1 });
  res.json(cats);
};

/* Get single category with its subcategories */
export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cat = await Category.findById(id);
  if (!cat) return res.status(404).json({ message: "Category not found." });

  const subs = await Subcategory.find({ category: id }).sort({ name: 1 });
  res.json({ category: cat, subcategories: subs });
};

/* Update category */
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const cat = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
  if (!cat) return res.status(404).json({ message: "Category not found." });
  res.json(cat);
};

/* Delete category and its subcategories and optionally products (cascade) */
import Product from "../models/Product";
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  // remove subcategories
  const subs = await Subcategory.find({ category: id });
  const subIds = subs.map(s => s._id);
  await Subcategory.deleteMany({ category: id });
  // optional: delete products in category or subcategories
  await Product.deleteMany({ $or: [{ category: id }, { subcategory: { $in: subIds } }] });
  await Category.findByIdAndDelete(id);
  res.json({ message: "Category, its subcategories and related products deleted." });
};
