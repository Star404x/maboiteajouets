const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addProduct() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO products (id, name, slug, category, categoryName, description, price, oldPrice, rating, reviewCount, inStock, images, materials, safety, badge, bgClass)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING id, name`,
      [
        `p-023`,
        `Balançoire Confortable`,
        `balancoire-confortable`,
        `jeux-exterieur`,
        `Jeux d'extérieur`,
        `Balançoire confortable pour enfants. Dimensions: 104 x 96 x 144 cm. Mousse de polyuréthane 25 mm, revêtement PVC-polyester. Design amusant avec animaux sympathiques. Facile à nettoyer.`,
        199.90,
        null,
        4.8,
        18,
        true,
        ['/products/balancoire-confortable-1.png', '/products/balancoire-confortable-2.png', '/products/balancoire-confortable-3.png', '/products/balancoire-confortable-4.png', '/products/balancoire-confortable-5.png', '/products/balancoire-confortable-6.png', '/products/balancoire-confortable-7.png', '/products/balancoire-confortable-8.png', '/products/balancoire-confortable-9.png', '/products/balancoire-confortable-10.png'],
        ['Mousse polyuréthane 25 mm', 'Revêtement PVC-polyester'],
        ['CE', 'EN-71-3', 'M2 ignifugé', 'Europe'],
        'Nouveau',
        'bg-gradient-to-br from-purple-100 to-pink-50'
      ]
    );
    console.log("✅ Product added:", result.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

addProduct();
