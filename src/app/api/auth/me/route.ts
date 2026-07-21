import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

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

  pool = new Pool({
    connectionString: DB_URL,
    max: 5,
  });

  return pool;
}

export async function GET(request: NextRequest) {
  console.log("[ME] Check current user request");

  try {
    // Get token from header
    const authHeader = request.headers.get("Authorization");
    const token = getTokenFromHeader(authHeader);

    if (!token) {
      console.warn("[ME] ⚠️ No token provided");
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      console.warn("[ME] ⚠️ Invalid or expired token");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get user from database
    const dbPool = getPool();
    const dbClient = await dbPool.connect();

    try {
      const result = await dbClient.query(
        `SELECT id, email, full_name, phone, address_line_1, address_line_2, city, postal_code, country, newsletter_subscribed, created_at FROM users WHERE id = $1`,
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        console.warn(`[ME] ⚠️ User not found: ${decoded.userId}`);
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const user = result.rows[0];

      console.log(`[ME] ✅ User retrieved: ${user.id}`);

      return NextResponse.json(
        {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            phone: user.phone,
            address: {
              line1: user.address_line_1,
              line2: user.address_line_2,
              city: user.city,
              postalCode: user.postal_code,
              country: user.country,
            },
            newsletterSubscribed: user.newsletter_subscribed,
            createdAt: user.created_at,
          },
        },
        { status: 200 }
      );
    } finally {
      dbClient.release();
    }
  } catch (err: any) {
    console.error("[ME] ❌ Error:", err.message);

    return NextResponse.json(
      {
        error: "Failed to get user",
        message: err.message,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
