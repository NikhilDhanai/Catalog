// src/types/index.ts

export interface ProductType {
  id: number;
  name: string;
}

export interface Addon {
  id: number;
  name: string;
  price: number;
}

export interface Variant {
  id: number;
  product_id: number;
  size: string;
  color: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  product_type_id: number;
  image_urls: string[];
  created_at: string;
  product_type: string;
  variants: Variant[];
  addons: Addon[] | null[]; // Can be an array of addons or nulls if none exist
}
