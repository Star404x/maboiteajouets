const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function updateCategory() {
  const client = await pool.connect();
  try {
    // First, check what's in jeux-de-societe
    console.log("🔍 Checking products in jeux-de-societe...\n");
    const checkResult = await client.query(
      `SELECT id, name, slug, category, categoryName FROM products WHERE category = $1`,
      ["jeux-de-societe"]
    );
    
    if (checkResult.rows.length > 0) {
      console.log("Found products in jeux-de-societe:");
      checkResult.rows.forEach(p => {
        console.log(`  - ${p.id}: ${p.name} (${p.slug})`);
      });
      console.log("");
      
      // Update to new category
      const updateResult = await client.query(
        `UPDATE products 
         SET category = $1, categoryName = $2 
         WHERE category = $3
         RETURNING id, name, category, categoryName`,
        ["jeux-de-construction", "Jeux de Construction", "jeux-de-societe"]
      );
      
      // Double-check to fix any undefined categoryName
      await client.query(
        `UPDATE products 
         SET categoryName = 'Jeux de Construction'
         WHERE category = 'jeux-de-construction' AND (categoryName IS NULL OR categoryName = 'undefined')`
      );
      
      console.log("✅ Updated products:");
      updateResult.rows.forEach(p => {
        console.log(`  - ${p.id}: ${p.name}`);
        console.log(`    New category: ${p.category} (${p.categoryName})`);
      });
    } else {
      console.log("No products found in jeux-de-societe category");
      console.log("\nChecking all categories:");
      const allResult = await client.query(
        `SELECT DISTINCT category, categoryName, COUNT(*) as count FROM products GROUP BY category, categoryName ORDER BY category`
      );
      allResult.rows.forEach(p => {
        console.log(`  - ${p.category}: ${p.count} товаров`);
      });
    }
    
  } finally {
    client.release();
    await pool.end();
  }
}

updateCategory();
