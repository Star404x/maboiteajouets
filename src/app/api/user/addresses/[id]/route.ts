/**
 * PUT /api/user/addresses/[id] - Update address
 * DELETE /api/user/addresses/[id] - Delete address
 */

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { requireAuth } from "@/lib/auth-middleware";
import type { UserAddress, AddressCreateRequest } from "@/lib/types/user";

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

// PUT - Update address
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    const { id } = await context.params;
    const body = (await request.json()) as Partial<AddressCreateRequest>;

    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      // Check ownership
      const ownershipCheck = await client.query(
        `SELECT user_id FROM user_addresses WHERE id = $1`,
        [id]
      );

      if (ownershipCheck.rows.length === 0) {
        return NextResponse.json(
          { error: "Address not found" },
          { status: 404 }
        );
      }

      if (ownershipCheck.rows[0].user_id !== auth.userId) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }

      // Build update query
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (body.type !== undefined) {
        fields.push(`type = $${paramCount}`);
        values.push(body.type);
        paramCount++;
      }

      if (body.first_name !== undefined) {
        fields.push(`first_name = $${paramCount}`);
        values.push(body.first_name);
        paramCount++;
      }

      if (body.last_name !== undefined) {
        fields.push(`last_name = $${paramCount}`);
        values.push(body.last_name);
        paramCount++;
      }

      if (body.street !== undefined) {
        fields.push(`street = $${paramCount}`);
        values.push(body.street);
        paramCount++;
      }

      if (body.city !== undefined) {
        fields.push(`city = $${paramCount}`);
        values.push(body.city);
        paramCount++;
      }

      if (body.postal_code !== undefined) {
        fields.push(`postal_code = $${paramCount}`);
        values.push(body.postal_code);
        paramCount++;
      }

      if (body.country !== undefined) {
        fields.push(`country = $${paramCount}`);
        values.push(body.country);
        paramCount++;
      }

      if (body.phone !== undefined) {
        fields.push(`phone = $${paramCount}`);
        values.push(body.phone);
        paramCount++;
      }

      if (body.is_default !== undefined) {
        fields.push(`is_default = $${paramCount}`);
        values.push(body.is_default);
        paramCount++;
      }

      if (fields.length === 0) {
        return NextResponse.json(
          { error: "No fields to update" },
          { status: 400 }
        );
      }

      fields.push(`updated_at = NOW()`);
      values.push(id);

      const query = `
        UPDATE user_addresses 
        SET ${fields.join(", ")} 
        WHERE id = $${paramCount}
        RETURNING id, user_id, type, first_name, last_name, street, city, 
                  postal_code, country, phone, is_default, created_at, updated_at
      `;

      const result = await client.query(query, values);

      return NextResponse.json({
        success: true,
        message: "Address updated successfully",
        address: result.rows[0] as UserAddress,
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[PUT /api/user/addresses/:id] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to update address" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

// DELETE - Delete address
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    const { id } = await context.params;

    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      // Check ownership
      const ownershipCheck = await client.query(
        `SELECT user_id FROM user_addresses WHERE id = $1`,
        [id]
      );

      if (ownershipCheck.rows.length === 0) {
        return NextResponse.json(
          { error: "Address not found" },
          { status: 404 }
        );
      }

      if (ownershipCheck.rows[0].user_id !== auth.userId) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }

      await client.query(
        `DELETE FROM user_addresses WHERE id = $1`,
        [id]
      );

      // Log activity
      await client.query(
        `INSERT INTO user_activity (id, user_id, action, details) 
         VALUES (gen_random_uuid()::text, $1, $2, $3)`,
        [auth.userId, "address_deleted", id]
      );

      return NextResponse.json({
        success: true,
        message: "Address deleted successfully",
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[DELETE /api/user/addresses/:id] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to delete address" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
