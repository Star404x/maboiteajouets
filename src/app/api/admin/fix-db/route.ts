import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Emergency fix - no auth check
    console.log('[fix-db] Database integrity fix started');

    // 1. Find products with NULL slug
    const nullSlugs = await sql`
      SELECT id, name, slug FROM products WHERE slug IS NULL
    `;
    console.log(`[fix-db] Found ${nullSlugs.rowCount} products with NULL slug`);

    // 2. Delete products with NULL slug
    let deleteCount = 0;
    if (nullSlugs.rowCount && nullSlugs.rowCount > 0) {
      const deleteResult = await sql`
        DELETE FROM products WHERE slug IS NULL
      `;
      deleteCount = deleteResult.rowCount || 0;
      console.log(`✅ Deleted ${deleteCount} products with NULL slug`);
    }

    // 3. Check and fix Cube de manipulation sensoriel Ludi price
    const cubeResult = await sql`
      SELECT id, name, price FROM products WHERE name LIKE '%Cube de manipulation%'
    `;
    
    let cubeFixed = false;
    let cubeName = null;
    let cubeOldPrice = null;
    let cubeNewPrice = 36.9;

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
    const integrityCheck = await sql`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN slug IS NULL THEN 1 ELSE 0 END) as null_slugs
      FROM products
    `;

    const { total, null_slugs } = integrityCheck.rows[0];

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
        productsWithNullSlug: null_slugs,
        databaseClean: null_slugs === 0
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
