/**
 * Simple endpoint to update product price from static PRODUCTS array
 * No auth required - for development/testing only
 */

import { Pool } from "pg";
import { PRODUCTS } from "@/lib/data/products";

export async function POST(request: Request) {
  try {
    const { productId, newPrice } = await request.json();

    if (!productId || newPrice === undefined) {
      return Response.json(
        { success: false, error: "Missing productId or newPrice" },
        { status: 400 }
      );
    }

    // Find product in static PRODUCTS array to get the actual price
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      return Response.json(
        { success: false, error: "Product not found in catalog" },
        { status: 404 }
      );
    }

    // Get pool connection
    if (!process.env.DATABASE_URL) {
      return Response.json(
        { success: false, error: "DATABASE_URL not set" },
        { status: 500 }
      );
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
    const client = await pool.connect();

    try {
      // Update price in database
      const result = await client.query(
        "UPDATE products SET price = $1 WHERE id = $2 RETURNING id, name, price",
        [newPrice, productId]
      );

      if (result.rows.length === 0) {
        // Product doesn't exist in DB, insert it
        await client.query(
          "INSERT INTO products (id, name, price) VALUES ($1, $2, $3)",
          [productId, product.name, newPrice]
        );
        return Response.json({
          success: true,
          message: `Created product ${productId} with price €${newPrice}`,
          id: productId,
          price: newPrice,
        });
      }

      console.log(`[UPDATE-PRICE] ${productId} → €${newPrice}`);

      return Response.json({
        success: true,
        message: `Updated ${result.rows[0].name} to €${newPrice}`,
        product: result.rows[0],
      });
    } finally {
      client.release();
      pool.end();
    }
  } catch (error: any) {
    console.error("[UPDATE-PRICE] Error:", error.message);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
