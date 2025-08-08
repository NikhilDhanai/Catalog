// src/controllers/productListingController.ts
import { Request, Response } from "express";
import pool from "../db";

export const getProductListings = async (req: Request, res: Response) => {
  const { typeId } = req.query; // Get the optional typeId from the query parameters

  let query = `
    SELECT 
        p.id, p.name, p.description, p.product_type_id, p.image_urls, p.created_at,
        pt.name AS product_type,
        json_agg(DISTINCT pv.*) AS variants,
        (
            SELECT json_agg(DISTINCT a.*) 
            FROM addons a
            JOIN product_addons pa ON a.id = pa.addon_id
            WHERE pa.product_id = p.id
        ) AS addons
    FROM 
        products p
    JOIN 
        product_types pt ON p.product_type_id = pt.id
    LEFT JOIN 
        product_variants pv ON p.id = pv.product_id
  `;

  const queryParams = [];
  if (typeId) {
    query += ` WHERE p.product_type_id = $1`;
    queryParams.push(typeId);
  }

  query += `
    GROUP BY 
        p.id, pt.name
    ORDER BY
        p.id;
  `;

  try {
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching product listings with filter:", err);
    res.status(500).send("Error fetching product listings with filter");
  }
};
