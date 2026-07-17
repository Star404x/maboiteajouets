// Netlify Function: Update product price
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Simple API key protection
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "default-insecure-key";

export default async (req, context) => {
  if (req.method !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  // Check API key
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== ADMIN_API_KEY) {
    console.warn("[update-price] Unauthorized request");
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, error: "Unauthorized" }),
    };
  }

  try {
    const { id, price } = JSON.parse(req.body);

    if (!id || typeof price !== "number" || price < 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Invalid id or price",
        }),
      };
    }

    const client = await pool.connect();
    
    // Update price
    const result = await client.query(
      "UPDATE products SET price = $1 WHERE id = $2 RETURNING id, name, price",
      [price, id]
    );
    
    client.release();

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: "Product not found" }),
      };
    }

    console.log(`[update-price] ✅ Updated ${id} to €${price}`);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        product: result.rows[0],
        message: `Price updated for ${result.rows[0].name}`,
      }),
    };
  } catch (error) {
    console.error("[update-price] Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
