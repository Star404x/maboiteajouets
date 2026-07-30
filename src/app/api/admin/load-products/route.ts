import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { PRODUCTS } from '@/lib/data/products';

export const dynamic = 'force-dynamic';

// EMERGENCY: Load all products from PRODUCTS.ts into database (no auth)
export async function POST(request: NextRequest) {
  try {
    console.log('[load-products] Loading', PRODUCTS.length, 'products');

    // 1. Clear existing products
    await sql`DELETE FROM products`;
    console.log('✅ Cleared products table');

    // 2. Insert all products
    let insertedCount = 0;
    for (const product of PRODUCTS) {
      try {
        await sql`
          INSERT INTO products (
            id, slug, name, category, categoryName, description, 
            price, rating, "reviewCount", age, images
          )
          VALUES (
            ${product.id}, ${product.slug}, ${product.name}, 
            ${product.category}, ${product.categoryName}, ${product.description},
            ${product.price}, ${product.rating}, ${product.reviewCount || 0},
            ${JSON.stringify(product.age || [])}, ${JSON.stringify(product.images || [])}
          )
        `;
        insertedCount++;
      } catch (err) {
        console.warn(`Skipped ${product.id}:`, String(err).substring(0, 100));
      }
    }
    console.log(`✅ Inserted ${insertedCount} products`);

    // 3. Verify
    const result = await sql`
      SELECT COUNT(*) as total, SUM(CASE WHEN slug IS NULL THEN 1 ELSE 0 END) as null_slugs FROM products
    `;
    const { total, null_slugs } = result.rows[0];

    // 4. Check Cube price
    let cubePrice = null;
    const cubeCheck = await sql`SELECT price FROM products WHERE name LIKE '%Cube de manipulation%' LIMIT 1`;
    if (cubeCheck.rows.length > 0) {
      cubePrice = cubeCheck.rows[0].price;
    }

    return NextResponse.json({
      status: 'success',
      message: 'Products loaded successfully',
      stats: {
        totalInserted: insertedCount,
        totalInDatabase: total,
        nullSlugs: null_slugs,
        databaseClean: null_slugs === 0,
        cubeDeManipulationPrice: cubePrice
      }
    });
  } catch (error) {
    console.error('Error loading products:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed', details: msg }, { status: 500 });
  }
}
