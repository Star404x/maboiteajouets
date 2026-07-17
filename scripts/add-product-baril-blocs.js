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
        "p-031",
        "Baril de 100 blocs de bois",
        "baril-blocs-bois",
        "jeux-de-construction",
        "Jeux de Construction",
        "101 pièces en bois colorées de formes différentes (cubes, cylindriques, triangulaires). Parfait pour construire châteaux, maisons, villages et bien plus!",
        25.99,
        4.8,
        0,
        true,
        ['/products/baril-blocs-bois-1.png', '/products/baril-blocs-bois-2.png', '/products/baril-blocs-bois-3.png', '/products/baril-blocs-bois-4.png', '/products/baril-blocs-bois-5.png', '/products/baril-blocs-bois-6.png', '/products/baril-blocs-bois-7.png', '/products/baril-blocs-bois-8.png', '/products/baril-blocs-bois-9.png', '/products/baril-blocs-bois-10.png'],
        ["Bois coloré", "Baril de rangement"],
        ["CE", "BPA Free", "Non toxique"],
        "Nouveau",
        "bg-gradient-to-br from-yellow-100 to-amber-50"
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
