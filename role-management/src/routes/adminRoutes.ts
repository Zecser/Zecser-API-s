import express from "express";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/authorization.js";
import {
  listUsers,
  getUserById,
  deleteUser,
  createModerator,
  removeModerator,
  getPendingRequests,
  getAllRequests,
  getRequestById,
  approveModeratorRequest,
  rejectModeratorRequest,
  listModeratorsOnly ,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management and moderator requests
 */


/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Results per page
 *     responses:
 *       200:
 *         description: Successfully fetched users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */


// User Management
adminRouter.get("/users", protect, allowRoles("Admin"), listUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved
 *       404:
 *         description: User not found
 */

adminRouter.get("/users/:id", protect, allowRoles("Admin"), getUserById);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

adminRouter.delete("/users/:id", protect, allowRoles("Admin"), deleteUser);

/**
 * @swagger
 * /admin/create-moderator:
 *   post:
 *     summary: Promote a user to moderator
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Moderator created successfully
 */

// Moderator Requests
adminRouter.post("/create-moderator", protect, allowRoles("Admin"), createModerator);

/**
 * @swagger
 * /admin/moderator-requests/pending:
 *   get:
 *     summary: Get all pending moderator requests
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending requests
 */

adminRouter.get("/moderator-requests/pending", protect, allowRoles("Admin"), getPendingRequests);

/**
 * @swagger
 * /admin/moderator-requests:
 *   get:
 *     summary: Get all moderator requests
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all moderator requests
 */

adminRouter.get("/moderator-requests", protect, allowRoles("Admin"), getAllRequests);

/**
 * @swagger
 * /admin/moderators:
 *   get:
 *     summary: List all moderators
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched moderators
 */

adminRouter.get("/moderators", protect,allowRoles("Admin"), listModeratorsOnly);

/**
 * @swagger
 * /admin/moderator-requests/{id}:
 *   get:
 *     summary: Get a specific moderator request
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request found
 *       404:
 *         description: Request not found
 */


adminRouter.get("/moderator-requests/:id", protect, allowRoles("Admin"), getRequestById);

/**
 * @swagger
 * /admin/moderator-requests/{id}:
 *   delete:
 *     summary: Remove moderator request
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request deleted successfully
 */

adminRouter.delete("/moderator-requests/:id", protect, allowRoles("Admin"), removeModerator);

/**
 * @swagger
 * /admin/moderator-requests/{id}/approve:
 *   put:
 *     summary: Approve moderator request
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Moderator request approved
 */


adminRouter.put("/moderator-requests/:id/approve", protect, allowRoles("Admin"), approveModeratorRequest);

/**
 * @swagger
 * /admin/moderator-requests/{id}/reject:
 *   put:
 *     summary: Reject moderator request
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Moderator request rejected
 */



adminRouter.put("/moderator-requests/:id/reject", protect, allowRoles("Admin"), rejectModeratorRequest);

export default adminRouter;
