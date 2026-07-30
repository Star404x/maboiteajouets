import { NextRequest, NextResponse } from 'next/server';
import { createPool } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let client;
  try {
    // Emergency fix - use DATABASE_URL directly
    console.log('[fix-db] Database integrity fix started');

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return NextResponse.json(
        { error: 'No database connection configured' },
        { status: 500 }
      );
    }

    const pool = createPool({ connectionString });
    client = await pool.connect();

    // 1. Find products with NULL slug
    const nullSlugsResult = await client.query(
      'SELECT id, name, slug FROM products WHERE slug IS NULL'
    );
    const nullSlugsCount = nullSlugsResult.rowCount || 0;
    console.log(`[fix-db] Found ${nullSlugsCount} products with NULL slug`);

    // 2. Delete products with NULL slug
    let deleteCount = 0;
    if (nullSlugsCount > 0) {
      const deleteResult = await client.query(
        'DELETE FROM products WHERE slug IS NULL'
      );
      deleteCount = deleteResult.rowCount || 0;
      console.log(`✅ Deleted ${deleteCount} products with NULL slug`);
    }

    // 3. Check and fix Cube de manipulation sensoriel Ludi price
    const cubeResult = await client.query(
      "SELECT id, name, price FROM products WHERE name LIKE '%Cube de manipulation%'"
    );
    
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
        await client.query(
          'UPDATE products SET price = $1 WHERE id = $2',
          [cubeNewPrice, cube.id]
        );
        cubeFixed = true;
        console.log(`✅ Updated Cube price from ${cubeOldPrice}€ to ${cubeNewPrice}€`);
      }
    }

    // 4. Verify database integrity
    const integrityCheckResult = await client.query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN slug IS NULL THEN 1 ELSE 0 END) as null_slugs FROM products'
    );

    const [integrityCheck] = integrityCheckResult.rows;
    const total = integrityCheck.total;
    const nullSlugs = integrityCheck.null_slugs;

    client.release();

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
    if (client) {
      client.release();
    }
    return NextResponse.json(
      { error: 'Failed to fix database', details: String(error) },
      { status: 500 }
    );
  }
}
