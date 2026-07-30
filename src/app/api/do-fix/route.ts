import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const { Pool } = await import('pg');
    const { PRODUCTS } = await import('@/lib/data/products');

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json({ error: 'No DATABASE_URL' }, { status: 500 });
    }

    const pool = new Pool({ connectionString: dbUrl, max: 1 });
    const client = await pool.connect();

    // Delete old, insert new
    await client.query('DELETE FROM products');
    let count = 0;
    for (const p of PRODUCTS) {
      try {
        await client.query(
          `INSERT INTO products (id, name, slug, category, categoryName, description, price, rating, "reviewCount", images, age)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [p.id, p.name, p.slug, p.category, p.categoryName, p.description, p.price, p.rating, p.reviewCount || 0, JSON.stringify(p.images || []), JSON.stringify(p.age || [])]
        );
        count++;
      } catch (e) {}
    }

    // Check Cube
    const cube = await client.query(`SELECT price FROM products WHERE name LIKE '%Cube de manipulation%'`);
    const cubePrice = cube.rows[0]?.price;

    client.release();
    pool.end();

    return NextResponse.json({ success: true, inserted: count, cubePrice });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
