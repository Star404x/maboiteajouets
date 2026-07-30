import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { Pool } = await import('pg');
    const { PRODUCTS } = await import('@/lib/data/products');

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
    }

    console.log('[POPULATE] Connecting...');
    const pool = new Pool({ connectionString: dbUrl, max: 2 });
    const client = await pool.connect();

    // Delete existing
    console.log('[POPULATE] Clearing products...');
    await client.query('DELETE FROM products');

    // Insert all products
    console.log('[POPULATE] Inserting', PRODUCTS.length, 'products...');
    let inserted = 0;
    let failed = 0;

    for (const product of PRODUCTS) {
      try {
        await client.query(
          `INSERT INTO products (id, name, slug, category, categoryName, description, price, rating, "reviewCount", images, age)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            product.id,
            product.name,
            product.slug,
            product.category,
            product.categoryName,
            product.description,
            product.price,
            product.rating,
            product.reviewCount || 0,
            JSON.stringify(product.images || []),
            JSON.stringify(product.age || [])
          ]
        );
        inserted++;
      } catch (e) {
        failed++;
        console.warn(`⚠️  ${product.id}: ${String(e).substring(0, 60)}`);
      }
    }

    // Verify
    const result = await client.query(
      `SELECT COUNT(*) as total, SUM(CASE WHEN slug IS NULL THEN 1 ELSE 0 END) as null_slugs FROM products`
    );
    const { total, null_slugs } = result.rows[0];

    // Check Cube
    let cubePrice = null;
    const cubeCheck = await client.query(
      `SELECT price, slug FROM products WHERE name LIKE '%Cube de manipulation%' LIMIT 1`
    );
    if (cubeCheck.rows.length > 0) {
      cubePrice = cubeCheck.rows[0].price;
      console.log(`[POPULATE] Cube found: ${cubePrice}€, slug: ${cubeCheck.rows[0].slug}`);
    }

    client.release();
    pool.end();

    return NextResponse.json({
      status: 'success',
      stats: {
        inserted,
        failed,
        totalInDB: total,
        nullSlugs: null_slugs,
        databaseClean: null_slugs === 0,
        cubeDeManipulationPrice: cubePrice
      }
    });
  } catch (error) {
    console.error('[POPULATE] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
