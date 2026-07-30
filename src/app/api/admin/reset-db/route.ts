import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { PRODUCTS } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

// EMERGENCY: Reset entire database and reload from PRODUCTS.ts
export async function POST(request: NextRequest) {
  try {
    console.log('[reset-db] Starting database reset with', PRODUCTS.length, 'products');

    // 1. Delete all products
    const deleteResult = await sql`DELETE FROM products`;
    console.log(`✅ Deleted ${deleteResult.rowCount} products`);

    // 2. Insert all products from static data
    let insertedCount = 0;
    for (const product of PRODUCTS) {
      try {
        await sql`
          INSERT INTO products (
            id, slug, name, category, categoryName, description, 
            price, rating, "reviewCount", age, images, sku, brand
          )
          VALUES (
            ${product.id}, ${product.slug}, ${product.name}, 
            ${product.category}, ${product.categoryName}, ${product.description},
            ${product.price}, ${product.rating}, ${product.reviewCount || 0},
            ${JSON.stringify(product.age || [])}, ${JSON.stringify(product.images || [])},
            ${product.sku || null}, ${product.brand || null}
          )
        `;
        insertedCount++;
      } catch (err) {
        console.error(`Failed to insert ${product.id}:`, err);
      }
    }
    console.log(`✅ Inserted ${insertedCount} products`);

    // 3. Verify integrity
    const integrityCheck = await sql`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN slug IS NULL THEN 1 ELSE 0 END) as null_slugs,
        SUM(CASE WHEN name LIKE '%Cube de manipulation%' THEN 1 ELSE 0 END) as cube_count
      FROM products
    `;

    const stats = integrityCheck.rows[0];

    // 4. Get Cube price if exists
    let cubePrice = null;
    if (stats.cube_count > 0) {
      const cubeResult = await sql`
        SELECT price FROM products WHERE name LIKE '%Cube de manipulation%' LIMIT 1
      `;
      cubePrice = cubeResult.rows[0]?.price;
    }

    return NextResponse.json({
      status: 'success',
      message: 'Database reset complete',
      stats: {
        totalProducts: stats.total,
        productsWithNullSlug: stats.null_slugs,
        databaseClean: stats.null_slugs === 0,
        cubeDeManipulationFound: stats.cube_count > 0,
        cubePrice: cubePrice
      }
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to reset database', details: errorMsg },
      { status: 500 }
    );
  }
}
