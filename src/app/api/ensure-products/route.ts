import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Simple GET endpoint to load products
export async function GET() {
  try {
    const { Pool } = await import('pg');
    const { PRODUCTS } = await import('@/lib/data/products');

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return NextResponse.json({ error: 'No DB' }, { status: 500 });

    const pool = new Pool({ connectionString: dbUrl, max: 1 });
    const client = await pool.connect();

    // Check if Cube exists
    const cube = await client.query(`SELECT id FROM products WHERE id='p-016' LIMIT 1`);
    
    if (cube.rows.length === 0) {
      // Cube missing, reload ALL products
      await client.query('DELETE FROM products');
      
      for (const p of PRODUCTS) {
        try {
          await client.query(
            `INSERT INTO products (id,name,slug,category,categoryName,description,price,rating,"reviewCount",images,age)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [p.id,p.name,p.slug,p.category,p.categoryName,p.description,p.price,p.rating,p.reviewCount||0,JSON.stringify(p.images||[]),JSON.stringify(p.age||[])]
          );
        } catch(e) {}
      }
    }

    const check = await client.query(`SELECT COUNT(*) as total FROM products WHERE id='p-016'`);
    const result = check.rows[0];
    
    client.release();
    pool.end();

    return NextResponse.json({ status: 'ok', cubeExists: result.total > 0 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
