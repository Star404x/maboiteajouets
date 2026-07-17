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
        "p-032",
        "Set de construction 60 pcs",
        "set-construction-60",
        "jeux-de-construction",
        "Jeux de Construction",
        "60 pièces en bois FSC de 6 couleurs différentes. Avec 8 modèles inclus. Parfait pour la créativité et l'imagination!",
        22.39,
        4.8,
        0,
        true,
        ['/products/set-construction-60-1.png', '/products/set-construction-60-2.png', '/products/set-construction-60-3.png', '/products/set-construction-60-4.png', '/products/set-construction-60-5.png', '/products/set-construction-60-6.png', '/products/set-construction-60-7.png', '/products/set-construction-60-8.png', '/products/set-construction-60-9.png', '/products/set-construction-60-10.png'],
        ["Bois de hêtre FSC", "Peinture à l'eau"],
        ["CE", "Garantie 2 ans", "Non toxique"],
        "Nouveau",
        "bg-gradient-to-br from-orange-100 to-yellow-50"
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
