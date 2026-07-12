const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

const images = [
  { key: "hape-boite-1", file: "public/products/hape-boite-1.png" },
  { key: "hape-boite-2", file: "public/products/hape-boite-2.png" },
  { key: "hape-boite-3", file: "public/products/hape-boite-3.png" },
  { key: "hape-boite-4", file: "public/products/hape-boite-4.png" },
  { key: "hape-boite-5", file: "public/products/hape-boite-5.png" },
];

async function uploadImages() {
  const client = await pool.connect();
  try {
    // Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id TEXT PRIMARY KEY,
        data BYTEA NOT NULL,
        content_type TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Table product_images created/verified");

    // Upload images
    for (const { key, file } of images) {
      const buffer = fs.readFileSync(file);
      await client.query(
        `INSERT INTO product_images (id, data, content_type) 
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET data = $2`,
        [key, buffer, "image/png"]
      );
      console.log(`✓ Uploaded: ${key} (${buffer.length} bytes)`);
    }

    // Update products table with new image paths
    const imageArray = [
      "/api/images/hape-boite-1",
      "/api/images/hape-boite-2",
      "/api/images/hape-boite-3",
      "/api/images/hape-boite-4",
      "/api/images/hape-boite-5",
    ];

    const result = await client.query(
      `UPDATE products 
       SET images = $1
       WHERE slug = $2
       RETURNING name, images`,
      [imageArray, "boite-activites-hape"]
    );

    console.log("\n✅ Updated product images:");
    console.log("   Name:", result.rows[0].name);
    console.log("   Images:", result.rows[0].images);
  } finally {
    client.release();
    await pool.end();
  }
}

uploadImages();
