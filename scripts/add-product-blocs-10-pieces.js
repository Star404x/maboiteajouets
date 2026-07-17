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
        "p-037",
        "Blocs à empiler - 10 pièces",
        "blocs-empiler-10-pieces",
        "jouets-educatifs",
        "Jouets éducatifs",
        "10 blocs en bois avec bords silicone souple. Lettres, chiffres et motifs. Parfait pour la motricité libre et le développement sensoriel!",
        19.90,
        4.8,
        0,
        true,
        ['/products/blocs-empiler-10-pieces-1.png', '/products/blocs-empiler-10-pieces-2.png', '/products/blocs-empiler-10-pieces-3.png', '/products/blocs-empiler-10-pieces-4.png', '/products/blocs-empiler-10-pieces-5.png', '/products/blocs-empiler-10-pieces-6.png', '/products/blocs-empiler-10-pieces-7.png', '/products/blocs-empiler-10-pieces-8.png', '/products/blocs-empiler-10-pieces-9.png', '/products/blocs-empiler-10-pieces-10.png'],
        ["Bois", "Silicone"],
        ["CE"],
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
