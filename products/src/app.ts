import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { setupSwagger } from "./swagger";
dotenv.config();

import categoryRoutes from "./routes/categoryRoutes";
import subcategoryRoutes from "./routes/subCategoryRoutes";
import productRoutes from "./routes/productRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/products", productRoutes);


app.get("/api/health", (req: Request, res: Response) => res.json({ ok: true }));


setupSwagger(app);

app.use((req: Request, res: Response, _next: NextFunction) => {
	res.status(404).json({ error: "Not Found" });
});

app.use(errorHandler);

export default app;
