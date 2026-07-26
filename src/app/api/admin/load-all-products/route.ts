import { Pool } from "pg";
import { PRODUCTS } from "@/lib/data/products";
import { REVIEWS } from "@/lib/data/reviews";

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

      let inserted = 0;
      let updated = 0;

      // Insert or update all products from static PRODUCTS array
      for (const product of PRODUCTS) {
        const reviewCount = reviewCountByProduct[product.id] || 0;
        
        const result = await client.query(
          `INSERT INTO products (id, name, description, price, images, category, rating, reviewcount)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO UPDATE SET 
           name = $2, 
           description = $3, 
           price = $4, 
           images = $5, 
           category = $6, 
           rating = $7, 
           reviewcount = $8`,
          [
            product.id,
            product.name,
            product.description,
            product.price,
            product.images, // PostgreSQL array type
            product.category,
            product.rating,
            reviewCount,
          ]
        );

        if (result.rowCount === 1) {
          const isUpdate = result.command === "UPDATE";
          if (isUpdate) {
            updated++;
          } else {
            inserted++;
          }
        }
      }

      return Response.json({
        success: true,
        message: `Loaded ${inserted + updated} products`,
        inserted,
        updated,
        totalProductsWithReviews: Object.keys(reviewCountByProduct).length,
      });
    } finally {
      client.release();
      pool.end();
    }
  } catch (error) {
    console.error("[load-all-products]", error);
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
