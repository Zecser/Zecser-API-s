import express from "express";
import * as subCategoryController from "../controllers/subcategoryController";

const router = express.Router();

const notImplemented = (req: express.Request, res: express.Response) =>
	res.status(501).json({ error: "Not implemented" });

const ensureHandler = (fnName: string) => {
	const fn = (subCategoryController as any)[fnName];
	return typeof fn === "function" ? fn : notImplemented;
};

router.get("/", ensureHandler("listSubcategories"));       // list all or by category
router.get("/:id", ensureHandler("getSubcategoryById"));

// POST /api/subcategories
router.post("/", ensureHandler("createSubcategory"));

// PUT /api/subcategories/:id
router.put("/:id", ensureHandler("updateSubcategory"));

// DELETE /api/subcategories/:id
router.delete("/:id", ensureHandler("deleteSubcategory"));

export default router;


/* ---------------- Swagger Annotations ---------------- */

/**
 * @swagger
 * /api/subcategories:
 *   get:
 *     summary: List all subcategories or by category
 *     tags: [Subcategories]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Optional category ID to filter subcategories
 *     responses:
 *       200:
 *         description: List of subcategories
 */

/**
 * @swagger
 * /api/subcategories:
 *   post:
 *     summary: Create a new subcategory
 *     tags: [Subcategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subcategory created
 */


/**
 * @swagger
 * /api/subcategories/{id}:
 *   get:
 *     summary: Get subcategory by ID
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory details
 *       404:
 *         description: Subcategory not found
 */

/**
 * @swagger
 * /api/subcategories/{id}:
 *   put:
 *     summary: Update subcategory by ID
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcategory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subcategory updated
 *       404:
 *         description: Subcategory not found
 */

/**
 * @swagger
 * /api/subcategories/{id}:
 *   delete:
 *     summary: Delete subcategory by ID
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory deleted
 *       404:
 *         description: Subcategory not found
 */

