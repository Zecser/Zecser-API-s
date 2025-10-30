import express from "express";
import http from "http";
import notificationRoutes from "./routes/notificationRoutes";
import { initSocket } from "./socket";
import { setupSwagger } from "./swagger";

const app = express();
app.use(express.json());


setupSwagger(app);

app.use("/api/notifications", notificationRoutes);

const server = http.createServer(app);
initSocket(server);

server.listen(5000, () => {
console.log(" Server running on port 5000");
});
