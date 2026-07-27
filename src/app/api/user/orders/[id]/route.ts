/**
 * GET /api/user/orders/[id] - Get specific order details
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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    const { id } = await context.params;

    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      // Get order
      const orderResult = await client.query(
        `SELECT id, customer_email, customer_name, status, total_amount, currency,
                payment_intent_id, shipping_address, tracking_number, user_id,
                created_at, updated_at
         FROM orders 
         WHERE id = $1`,
        [id]
      );

      if (orderResult.rows.length === 0) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      const order = orderResult.rows[0];

      // Check ownership
      if (order.user_id !== auth.userId && order.customer_email !== auth.email) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }

      // Get order items
      const itemsResult = await client.query(
        `SELECT id, order_id, product_id, product_name, price, quantity, total
         FROM order_items 
         WHERE order_id = $1`,
        [id]
      );

      return NextResponse.json({
        success: true,
        order: {
          ...order,
          items: itemsResult.rows,
        },
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[GET /api/user/orders/:id] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch order" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
