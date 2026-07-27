/**
 * GET /api/user/wishlist - Get all wishlist items
 * POST /api/user/wishlist - Add to wishlist
 * 
 * Protected endpoint
 */

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { requireAuth } from "@/lib/auth-middleware";
import { randomUUID } from "crypto";

let pool: Pool | null = null;

function getPool() {
  if (pool) return pool;

  let DB_URL = process.env.DATABASE_URL;

  if (!DB_URL) {
    const pgHost = process.env.PGHOST;
    const pgPort = process.env.PGPORT || "5432";
    const pgUser = process.env.PGUSER;
    const pgPassword = process.env.PGPASSWORD;
    const pgDatabase = process.env.PGDATABASE || "railway";

    if (pgHost && pgUser && pgPassword) {
      DB_URL = `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}?sslmode=require`;
    }
  }

  if (!DB_URL) {
    throw new Error("DATABASE_URL not set");
  }

  pool = new Pool({ connectionString: DB_URL, max: 5 });
  return pool;
}

// GET - Get all wishlist items
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);

    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      const result = await client.query(
        `SELECT w.id, w.user_id, w.product_id, w.added_at,
                p.name, p.slug, p.price, p.rating, p.reviewCount, p.images, p.bgClass
         FROM wishlists w
         JOIN products p ON w.product_id = p.id
         WHERE w.user_id = $1
         ORDER BY w.added_at DESC`,
        [auth.userId]
      );

      return NextResponse.json({
        success: true,
        wishlist: result.rows,
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[GET /api/user/wishlist] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch wishlist" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

// POST - Add to wishlist
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      // Check if already in wishlist
      const existingResult = await client.query(
        `SELECT id FROM wishlists WHERE user_id = $1 AND product_id = $2`,
        [auth.userId, productId]
      );

      if (existingResult.rows.length > 0) {
        return NextResponse.json(
          { error: "Product already in wishlist" },
          { status: 400 }
        );
      }

      // Check if product exists
      const productResult = await client.query(
        `SELECT id FROM products WHERE id = $1`,
        [productId]
      );

      if (productResult.rows.length === 0) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      // Add to wishlist
      const wishlistId = randomUUID();
      const result = await client.query(
        `INSERT INTO wishlists (id, user_id, product_id)
         VALUES ($1, $2, $3)
         RETURNING id, user_id, product_id, added_at`,
        [wishlistId, auth.userId, productId]
      );

      // Log activity
      await client.query(
        `INSERT INTO user_activity (id, user_id, action, details) 
         VALUES (gen_random_uuid()::text, $1, $2, $3)`,
        [auth.userId, "wishlist_added", productId]
      );

      return NextResponse.json(
        {
          success: true,
          message: "Added to wishlist",
          wishlist: result.rows[0],
        },
        { status: 201 }
      );
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[POST /api/user/wishlist] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to add to wishlist" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
