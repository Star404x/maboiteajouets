const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function deleteAllMockups() {
  const client = await pool.connect();
  try {
    // ID всех товаров-макетов (с эмоджи)
    const mockupIds = [
      "p-001", // Ours en peluche
      "p-003", // Boîte créative
      "p-005", // Robot éducatif
      "p-006", // Maison de poupée
      "p-007", // Lapin blanc doudou
      "p-008", // Dinosaure vert câlin
      "p-011", // Puzzle animaux (был в PRODUCTS.ts с 🧩)
      "p-014", // Jeu de mémoire
      "p-016", // Cube sensoriel
      "p-018", // Tapis d'éveil
      "p-019", // Portique Arceau
      "p-020", // Mobile Musical
    ];

    const result = await client.query(
      `DELETE FROM products WHERE id = ANY($1) RETURNING id, name`,
      [mockupIds]
    );

    console.log(`✅ Deleted ${result.rowCount} mockup products:`);
    result.rows.forEach((row) => {
      console.log(`   - ${row.id}: ${row.name}`);
    });
  } finally {
    client.release();
    await pool.end();
  }
}

deleteAllMockups();
