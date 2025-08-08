import express from "express";
import { getProductListings } from "../controllers/productListingController";

const router = express.Router();

// Get full product listings with type, variants, and addons
router.get("/", getProductListings);

export default router;
