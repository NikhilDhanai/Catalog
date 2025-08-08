// src/controllers/productController.ts
import { Request, Response } from "express";
import pool from "../db";

// GET all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Error fetching products");
  }
};

// GET a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Product not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).send("Error fetching product");
  }
};

// POST a new product
export const createProduct = async (req: Request, res: Response) => {
  const { name, product_type_id, description, image_urls } = req.body;

  // Basic validation to ensure required fields are present
  if (!name || !product_type_id) {
    return res.status(400).send("Name and product_type_id are required.");
  }

  try {
    const query = `
      INSERT INTO products (name, product_type_id, description, image_urls) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *`;

    const result = await pool.query(query, [
      name,
      product_type_id,
      description,
      image_urls,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).send("Error creating product");
  }
};

// PUT/PATCH to update a product
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, product_type_id, description, image_urls } = req.body;

  try {
    const query = `
      UPDATE products 
      SET 
        name = COALESCE($1, name), 
        product_type_id = COALESCE($2, product_type_id), 
        description = COALESCE($3, description), 
        image_urls = COALESCE($4, image_urls) 
      WHERE id = $5 
      RETURNING *`;

    const result = await pool.query(query, [
      name,
      product_type_id,
      description,
      image_urls,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).send("Product not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Error updating product");
  }
};

// DELETE a product
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Product not found");
    }
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).send("Error deleting product");
  }
};
