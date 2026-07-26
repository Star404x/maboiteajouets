import { Pool } from "pg";
import { REVIEWS } from "@/lib/data/reviews";
import { PRODUCTS } from "@/lib/data/products";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const adminKey = process.env.ADMIN_API_KEY || "";

    if (!authHeader?.startsWith("Bearer ") || authHeader.slice(7) !== adminKey) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.DATABASE_URL) {
      return Response.json({ success: false, error: "DATABASE_URL not set" }, { status: 500 });
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
    const client = await pool.connect();

    try {
      // Calculate reviewCount for each product from REVIEWS
      const reviewCountByProduct: { [key: string]: number } = {};
      REVIEWS.forEach((review) => {
        const productNum = review.id.split("-")[1];
        const productId = `p-${productNum}`;
        reviewCountByProduct[productId] = (reviewCountByProduct[productId] || 0) + 1;
      });

      let updated = 0;
      let skipped = 0;

      // Update reviewcount for each product
      for (const [productId, count] of Object.entries(reviewCountByProduct)) {
        const result = await client.query(
          "UPDATE products SET reviewcount = $1 WHERE id = $2",
          [count, productId]
        );

        if (result.rowCount && result.rowCount > 0) {
          updated++;
        } else {
          skipped++;
        }
      }

      return Response.json({
        success: true,
        message: `Loaded review counts for ${updated} products`,
        skipped,
        totalProductsWithReviews: Object.keys(reviewCountByProduct).length,
      });
    } finally {
      client.release();
      pool.end();
    }
  } catch (error) {
    console.error("[load-all-reviews]", error);
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
