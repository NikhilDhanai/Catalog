import express from "express";
import {
  getAllVariants,
  createVariant,
  deleteVariant,
} from "../controllers/variantController";

const router = express.Router();

// GET all variants
router.get("/", getAllVariants);

// POST a new variant
router.post("/", createVariant);

// DELETE a variant by ID
router.delete("/:id", deleteVariant);

export default router;
