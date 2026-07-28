import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { verifyPassword, createToken } from "@/lib/auth";
import { authRateLimit } from "@/middleware/rateLimiter";

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

async function loginHandler(request: NextRequest) {
  console.log("[LOGIN] Login request received");

  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    console.log(`[LOGIN] Looking up user: ${email}`);
    const dbPool = getPool();
    const dbClient = await dbPool.connect();

    try {
      const result = await dbClient.query(
        `SELECT id, email, password_hash, full_name FROM users WHERE email = $1`,
        [email.toLowerCase()]
      );

      if (result.rows.length === 0) {
        console.warn(`[LOGIN] ⚠️ User not found: ${email}`);
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const user = result.rows[0];

      // Verify password
      console.log("[LOGIN] Verifying password...");
      const isPasswordValid = await verifyPassword(password, user.password_hash);

      if (!isPasswordValid) {
        console.warn(`[LOGIN] ⚠️ Invalid password for: ${email}`);
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Update last login
      await dbClient.query(
        `UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1`,
        [user.id]
      );

      // Create token
      const token = createToken({
        userId: user.id,
        email: user.email,
      });

      console.log(`[LOGIN] ✅ Login successful: ${user.id}`);

      return NextResponse.json(
        {
          success: true,
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
          },
          token,
        },
        { status: 200 }
      );
    } finally {
      dbClient.release();
    }
  } catch (err: any) {
    console.error("[LOGIN] ❌ Error:", err.message);

    return NextResponse.json(
      {
        error: "Login failed",
        message: err.message,
      },
      { status: 500 }
    );
  }
}

// Apply rate limiting (5 requests per minute per IP)
export const POST = authRateLimit(loginHandler);

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
