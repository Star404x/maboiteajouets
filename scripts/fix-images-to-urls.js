const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function fixImages() {
  const client = await pool.connect();
  try {
    // Update images to simple URLs instead of data URLs
    const imageUrls = [
      "/products/hape-boite-1.png",
      "/products/hape-boite-2.png",
      "/products/hape-boite-3.png",
      "/products/hape-boite-4.png",
      "/products/hape-boite-5.png",
    ];

    const result = await client.query(
      `UPDATE products 
       SET images = $1
       WHERE slug = $2
       RETURNING name, images`,
      [imageUrls, "boite-activites-hape"]
    );

    if (result.rows.length > 0) {
      console.log("✅ Updated product images to simple URLs:");
      console.log("   Name:", result.rows[0].name);
      console.log("   Images:", result.rows[0].images);
    } else {
      console.log("❌ Product not found");
    }
  } finally {
    client.release();
    await pool.end();
  }
}

fixImages();
