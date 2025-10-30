import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { Request, Response } from "express";
import UserModel, { IUser } from "../models/User.js";
import RoleModel, { IRole } from "../models/Role.js";
import ModeratorRequestModel from "../models/ModeratorRequest.js";
import { AuthRequest } from "../middleware/auth.js";
import { Document } from "mongoose";


const signToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || "secret";
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"];
  return jwt.sign({ id: userId }, secret, { expiresIn });
};


// Register new user

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;


    if (!name?.trim() || !email?.trim() || !password) {
      res.status(400).json({ message: "Missing fields: name, email, password" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }


    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }



    const userRole = await RoleModel.findOne({ name: "User" });
    if (!userRole) {
      res.status(500).json({ message: "User role not found" });
      return;
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole._id,
    });

    if (!user._id) {
      res.status(500).json({ message: "Error creating user" });
      return;
    }

    const token = signToken(user._id.toString());

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: userRole.name,
        permissions: userRole.permissions,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Request moderator role
export const requestModeratorRole = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized: user not found in token" });
    }

    const userId = req.user._id;
    const { reason } = req.body;

    if (!reason?.trim()) {
      return res.status(400).json({ message: "Please provide a reason for moderator request" });
    }

    const user = await UserModel.findById(userId).populate("role");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (["Moderator", "Admin"].includes((user?.role as IRole)?.name)) {
      return res.status(400).json({ message: "You are already a moderator or admin" });
    }


    const existingRequest = await ModeratorRequestModel.findOne({ userId, status: "pending" });
    if (existingRequest) {
      return res.status(400).json({ message: "You already have a pending moderator request" });
    }


    const request = await ModeratorRequestModel.create({
      userId,
      reason: reason.trim(),
      status: "pending",
    });

    res.status(201).json({
      message: "Moderator request submitted successfully",
      requestId: request._id,
      status: request.status,
    });
  } catch (err: any) {
    console.error("Error creating moderator request:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      res.status(400).json({ message: "Email and password required" });
      return;
    }

    const user = (await UserModel.findOne({ email: email.toLowerCase() })
      .populate<{ role: IRole }>("role")
      .exec()) as (IUser & Document) | null;

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = signToken((user._id as string).toString());
    res.json({
      message: "Login successful",
      token,
      user: {
        id: (user._id as string).toString(),
        name: user.name,
        email: user.email,
        role: (user.role as IRole).name,
        permissions: (user.role as IRole).permissions,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = (await UserModel.findById(req.user._id)
      .populate<{ role: IRole }>("role")
      .exec()) as (IUser & Document) | null;

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    res.json({
      user: {
        id: (user._id as string).toString(),
        name: user.name,
        email: user.email,
        role: (user.role as IRole).name,
        permissions: (user.role as IRole).permissions,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Update own profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    if (!name?.trim() && !email?.trim()) {
      res.status(400).json({ message: "Provide name or email to update" });
      return;
    }


    if (email?.trim()) {
      const existingUser = await UserModel.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });

      if (existingUser) {
        res.status(400).json({ message: "Email already in use" });
        return;
      }
    }

    const updateData: any = {};
    if (name?.trim()) updateData.name = name.trim();
    if (email?.trim()) updateData.email = email.toLowerCase();

    const updated = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    })
      .populate("role", "name permissions")
      .select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};