const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function addProduct() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO products (id, name, slug, category, categoryName, description, price, rating, reviewCount, inStock, images, materials, safety, badge, bgClass)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING id, name, slug`,
      [
        "p-030",
        "Mes premiers blocks de construction M",
        "blocks-construction-m",
        "jeux-de-construction",
        "Jeux de Construction",
        "118 pièces pour assembler diverses compositions. Développe l'imagination, la motricité et la perception de l'espace.",
        74.95,
        4.8,
        0,
        true,
        [
          '/products/blocks-construction-m-1.png',
          '/products/blocks-construction-m-2.png',
          '/products/blocks-construction-m-3.png'
        ],
        ["Plastique", "Boîte en plastique"],
        ["Certifié CE", "Garantie 2 ans", "Lavable 40°C"],
        null,
        "bg-[#FFF5E0]"
      ]
    );
    console.log("✅ Product added:", result.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

addProduct();
