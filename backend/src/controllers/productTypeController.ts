import { Request, Response } from "express";
import pool from "../db";

export const getAllProductTypes = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM product_types");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Error fetching product types");
  }
};

export const createProductType = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO product_types (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Error creating product type");
  }
};

export const deleteProductType = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM product_types WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send("Error deleting product type");
  }
};
