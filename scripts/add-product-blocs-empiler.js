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
        "p-033",
        "Blocs à empiler d'exploration",
        "blocs-empiler-exploration",
        "jeux-de-construction",
        "Jeux de Construction",
        "Blocs d'exploration avec kaleidoscope, perles et billes. Stimule la motricité fine et la découverte sensorielle!",
        22.50,
        4.8,
        0,
        true,
        ['/products/blocs-empiler-exploration-1.png', '/products/blocs-empiler-exploration-2.png', '/products/blocs-empiler-exploration-3.png', '/products/blocs-empiler-exploration-4.png', '/products/blocs-empiler-exploration-5.png', '/products/blocs-empiler-exploration-6.png', '/products/blocs-empiler-exploration-7.png', '/products/blocs-empiler-exploration-8.png', '/products/blocs-empiler-exploration-9.png', '/products/blocs-empiler-exploration-10.png'],
        ["Bois", "Métal"],
        ["CE", "Made in Europe"],
        "Nouveau",
        "bg-gradient-to-br from-teal-100 to-cyan-50"
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
