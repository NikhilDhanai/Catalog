import { Request, Response } from "express";
import pool from "../db";

export const getAllAddons = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM addons");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Error fetching addons");
  }
};

export const createAddon = async (req: Request, res: Response) => {
  const { name, price } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO addons (name, price) VALUES ($1, $2) RETURNING *",
      [name, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Error creating addon");
  }
};

export const deleteAddon = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM addons WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send("Error deleting addon");
  }
};
