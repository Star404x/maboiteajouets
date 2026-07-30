import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('[fix-db] Database integrity fix started');

    // 1. Find products with NULL slug
    const nullSlugsResult = await sql`
      SELECT id, name, slug FROM products WHERE slug IS NULL
    `;
    const nullSlugsCount = nullSlugsResult.rowCount || 0;
    console.log(`[fix-db] Found ${nullSlugsCount} products with NULL slug`);

    // 2. Delete products with NULL slug
    let deleteCount = 0;
    if (nullSlugsCount > 0) {
      const deleteResult = await sql`
        DELETE FROM products WHERE slug IS NULL
      `;
      deleteCount = deleteResult.rowCount || 0;
      console.log(`✅ Deleted ${deleteCount} products with NULL slug`);
    }

    // 3. Check and fix Cube de manipulation sensoriel Ludi price
    const cubeResult = await sql`
      SELECT id, name, price FROM products WHERE name LIKE ${'%Cube de manipulation%'}
    `;
    
    let cubeFixed = false;
    let cubeName = null;
    let cubeOldPrice = null;
    const cubeNewPrice = 36.9;

    if (cubeResult.rowCount && cubeResult.rowCount > 0) {
      const cube = cubeResult.rows[0];
      cubeName = cube.name;
      cubeOldPrice = cube.price;

      // Update price if needed
      if (cube.price !== 36.9) {
        await sql`
          UPDATE products SET price = ${cubeNewPrice} WHERE id = ${cube.id}
        `;
        cubeFixed = true;
        console.log(`✅ Updated Cube price from ${cubeOldPrice}€ to ${cubeNewPrice}€`);
      }
    }

    // 4. Verify database integrity
    const integrityCheckResult = await sql`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN slug IS NULL THEN 1 ELSE 0 END) as null_slugs
      FROM products
    `;

    const integrityCheck = integrityCheckResult.rows[0];
    const total = integrityCheck.total;
    const nullSlugs = integrityCheck.null_slugs;

    return NextResponse.json({
      status: 'success',
      fixes: {
        deletedNullSlugs: deleteCount,
        cubePrice: {
          fixed: cubeFixed,
          name: cubeName,
          oldPrice: cubeOldPrice,
          newPrice: cubeNewPrice
        }
      },
      verification: {
        totalProducts: total,
        productsWithNullSlug: nullSlugs,
        databaseClean: nullSlugs === 0
      }
    });
  } catch (error) {
    console.error('Error fixing database:', error);
    return NextResponse.json(
      { error: 'Failed to fix database', details: String(error) },
      { status: 500 }
    );
  }
}
