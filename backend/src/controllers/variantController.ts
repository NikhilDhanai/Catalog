// src/controllers/variantController.ts
import { Request, Response } from "express";
import pool from "../db";

// GET all variants
export const getAllVariants = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM product_variants");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching variants:", err);
    res.status(500).send("Error fetching variants");
  }
};

// GET a single variant by ID
export const getVariantById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM product_variants WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Variant not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching variant by ID:", err);
    res.status(500).send("Error fetching variant");
  }
};

// POST a new variant
export const createVariant = async (req: Request, res: Response) => {
  const { product_id, size, color, price, stock, sku } = req.body;

  // Basic validation to ensure required fields are present
  if (!product_id || !price || !stock || !sku) {
    return res
      .status(400)
      .send("product_id, price, stock, and sku are required.");
  }

  try {
    const query = `
      INSERT INTO product_variants (product_id, size, color, price, stock, sku) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`;

    const result = await pool.query(query, [
      product_id,
      size,
      color,
      price,
      stock,
      sku,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating variant:", err);
    res.status(500).send("Error creating variant");
  }
};

// PUT/PATCH to update a variant
export const updateVariant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { product_id, size, color, price, stock, sku } = req.body;

  try {
    const query = `
      UPDATE product_variants 
      SET 
        product_id = COALESCE($1, product_id), 
        size = COALESCE($2, size), 
        color = COALESCE($3, color), 
        price = COALESCE($4, price),
        stock = COALESCE($5, stock),
        sku = COALESCE($6, sku)
      WHERE id = $7 
      RETURNING *`;

    const result = await pool.query(query, [
      product_id,
      size,
      color,
      price,
      stock,
      sku,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).send("Variant not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating variant:", err);
    res.status(500).send("Error updating variant");
  }
};

// DELETE a variant
export const deleteVariant = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM product_variants WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Variant not found");
    }
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting variant:", err);
    res.status(500).send("Error deleting variant");
  }
};
