const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function updateProduct() {
  const client = await pool.connect();
  try {
    const images = [
      "/products/set-construction-60-5.png",
      "/products/set-construction-60-1.png",
      "/products/set-construction-60-2.png",
      "/products/set-construction-60-3.png",
      "/products/set-construction-60-4.png",
      "/products/set-construction-60-6.png",
      "/products/set-construction-60-7.png",
      "/products/set-construction-60-8.png",
      "/products/set-construction-60-9.png",
      "/products/set-construction-60-10.png"
    ];

    const result = await client.query(
      `UPDATE products 
       SET images = $1
       WHERE id = 'p-032'
       RETURNING id, name, images`,
      [images]
    );
    
    console.log("✅ Updated:", result.rows[0].id);
    console.log(`📸 Main image: ${result.rows[0].images[0]}`);
  } finally {
    client.release();
    await pool.end();
  }
}

updateProduct();
