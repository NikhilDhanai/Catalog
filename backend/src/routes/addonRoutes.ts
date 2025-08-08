import express from "express";
import {
  getAllAddons,
  createAddon,
  deleteAddon,
} from "../controllers/addonController";

const router = express.Router();

// Get all addons
router.get("/", getAllAddons);

// Create a new addon
router.post("/", createAddon);

// Delete an addon by ID
router.delete("/:id", deleteAddon);

export default router;
