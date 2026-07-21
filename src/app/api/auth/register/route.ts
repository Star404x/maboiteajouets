import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { randomUUID } from "crypto";
import {
  hashPassword,
  isValidEmail,
  isValidPassword,
  createToken,
} from "@/lib/auth";

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

export async function POST(request: NextRequest) {
  console.log("[REGISTER] Registration request received");

  try {
    const body = await request.json();
    const { email, password, passwordConfirm, fullName } = body;

    // Validation
    if (!email || !password || !passwordConfirm) {
      return NextResponse.json(
        { error: "Email, password, and password confirmation are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password !== passwordConfirm) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          error: "Password does not meet requirements",
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Hash password
    console.log("[REGISTER] Hashing password...");
    const passwordHash = await hashPassword(password);

    // Create user in database
    console.log(`[REGISTER] Creating user: ${email}`);
    const dbPool = getPool();
    const dbClient = await dbPool.connect();

    try {
      const userId = `user_${randomUUID()}`; 

      const result = await dbClient.query(
        `INSERT INTO users (id, email, password_hash, full_name, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING id, email, full_name, created_at`,
        [userId, email.toLowerCase(), passwordHash, fullName || null]
      );

      if (result.rows.length === 0) {
        throw new Error("Failed to create user");
      }

      const user = result.rows[0];

      // Create token
      const token = createToken({
        userId: user.id,
        email: user.email,
      });

      console.log(`[REGISTER] ✅ User created: ${user.id}`);

      return NextResponse.json(
        {
          success: true,
          message: "Registration successful",
          user: {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
          },
          token,
        },
        { status: 201 }
      );
    } finally {
      dbClient.release();
    }
  } catch (err: any) {
    console.error("[REGISTER] ❌ Error:", err.message);

    // Handle duplicate email
    if (err.code === "23505") {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Registration failed",
        message: err.message,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
