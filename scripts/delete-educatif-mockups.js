const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function deleteMockups() {
  const client = await pool.connect();
  try {
    const ids = ['p-003', 'p-005', 'p-006', 'p-011', 'p-013'];
    
    const result = await client.query(
      `DELETE FROM products WHERE id = ANY($1) RETURNING id, name`
    , [ids]);
    
    console.log("✅ Deleted mockups from 'jouets-educatifs':");
    result.rows.forEach(row => {
      console.log(`  - ${row.id}: ${row.name}`);
    });
    console.log(`\n📦 Total deleted: ${result.rows.length} mockup products`);
  } finally {
    client.release();
    await pool.end();
  }
}

deleteMockups();
