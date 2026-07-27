/**
 * GET /api/user/orders - Get all user orders
 * 
 * Protected endpoint
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

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    
    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      // Get orders for user
      const ordersResult = await client.query(
        `SELECT id, customer_email, customer_name, status, total_amount, currency,
                payment_intent_id, shipping_address, tracking_number, 
                created_at, updated_at
         FROM orders 
         WHERE user_id = $1 OR customer_email = $2
         ORDER BY created_at DESC
         LIMIT 50`,
        [auth.userId, auth.email]
      );

      // Get order items for each order
      const ordersWithItems = await Promise.all(
        ordersResult.rows.map(async (order) => {
          const itemsResult = await client.query(
            `SELECT id, order_id, product_id, product_name, price, quantity, total
             FROM order_items 
             WHERE order_id = $1`,
            [order.id]
          );

          return {
            ...order,
            items: itemsResult.rows,
          };
        })
      );

      return NextResponse.json({
        success: true,
        orders: ordersWithItems,
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[GET /api/user/orders] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
