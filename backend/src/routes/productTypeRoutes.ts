import express from "express";
import {
  getAllProductTypes,
  createProductType,
  deleteProductType,
} from "../controllers/productTypeController";

const router = express.Router();

// Get all product types
router.get("/", getAllProductTypes);

// Create a new product type
router.post("/", createProductType);

// Delete a product type by ID
router.delete("/:id", deleteProductType);

export default router;
