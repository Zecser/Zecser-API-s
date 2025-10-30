import { Request, Response } from "express";
import Subcategory from "../models/SubCategory";
import Category from "../models/Category";
import Product from "../models/Product";

/* Create subcategory for a category */
export const createSubcategory = async (req: Request, res: Response) => {
  const { name, description,categoryId } = req.body;
  console.log("Request body:", req.body);
  const cat = await Category.findById(categoryId);
  if (!cat) return res.status(404).json({ message: "Category not found." });

  const existing = await Subcategory.findOne({ name, category: categoryId });
  console.log("Found category:", existing);
  if (existing) return res.status(400).json({ message: "Subcategory already exists for this category." });

  const sub = await Subcategory.create({ name, description, category: categoryId });
  res.status(201).json(sub);
};

export const listSubcategories = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  if (categoryId) {
    const subs = await Subcategory.find({ category: categoryId });
    return res.json(subs);
  }
  const subs = await Subcategory.find().populate("category");
  res.json(subs);
};

export const updateSubcategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const sub = await Subcategory.findByIdAndUpdate(id, { name, description }, { new: true });
  if (!sub) return res.status(404).json({ message: "Subcategory not found." });
  res.json(sub);
};

export const deleteSubcategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Product.deleteMany({ subcategory: id });
  await Subcategory.findByIdAndDelete(id);
  res.json({ message: "Subcategory and related products deleted." });
};

export const getSubcategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sub = await Subcategory.findById(id).populate("category");
    if (!sub) return res.status(404).json({ message: "Subcategory not found" });
    res.json(sub);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
