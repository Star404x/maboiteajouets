const { Pool } = require('pg');

const DATABASE_URL = "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require";

const pool = new Pool({ connectionString: DATABASE_URL });

exports.handler = async (event) => {
  console.log('[webhook] Received:', event.httpMethod, event.path);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { productId, newPrice } = body;

    if (!productId || newPrice === undefined) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing productId or newPrice' }),
      };
    }

    console.log(`[webhook] Updating ${productId} to €${newPrice}`);

    const client = await pool.connect();
    try {
      const result = await client.query(
        'UPDATE products SET price = $1 WHERE id = $2 RETURNING id, name, price',
        [newPrice, productId]
      );

      if (result.rows.length === 0) {
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Product not found' }),
        };
      }

      console.log(`[webhook] ✅ Updated:`, result.rows[0]);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          product: result.rows[0],
          timestamp: new Date().toISOString(),
        }),
      };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[webhook] Error:', error.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
