/**
 * DELETE /api/user/wishlist/[productId] - Remove from wishlist
 */

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { requireAuth } from "@/lib/auth-middleware";

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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const auth = requireAuth(request);
    const { productId } = await context.params;

    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      // Check ownership
      const ownershipCheck = await client.query(
        `SELECT user_id FROM wishlists WHERE user_id = $1 AND product_id = $2`,
        [auth.userId, productId]
      );

      if (ownershipCheck.rows.length === 0) {
        return NextResponse.json(
          { error: "Item not found in wishlist" },
          { status: 404 }
        );
      }

      // Delete from wishlist
      await client.query(
        `DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2`,
        [auth.userId, productId]
      );

      // Log activity
      await client.query(
        `INSERT INTO user_activity (id, user_id, action, details) 
         VALUES (gen_random_uuid()::text, $1, $2, $3)`,
        [auth.userId, "wishlist_removed", productId]
      );

      return NextResponse.json({
        success: true,
        message: "Removed from wishlist",
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[DELETE /api/user/wishlist/:productId] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to remove from wishlist" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
