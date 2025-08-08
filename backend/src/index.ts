import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Import routes
import productRoutes from "./routes/productRoutes";
import variantRoutes from "./routes/variantRoutes";
import typeRoutes from "./routes/productTypeRoutes";
import addonRoutes from "./routes/addonRoutes";
import productListingRoutes from "./routes/productListingRoutes"; // ✅ fixed name
import productAddonRoutes from "./routes/productAddonRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Route handlers
app.use("/api/products", productRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/types", typeRoutes);
app.use("/api/addons", addonRoutes);
app.use("/api/product-addons", productAddonRoutes);
app.use("/api/product-listings", productListingRoutes); // ✅ fixed path

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
