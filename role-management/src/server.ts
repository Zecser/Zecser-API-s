import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import { seedRolesAndAdmin } from "./middleware/seedData.js";
import swagger from "./swagger.js";

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api-docs",swagger)


app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running", status: "OK" });
});

// Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log(" MongoDB connected");
    await seedRolesAndAdmin();
  } catch (err) {
    console.error(" MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});


app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(` API Base URL: http://localhost:${PORT}/api`);
});