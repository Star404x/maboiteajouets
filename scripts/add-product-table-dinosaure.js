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
        "p-035",
        "Table d'activités dinosaure",
        "table-activites-dinosaure",
        "jouets-educatifs",
        "Jouets éducatifs",
        "Table d'activités avec 8 jeux : tricératops, volcan, boulier, engrenages, miroir rotatif, œuf sonore. Idéal pour explorer le monde des dinosaures!",
        58.80,
        4.8,
        0,
        true,
        ['/products/table-activites-dinosaure-1.png', '/products/table-activites-dinosaure-2.png', '/products/table-activites-dinosaure-3.png', '/products/table-activites-dinosaure-4.png', '/products/table-activites-dinosaure-5.png', '/products/table-activites-dinosaure-6.png', '/products/table-activites-dinosaure-7.png', '/products/table-activites-dinosaure-8.png', '/products/table-activites-dinosaure-9.png', '/products/table-activites-dinosaure-10.png'],
        ["Bois FSC"],
        ["CE", "NF", "Garantie 2 ans"],
        "Nouveau",
        "bg-gradient-to-br from-amber-100 to-orange-50"
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
