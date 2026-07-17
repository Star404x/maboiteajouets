// Netlify Function: Get all prices from database
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async (req, context) => {
  if (req.method !== "GET") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const client = await pool.connect();
    const result = await client.query("SELECT id, name, price FROM products ORDER BY id");
    client.release();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=60, public", // Cache 1 minute
      },
      body: JSON.stringify({
        success: true,
        prices: result.rows,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error("[get-prices] Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
