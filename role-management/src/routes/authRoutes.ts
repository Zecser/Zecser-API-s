import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  requestModeratorRole,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const authRouter = express.Router();


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and User Management
 */


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

// Auth Routes
authRouter.post("/register", register);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and get token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */

authRouter.post("/login", login);



/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */

// User Profile
authRouter.get("/profile", protect, getProfile);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */


authRouter.put("/profile", protect, updateProfile);


/**
 * @swagger
 * /auth/request-moderator:
 *   post:
 *     summary: Request to become a moderator
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Moderator request submitted successfully
 */

//  Request Moderator Role
authRouter.post("/request-moderator", protect, requestModeratorRole);

export default authRouter;
