import { Router } from "express";
import { triggerNotification } from "../controllers/notificationController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API for sending notifications
 */

/**
 * @swagger
 * /api/notifications/send:
 *   post:
 *     summary: Send a notification
 *     description: Trigger a new notification to one user or all users via WebSocket.
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to send notification (optional if sendToAll is true)
 *               title:
 *                 type: string
 *                 description: Title of the notification
 *               message:
 *                 type: string
 *                 description: Message body of the notification
 *               link:
 *                 type: string
 *                 description: Optional link for the notification
 *               sendToAll:
 *                 type: boolean
 *                 description: Send to all users if true
 *             required:
 *               - title
 *               - message
 *     responses:
 *       200:
 *         description: Notification triggered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to send notification
 */
router.post("/send", triggerNotification);

export default router;

