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
        `p-026`,
        `Circuit de train avec figurines`,
        `circuit-train-figurines`,
        `vehicules`,
        `Véhicules`,
        `Circuit de train pour enfants 1-5 ans. 19 pièces: train, wagon, figurines avec bras/jambes mobiles. Schéma en forme de 8. Poids: 1,7 kg. Certifications: EN71, ASTM, CPSIA.`,
        138.80,
        null,
        4.6,
        13,
        true,
        ['/products/circuit-train-figurines-1.png', '/products/circuit-train-figurines-2.png', '/products/circuit-train-figurines-3.png', '/products/circuit-train-figurines-4.png', '/products/circuit-train-figurines-5.png', '/products/circuit-train-figurines-6.png', '/products/circuit-train-figurines-7.png', '/products/circuit-train-figurines-8.png', '/products/circuit-train-figurines-9.png', '/products/circuit-train-figurines-10.png'],
        ['Plastique', 'Figurines interactives'],
        ['CE', 'EN71', 'ASTM', 'CPSIA'],
        'Nouveau',
        'bg-gradient-to-br from-red-100 to-orange-50'
      ]
    );
    console.log("✅ Product added:", result.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

addProduct();
