const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function checkDb() {
  const client = await pool.connect();
  try {
    // Check if table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'products'
      );
    `);
    console.log("Table exists:", tableCheck.rows[0].exists);

    // Count products
    const countResult = await client.query("SELECT COUNT(*) as count FROM products");
    console.log("Total products:", countResult.rows[0].count);

    // List all products
    const products = await client.query("SELECT id, slug, name, price FROM products ORDER BY id");
    console.log("\nProducts in DB:");
    products.rows.forEach((p) => {
      console.log(`  ${p.id}: ${p.name} (${p.slug}) - ${p.price}€`);
    });

    // Check for Hape
    const hape = await client.query("SELECT * FROM products WHERE slug = $1", ["boite-activites-hape"]);
    if (hape.rows.length > 0) {
      console.log("\n✅ Hape product found in DB!");
      console.log("  Name:", hape.rows[0].name);
      console.log("  Images:", hape.rows[0].images);
    } else {
      console.log("\n❌ Hape product NOT found in DB!");
    }
  } finally {
    client.release();
    await pool.end();
  }
}

checkDb();
