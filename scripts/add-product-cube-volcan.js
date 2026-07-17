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
        "p-036",
        "Cube volcan d'activités",
        "cube-volcan-activites",
        "jouets-educatifs",
        "Jouets éducatifs",
        "Cube volcan multi-activités avec boîte à formes dinosaures, 3 engrenages, miroir, labyrinthe et boulier. Un voyage au temps des dinosaures!",
        26.80,
        4.8,
        0,
        true,
        ['/products/cube-volcan-activites-1.png', '/products/cube-volcan-activites-2.png', '/products/cube-volcan-activites-3.png', '/products/cube-volcan-activites-4.png', '/products/cube-volcan-activites-5.png', '/products/cube-volcan-activites-6.png', '/products/cube-volcan-activites-7.png', '/products/cube-volcan-activites-8.png', '/products/cube-volcan-activites-9.png', '/products/cube-volcan-activites-10.png'],
        ["Bois FSC", "Métal"],
        ["CE", "NF", "Garantie 2 ans"],
        "Nouveau",
        "bg-gradient-to-br from-orange-100 to-red-50"
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
