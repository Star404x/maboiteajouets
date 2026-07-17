import { Handler } from "@netlify/functions";
import { Pool } from "pg";

const handler: Handler = async (event, context) => {
  console.log(`[prices function] Method: ${event.httpMethod}`);

  const dbUrl = "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require";
  const adminKey = "admin123";

  const pool = new Pool({
    connectionString: dbUrl,
  });

  try {
    if (event.httpMethod === "GET") {
      console.log("[prices function] Connecting to DB for GET...");
      const client = await pool.connect();
      const result = await client.query(
        "SELECT id, name, price FROM products ORDER BY id"
      );
      client.release();

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          prices: result.rows,
          timestamp: new Date().toISOString(),
        }),
      };
    }

    if (event.httpMethod === "POST") {
      console.log("[prices function] Processing POST request");
      const apiKey = event.headers["x-api-key"];

      if (apiKey !== adminKey) {
        console.warn("[prices function] Unauthorized");
        return {
          statusCode: 401,
          body: JSON.stringify({ success: false, error: "Unauthorized" }),
        };
      }

      const body = JSON.parse(event.body || "{}");
      const { id, price } = body;

      if (!id || typeof price !== "number" || price < 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: "Invalid id or price",
          }),
        };
      }

      console.log(`[prices function] Updating ${id} to ${price}`);
      const client = await pool.connect();
      const result = await client.query(
        "UPDATE products SET price = $1 WHERE id = $2 RETURNING id, name, price",
        [price, id]
      );
      client.release();

      if (result.rows.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            success: false,
            error: "Product not found",
          }),
        };
      }

      console.log(`[prices function] ✅ Updated ${id}`);
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          product: result.rows[0],
        }),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (error: any) {
    console.error("[prices function] ❌ Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};

export { handler };
