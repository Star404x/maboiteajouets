/**
 * GET /api/user/addresses - Get all user addresses
 * POST /api/user/addresses - Create new address
 * 
 * Protected endpoint
 */

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { requireAuth } from "@/lib/auth-middleware";
import type { UserAddress, AddressCreateRequest } from "@/lib/types/user";
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

// GET - List all addresses for user
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      const result = await client.query(
        `SELECT id, user_id, type, first_name, last_name, street, city, 
                postal_code, country, phone, is_default, created_at, updated_at
         FROM user_addresses 
         WHERE user_id = $1 
         ORDER BY is_default DESC, created_at DESC`,
        [auth.userId]
      );

      return NextResponse.json({
        success: true,
        addresses: result.rows as UserAddress[],
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[GET /api/user/addresses] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch addresses" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

// POST - Create new address
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const body = (await request.json()) as AddressCreateRequest;

    // Validation
    if (!body.first_name || !body.last_name || !body.street || !body.city || !body.postal_code || !body.country) {
      return NextResponse.json(
        { error: "Missing required address fields" },
        { status: 400 }
      );
    }

    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      const addressId = randomUUID();

      const result = await client.query(
        `INSERT INTO user_addresses 
         (id, user_id, type, first_name, last_name, street, city, postal_code, country, phone, is_default)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id, user_id, type, first_name, last_name, street, city, 
                   postal_code, country, phone, is_default, created_at, updated_at`,
        [
          addressId,
          auth.userId,
          body.type || "home",
          body.first_name,
          body.last_name,
          body.street,
          body.city,
          body.postal_code,
          body.country,
          body.phone || null,
          body.is_default || false,
        ]
      );

      const address = result.rows[0];

      // Log activity
      await client.query(
        `INSERT INTO user_activity (id, user_id, action, details) 
         VALUES (gen_random_uuid()::text, $1, $2, $3)`,
        [auth.userId, "address_created", address.id]
      );

      return NextResponse.json(
        {
          success: true,
          message: "Address created successfully",
          address: address as UserAddress,
        },
        { status: 201 }
      );
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[POST /api/user/addresses] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to create address" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
