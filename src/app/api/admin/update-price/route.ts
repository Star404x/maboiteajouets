import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { productId, price } = await request.json();
    if (!productId || !price) {
      return NextResponse.json({ error: 'Missing productId or price' }, { status: 400 });
    }

    const { Pool } = await import('pg');
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return NextResponse.json({ error: 'No DB' }, { status: 500 });

    const pool = new Pool({ connectionString: dbUrl, max: 1 });
    const client = await pool.connect();

    const result = await client.query(
      `UPDATE products SET price = $1 WHERE id = $2 RETURNING id, name, price`,
      [price, productId]
    );

    client.release();
    pool.end();

    return NextResponse.json({
      success: result.rows.length > 0,
      updated: result.rows[0] || null,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
