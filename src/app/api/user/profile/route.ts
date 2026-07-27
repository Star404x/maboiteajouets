/**
 * GET /api/user/profile - Get current user profile
 * PUT /api/user/profile - Update user profile
 * 
 * Protected endpoint - requires Bearer token
 */

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { requireAuth } from "@/lib/auth-middleware";
import type { User, ProfileUpdateRequest } from "@/lib/types/user";

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

// GET - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      const result = await client.query(
        `SELECT id, email, full_name, phone, birth_date, gender, newsletter, 
                avatar_url, bio, created_at, updated_at 
         FROM users WHERE id = $1`,
        [auth.userId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const user = result.rows[0];

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          birth_date: user.birth_date,
          gender: user.gender,
          newsletter: user.newsletter,
          avatar_url: user.avatar_url,
          bio: user.bio,
          created_at: user.created_at,
          updated_at: user.updated_at,
        } as User,
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[GET /api/user/profile] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const body = (await request.json()) as ProfileUpdateRequest;

    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      // Build update query dynamically
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (body.full_name !== undefined) {
        fields.push(`full_name = $${paramCount}`);
        values.push(body.full_name);
        paramCount++;
      }

      if (body.phone !== undefined) {
        fields.push(`phone = $${paramCount}`);
        values.push(body.phone);
        paramCount++;
      }

      if (body.birth_date !== undefined) {
        fields.push(`birth_date = $${paramCount}`);
        values.push(body.birth_date);
        paramCount++;
      }

      if (body.gender !== undefined) {
        fields.push(`gender = $${paramCount}`);
        values.push(body.gender);
        paramCount++;
      }

      if (body.newsletter !== undefined) {
        fields.push(`newsletter = $${paramCount}`);
        values.push(body.newsletter);
        paramCount++;
      }

      if (body.bio !== undefined) {
        fields.push(`bio = $${paramCount}`);
        values.push(body.bio);
        paramCount++;
      }

      if (fields.length === 0) {
        return NextResponse.json(
          { error: "No fields to update" },
          { status: 400 }
        );
      }

      fields.push(`updated_at = NOW()`);
      values.push(auth.userId);

      const query = `
        UPDATE users 
        SET ${fields.join(", ")} 
        WHERE id = $${paramCount}
        RETURNING id, email, full_name, phone, birth_date, gender, newsletter, 
                  avatar_url, bio, created_at, updated_at
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const user = result.rows[0];

      // Log activity
      await client.query(
        `INSERT INTO user_activity (id, user_id, action, details) 
         VALUES (gen_random_uuid()::text, $1, $2, $3)`,
        [auth.userId, "profile_update", JSON.stringify(body)]
      );

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          birth_date: user.birth_date,
          gender: user.gender,
          newsletter: user.newsletter,
          avatar_url: user.avatar_url,
          bio: user.bio,
          created_at: user.created_at,
          updated_at: user.updated_at,
        } as User,
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[PUT /api/user/profile] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    );
  }
}
