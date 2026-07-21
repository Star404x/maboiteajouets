import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Create pool lazily on first request
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
    throw new Error(
      "DATABASE_URL not set and could not construct from PGHOST/PGUSER/PGPASSWORD"
    );
  }

  pool = new Pool({
    connectionString: DB_URL,
    max: 5,
  });

  return pool;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "recent"; // recent, helpful, rating
    const random = searchParams.get("random") === "true"; // Get random reviews (for homepage)

    const pool = getPool();
    const client = await pool.connect();

    try {
      let query = `
        SELECT 
          id, productId, author, rating, content, date, 
          avatarColor, verified_purchase, helpful_count
        FROM reviews
      `;

      const params: any[] = [];
      
      // Filter by product if specified, else get random for homepage
      if (productId) {
        query += `WHERE productId = $1`;
        params.push(productId);
      } else if (!random) {
        return NextResponse.json(
          { error: "Either productId or random=true is required" },
          { status: 400 }
        );
      }

      // Sort
      if (random) {
        query += ` ORDER BY RANDOM()`;
      } else {
        switch (sortBy) {
          case "helpful":
            query += ` ORDER BY helpful_count DESC, created_at DESC`;
            break;
          case "highest_rating":
            query += ` ORDER BY rating DESC, created_at DESC`;
            break;
          case "lowest_rating":
            query += ` ORDER BY rating ASC, created_at DESC`;
            break;
          case "recent":
          default:
            query += ` ORDER BY created_at DESC`;
        }
      }

      query += ` LIMIT $${params.length + 1}`;
      params.push(limit);

      const logMsg = productId
        ? `[REVIEWS] Fetching ${limit} reviews for product ${productId} (sort: ${sortBy})`
        : `[REVIEWS] Fetching ${limit} random reviews for homepage`;
      console.log(logMsg);

      const result = await client.query(query, params);

      // Get review stats (for product or overall)
      let statsQuery = `
        SELECT 
          COUNT(*) as total,
          AVG(rating)::DECIMAL(2,1) as average_rating,
          COUNT(CASE WHEN rating = 5 THEN 1 END) as count_5_stars,
          COUNT(CASE WHEN rating = 4 THEN 1 END) as count_4_stars,
          COUNT(CASE WHEN rating = 3 THEN 1 END) as count_3_stars,
          COUNT(CASE WHEN rating = 2 THEN 1 END) as count_2_stars,
          COUNT(CASE WHEN rating = 1 THEN 1 END) as count_1_stars
        FROM reviews
      `;
      const statsParams: any[] = [];

      if (productId) {
        statsQuery += `WHERE productId = $1`;
        statsParams.push(productId);
      }

      const statsResult = await client.query(statsQuery, statsParams);

      const stats = statsResult.rows[0];

      return NextResponse.json({
        success: true,
        productId,
        reviews: result.rows,
        stats: {
          total: parseInt(stats.total),
          averageRating: parseFloat(stats.average_rating) || 0,
          distribution: {
            5: parseInt(stats.count_5_stars),
            4: parseInt(stats.count_4_stars),
            3: parseInt(stats.count_3_stars),
            2: parseInt(stats.count_2_stars),
            1: parseInt(stats.count_1_stars),
          },
        },
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[REVIEWS ERROR]", error.message);
    return NextResponse.json(
      {
        error: "Failed to fetch reviews",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productId,
      author,
      rating,
      content,
      email,
    } = body;

    // Validation
    if (!productId || !author || !rating || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (content.length < 10) {
      return NextResponse.json(
        { error: "Review content must be at least 10 characters" },
        { status: 400 }
      );
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      const reviewId = `r-${productId}-${Date.now()}`;
      const today = new Date().toISOString().split("T")[0];

      const result = await client.query(
        `
        INSERT INTO reviews 
          (id, productId, author, rating, content, date, verified_purchase)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, productId, author, rating, content, date, verified_purchase
      `,
        [reviewId, productId, author, rating, content, today, false]
      );

      console.log(`[REVIEWS] New review created: ${reviewId} for product ${productId}`);

      return NextResponse.json(
        {
          success: true,
          review: result.rows[0],
          message: "Review submitted (pending moderation)",
        },
        { status: 201 }
      );
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[REVIEWS POST ERROR]", error.message);
    return NextResponse.json(
      {
        error: "Failed to create review",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
