import { Response,Request } from "express";
import { AuthRequest } from "../middleware/auth.js";
import UserModel from "../models/User.js";
import RoleModel from "../models/Role.js";
import ModeratorRequestModel from "../models/ModeratorRequest.js";
import bcrypt from "bcryptjs";


// USER MANAGEMENT 

// List all users 
export const listUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as string;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (role) {
      const roleDoc = await RoleModel.findOne({ name: role });
      if (roleDoc) {
        filter.role = roleDoc._id;
      }
    }

    const total = await UserModel.countDocuments(filter);
    const users = await UserModel.find(filter)
      .populate("role", "name permissions")
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user 
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id)
      .populate("role", "name permissions")
      .select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      res.status(400).json({ message: "Cannot delete your own account" });
      return;
    }

    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      message: "User deleted successfully",
      id: user._id,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//  MODERATOR REQUEST MANAGEMENT 

// Get all pending moderator requests (Admin only)

export const getPendingRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const skip = (page - 1) * limit;

   
    const filter: any = { status: "pending" };

    
    const userMatch = search
      ? {
          $or: [
            { "userId.name": { $regex: search, $options: "i" } },
            { "userId.email": { $regex: search, $options: "i" } },
          ],
        }
      : {};

    
    const requests = await ModeratorRequestModel.find(filter)
      .populate("userId", "name email")
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

   
    const filteredRequests = search
      ? requests.filter((r: any) =>
          r.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
          r.userId?.email?.toLowerCase().includes(search.toLowerCase())
        )
      : requests;

    const total = await ModeratorRequestModel.countDocuments(filter);

    res.json({
      message: "Pending moderator requests",
      count: filteredRequests.length,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      requests: filteredRequests,
    });
  } catch (err) {
    console.error("getPendingRequests Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all moderator requests with filters (Admin only)
export const getAllRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: any = {};

    if (status && ["pending", "approved", "rejected"].includes(status as string)) {
      filter.status = status;
    }

    const requests = await ModeratorRequestModel.find(filter)
      .populate("userId", "name email")
      .populate("reviewedBy", "name email")
      .sort({ appliedAt: -1 });

    res.json({
      message: "Moderator requests retrieved",
      count: requests.length,
      requests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get moderator request by ID (Admin only)
export const getRequestById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const request = await ModeratorRequestModel.findById(id)
      .populate("userId", "name email")
      .populate("reviewedBy", "name email");

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    res.json({ request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




//  APPROVE MODERATOR REQUEST 

// Approve moderator request (Admin only)

export const approveModeratorRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    const request = await ModeratorRequestModel.findById(id).populate("userId");
    if (!request) return res.status(404).json({ message: "Moderator request not found" });

    if (request.status !== "pending")
      return res.status(400).json({ message: "Request already processed" });

    const moderatorRole = await RoleModel.findOne({ name: "Moderator" });
    if (!moderatorRole)
      return res.status(500).json({ message: "Moderator role not found in DB" });

    const user = await UserModel.findById(request.userId._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = moderatorRole._id as any;
    await user.save();

    request.status = "approved";
    request.reviewComments = comments || null;
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    await request.save();

    res.json({
      success: true,
      message: "Moderator request approved successfully",
      updatedUser: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "Moderator",
      },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};


// Reject moderator request (Admin only)
export const rejectModeratorRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    if (!comments?.trim())
      return res.status(400).json({ message: "Please provide rejection reason" });

    const request = await ModeratorRequestModel.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending")
      return res.status(400).json({ message: "Request is already processed" });

    request.status = "rejected";
    request.reviewComments = comments;
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    await request.save();

    res.json({
      message: "Moderator request rejected successfully",
      request,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE MODERATOR (ADMIN ONLY) 


export const createModerator = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    
    const role = await RoleModel.findOne({ name: "Moderator" });
    if (!role)
      return res.status(404).json({ message: "Moderator role not found" });

    
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const moderator = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: role._id, 
    });

    await moderator.save();
    res.status(201).json({ message: "Moderator created successfully", moderator });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const listModerators = async (req: Request, res: Response) => {
  try {
    const moderators = await UserModel.find({ role: "moderator" }).select(
      "-password"
    );
    res.json(moderators);
  } catch (error: any) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


export const removeModerator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await UserModel.findById(id).populate("role");
    if (!user) return res.status(404).json({ message: "User not found" });

    const roleName =
      typeof user.role === "object" && "name" in user.role
        ? (user.role as any).name
        : null;

    if (roleName !== "Moderator") {
      return res.status(400).json({ message: "User is not a moderator" });
    }

    const userRole = await RoleModel.findOne({ name: "User" });
    if (!userRole) {
      return res.status(500).json({ message: "Default User role not found" });
    }

    user.role = userRole._id as any;
    await user.save();

    res.json({ message: "Moderator role removed successfully" });
  } catch (error: any) {
    console.error("removeModerator Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const listModeratorsOnly = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    
    const currentUser = await UserModel.findById(userId).populate("role", "name");
    if (!currentUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    
    if ((currentUser.role as any).name !== "admin") {
      res.status(403).json({ success: false, message: "Access denied. Admins only." });
      return;
    }

    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    
    const moderatorRole = await RoleModel.findOne({ name: "moderator" });
    if (!moderatorRole) {
      res.status(404).json({ success: false, message: "Moderator role not found" });
      return;
    }

    
    const query: any = {
      role: moderatorRole._id,
    };

    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    
    const total = await UserModel.countDocuments(query);

   
    const moderators = await UserModel.find(query)
      .populate("role", "name")
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    
    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      moderators,
    });
  } catch (error) {
    console.error("Error fetching moderators:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


