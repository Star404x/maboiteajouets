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
        "p-038",
        "Pierres à empiler sweet cocoon",
        "pierres-empiler-sweet-cocoon",
        "jouets-educatifs",
        "Jouets éducatifs",
        "20 pierres en bois multicolores pour la construction libre et l'équilibre. Approche Montessori. Design français, dès 2 ans!",
        28.80,
        4.8,
        0,
        true,
        ['/products/pierres-empiler-sweet-cocoon-1.png', '/products/pierres-empiler-sweet-cocoon-2.png', '/products/pierres-empiler-sweet-cocoon-3.png', '/products/pierres-empiler-sweet-cocoon-4.png', '/products/pierres-empiler-sweet-cocoon-5.png', '/products/pierres-empiler-sweet-cocoon-6.png', '/products/pierres-empiler-sweet-cocoon-7.png', '/products/pierres-empiler-sweet-cocoon-8.png', '/products/pierres-empiler-sweet-cocoon-9.png', '/products/pierres-empiler-sweet-cocoon-10.png'],
        ["Bois de pin"],
        ["CE", "NF", "Garantie 2 ans"],
        "Nouveau",
        "bg-gradient-to-br from-pink-100 to-purple-50"
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
