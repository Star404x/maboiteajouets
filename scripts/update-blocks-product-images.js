const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function updateProduct() {
  const client = await pool.connect();
  try {
    const images = [
      "/products/blocks-construction-m-1.png",
      "/products/blocks-construction-m-2.png",
      "/products/blocks-construction-m-3.png",
      "/products/blocks-construction-m-4.png",
      "/products/blocks-construction-m-5.png",
      "/products/blocks-construction-m-6.png",
      "/products/blocks-construction-m-7.png",
      "/products/blocks-construction-m-8.png",
      "/products/blocks-construction-m-9.png",
      "/products/blocks-construction-m-10.png"
    ];

    const result = await client.query(
      `UPDATE products 
       SET images = $1
       WHERE id = 'p-030'
       RETURNING id, name, images`,
      [images]
    );
    
    if (result.rows.length > 0) {
      const p = result.rows[0];
      console.log(`✅ Updated: ${p.id} - ${p.name}`);
      console.log(`📸 Images count: ${p.images.length}`);
      console.log(`Images: ${JSON.stringify(p.images)}`);
    } else {
      console.log("❌ Product not found");
    }
  } finally {
    client.release();
    await pool.end();
  }
}

updateProduct();
