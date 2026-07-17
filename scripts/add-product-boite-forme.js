const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function addProduct() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO products (id, name, slug, category, categoryName, description, price, rating, reviewCount, inStock, images, materials, safety, badge, bgClass)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING id, name, images`,
      [
        "p-034",
        "Boite à forme en bois",
        "boite-forme-bois",
        "jouets-educatifs",
        "Jouets éducatifs",
        "Boîte à formes avec 10 pièces à encastrer. Développe la reconnaissance des formes et la motricité fine!",
        25.50,
        4.8,
        0,
        true,
        ['/products/boite-forme-bois-1.png', '/products/boite-forme-bois-2.png', '/products/boite-forme-bois-3.png', '/products/boite-forme-bois-4.png', '/products/boite-forme-bois-5.png', '/products/boite-forme-bois-6.png', '/products/boite-forme-bois-7.png', '/products/boite-forme-bois-8.png', '/products/boite-forme-bois-9.png', '/products/boite-forme-bois-10.png'],
        ["Bois"],
        ["CE", "BPA Free"],
        "Nouveau",
        "bg-gradient-to-br from-sky-100 to-blue-50"
      ]
    );
    console.log("✅ Product added:", result.rows[0].id);
    console.log(`📸 Images: ${result.rows[0].images.length}`);
  } finally {
    client.release();
    await pool.end();
  }
}

addProduct();
