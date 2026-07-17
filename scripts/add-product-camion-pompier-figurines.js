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
        `p-027`,
        `Camion de pompier avec 2 figurines de pompier`,
        `camion-pompier-figurines`,
        `vehicules`,
        `Véhicules`,
        `Camion de pompier Tolo avec 2 figurines. Dimensions: 20 x 16 cm. Plastique de qualité. Figurines articulées. À partir de 12 mois. Certifié EN71. Facile à nettoyer.`,
        52.80,
        null,
        4.7,
        15,
        true,
        ['/products/camion-pompier-figurines-1.png', '/products/camion-pompier-figurines-2.png', '/products/camion-pompier-figurines-3.png', '/products/camion-pompier-figurines-4.png', '/products/camion-pompier-figurines-5.png', '/products/camion-pompier-figurines-6.png', '/products/camion-pompier-figurines-7.png', '/products/camion-pompier-figurines-8.png', '/products/camion-pompier-figurines-9.png', '/products/camion-pompier-figurines-10.png'],
        ['Plastique haute qualité'],
        ['CE', 'EN71', 'Dès 12 mois', 'Facile à nettoyer'],
        'Nouveau',
        'bg-gradient-to-br from-red-200 to-red-50'
      ]
    );
    console.log("✅ Product added:", result.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

addProduct();
