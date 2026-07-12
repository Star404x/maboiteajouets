const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function fixImages() {
  const client = await pool.connect();
  try {
    // Update Hape product images from .jpg to .png
    const result = await client.query(
      `UPDATE products 
       SET images = ARRAY['/products/hape-boite-1.png', '/products/hape-boite-2.png', '/products/hape-boite-3.png', '/products/hape-boite-4.png', '/products/hape-boite-5.png']
       WHERE slug = $1
       RETURNING name, images`,
      ["boite-activites-hape"]
    );

    if (result.rows.length > 0) {
      console.log("✅ Updated Hape product images:");
      console.log("   Name:", result.rows[0].name);
      console.log("   Images:", result.rows[0].images);
    } else {
      console.log("❌ Hape product not found");
    }
  } finally {
    client.release();
    await pool.end();
  }
}

fixImages();
