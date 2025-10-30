import { Request, Response } from "express";
import { sendNotification } from "../utils/sendNotification";

export const triggerNotification = async (req: Request, res: Response) => {
try {
const { userId, title, message, link, sendToAll } = req.body;

await sendNotification({ userId, title, message, link, sendToAll });

res.json({ success: true, message: "Notification triggered" });
} catch (err) {
res.status(500).json({ error: "Failed to send notification" });
}
};
