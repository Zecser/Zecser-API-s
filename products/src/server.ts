import app from "./app";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
dotenv.config();
import { setupSwagger } from "./swagger";

setupSwagger(app);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch(err => {
  console.error("Failed to start server:", err);
});
