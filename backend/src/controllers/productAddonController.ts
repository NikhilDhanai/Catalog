// src/controllers/productAddonController.ts
import { Request, Response } from "express";
import pool from "../db";

// POST: Link a product with an addon
export const createProductAddon = async (req: Request, res: Response) => {
  const { product_id, addon_id } = req.body;

  if (!product_id || !addon_id) {
    return res.status(400).send("product_id and addon_id are required.");
  }

  try {
    const query = `
      INSERT INTO product_addons (product_id, addon_id) 
      VALUES ($1, $2) 
      RETURNING *`;

    const result = await pool.query(query, [product_id, addon_id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating product-addon link:", err);
    res.status(500).send("Error creating product-addon link");
  }
};

// GET: Retrieve all addons for a specific product
export const getAddonsByProduct = async (req: Request, res: Response) => {
  const { product_id } = req.params;
  try {
    const query = `
            SELECT a.*
            FROM addons a
            JOIN product_addons pa ON a.id = pa.addon_id
            WHERE pa.product_id = $1
        `;
    const result = await pool.query(query, [product_id]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching addons for product:", err);
    res.status(500).send("Error fetching addons for product");
  }
};

// DELETE: Remove a link between a product and an addon
export const deleteProductAddon = async (req: Request, res: Response) => {
  const { product_id, addon_id } = req.body;
  if (!product_id || !addon_id) {
    return res.status(400).send("product_id and addon_id are required.");
  }

  try {
    const result = await pool.query(
      "DELETE FROM product_addons WHERE product_id = $1 AND addon_id = $2 RETURNING *",
      [product_id, addon_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Product-addon link not found");
    }
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting product-addon link:", err);
    res.status(500).send("Error deleting product-addon link");
  }
};
