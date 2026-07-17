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
        `p-029`,
        `Camion geant`,
        `camion-geant`,
        `vehicules`,
        `Véhicules`,
        `Camion géant Gowi. Dimensions: 32 x 43 x 28 cm. Plastique haute résistance, pneus en caoutchouc souple. À partir de 12 mois. Certifié CE et NF EN 71. Garantie 2 ans.`,
        59.90,
        null,
        4.6,
        17,
        true,
        ['/products/camion-geant-1.png', '/products/camion-geant-2.png', '/products/camion-geant-3.png', '/products/camion-geant-4.png', '/products/camion-geant-5.png', '/products/camion-geant-6.png', '/products/camion-geant-7.png', '/products/camion-geant-8.png', '/products/camion-geant-9.png', '/products/camion-geant-10.png'],
        ['Plastique haute résistance', 'Pneus caoutchouc souple'],
        ['CE', 'NF EN 71-1/2/3', 'Dès 12 mois', 'Garantie 2 ans'],
        'Nouveau',
        'bg-gradient-to-br from-yellow-100 to-amber-50'
      ]
    );
    console.log("✅ Product added:", result.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

addProduct();
