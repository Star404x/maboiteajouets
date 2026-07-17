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
        `p-028`,
        `Lot de 4 mini véhicules`,
        `lot-mini-vehicules`,
        `vehicules`,
        `Véhicules`,
        `4 minis véhicules Edushape avec système push-down. Idéal pour développer la motricité fine. À partir de 12 mois. Sans batterie, plastique robuste, bords arrondis sécurisés. Certifié CE.`,
        18.80,
        null,
        4.5,
        11,
        true,
        ['/products/lot-mini-vehicules-1.png', '/products/lot-mini-vehicules-2.png', '/products/lot-mini-vehicules-3.png', '/products/lot-mini-vehicules-4.png', '/products/lot-mini-vehicules-5.png', '/products/lot-mini-vehicules-6.png', '/products/lot-mini-vehicules-7.png', '/products/lot-mini-vehicules-8.png', '/products/lot-mini-vehicules-9.png', '/products/lot-mini-vehicules-10.png'],
        ['Plastique robuste'],
        ['CE', 'Dès 12 mois', 'Sans batterie', 'Bords arrondis'],
        'Nouveau',
        'bg-gradient-to-br from-blue-100 to-indigo-50'
      ]
    );
    console.log("✅ Product added:", result.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

addProduct();
