import { getIO } from "../socket";

interface NotificationParams {
userId?: string;
title: string;
message: string;
link?: string;
sendToAll?: boolean;
}

export const sendNotification = async (params: NotificationParams) => {
const io = getIO();
const { userId, title, message, link, sendToAll } = params;

const notification = {
title,
message,
link: link || "#",
date: new Date(),
};


if (sendToAll) {
io.emit("notification", notification);
} else if (userId) {
io.to(userId).emit("notification", notification);
}

console.log("📨 Notification sent:", notification);
};
