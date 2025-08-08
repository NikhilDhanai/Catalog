// src/services/api.ts
import axios from "axios";
import type { Product, ProductType } from "../types";

const API_URL = "https://catalog-gz1c.onrender.com/api";

// Fetches the list of all product types
export const getProductTypes = async (): Promise<ProductType[]> => {
  try {
    const response = await axios.get<ProductType[]>(`${API_URL}/types`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product types:", error);
    return [];
  }
};

// Fetches product listings, optionally filtered by typeId
export const getProductListings = async (
  typeId: number | null = null
): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}/product-listings`, {
      params: { typeId },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product listings:", error);
    return [];
  }
};
