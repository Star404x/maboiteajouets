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
        `p-024`,
        `Montagne Russe`,
        `montagne-russe`,
        `jeux-exterieur`,
        `Jeux d'extérieur`,
        `Montagne russe pour enfants. Dimensions: 310 x 33 x 37 cm. Poids: 16,80 kg. Capacité: 50 kg. Plastique durable. Développe la coordination et l'équilibre. Intérieur ou extérieur.`,
        255.19,
        null,
        4.6,
        14,
        true,
        ['/products/montagne-russe-1.png', '/products/montagne-russe-2.png', '/products/montagne-russe-3.png', '/products/montagne-russe-4.png', '/products/montagne-russe-5.png', '/products/montagne-russe-6.png', '/products/montagne-russe-7.png', '/products/montagne-russe-8.png', '/products/montagne-russe-9.png', '/products/montagne-russe-10.png'],
        ['Plastique durable'],
        ['CE', 'EN-71', 'Europe', 'Dès 3 ans'],
        'Nouveau',
        'bg-gradient-to-br from-green-100 to-emerald-50'
      ]
    );
    console.log("✅ Product added:", result.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

addProduct();
