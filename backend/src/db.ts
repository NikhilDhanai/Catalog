// db.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase SSL
  },
});

// Test connection on startup
pool
  .connect()
  .then(() => console.log("✅ Connected to Supabase database"))
  .catch((err) => console.error("❌ Database connection error:", err));

export default pool;
