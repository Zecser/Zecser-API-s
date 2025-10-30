import { Server } from "socket.io";
import http from "http";

let io: Server;

export const initSocket = (server: http.Server) => {
io = new Server(server, {
cors: { origin: "*" },
});
console.log(" Socket.IO initialized");
return io;
};

export const getIO = () => {
if (!io) throw new Error("Socket.io not initialized");
return io;
};
