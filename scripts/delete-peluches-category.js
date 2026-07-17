const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function deleteCategory() {
  const client = await pool.connect();
  try {
    // Delete all products in peluches category
    const deleteResult = await client.query(
      `DELETE FROM products WHERE category = 'peluches' RETURNING id, name`
    );
    
    console.log("✅ Deleted products from 'peluches' category:");
    deleteResult.rows.forEach(row => {
      console.log(`  - ${row.id}: ${row.name}`);
    });
    console.log(`\n📦 Total deleted: ${deleteResult.rows.length} products`);
  } finally {
    client.release();
    await pool.end();
  }
}

deleteCategory();
