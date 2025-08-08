// src/routes/productAddonRoutes.ts
import { Router } from "express";
import {
  createProductAddon,
  getAddonsByProduct,
  deleteProductAddon,
} from "../controllers/productAddonController";

const router = Router();

// POST /api/product-addons
router.post("/", createProductAddon);

// GET /api/product-addons/:product_id
router.get("/:product_id", getAddonsByProduct);

// DELETE /api/product-addons
router.delete("/", deleteProductAddon);

export default router;
