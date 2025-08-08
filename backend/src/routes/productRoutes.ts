import express from "express";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
} from "../controllers/productController";

const router = express.Router();

// Get all products
router.get("/", getAllProducts);

// Create a new product
router.post("/", createProduct);

// Delete a product by ID
router.delete("/:id", deleteProduct);

export default router;
