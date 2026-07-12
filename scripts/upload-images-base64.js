const { Pool } = require("pg");
const fs = require("fs");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

const images = [
  "public/products/hape-boite-1.png",
  "public/products/hape-boite-2.png",
  "public/products/hape-boite-3.png",
  "public/products/hape-boite-4.png",
  "public/products/hape-boite-5.png",
];

async function uploadImages() {
  const client = await pool.connect();
  try {
    const imageUrls = [];

    for (const file of images) {
      const buffer = fs.readFileSync(file);
      const base64 = buffer.toString("base64");
      const dataUrl = `data:image/png;base64,${base64}`;
      imageUrls.push(dataUrl);
      console.log(`✓ Converted ${file} to data URL`);
    }

    // Update products table
    const result = await client.query(
      `UPDATE products 
       SET images = $1
       WHERE slug = $2
       RETURNING name, images`,
      [imageUrls, "boite-activites-hape"]
    );

    if (result.rows.length > 0) {
      console.log("\n✅ Updated product:");
      console.log("   Name:", result.rows[0].name);
      console.log("   Images count:", result.rows[0].images.length);
      console.log("   First image starts with:", result.rows[0].images[0].substring(0, 30) + "...");
    }
  } finally {
    client.release();
    await pool.end();
  }
}

uploadImages();
