const { Pool } = require('pg');

// Environment variables are properly handled by Netlify Functions
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "admin123";

console.log('[prices.js] DATABASE_URL configured:', !!DATABASE_URL);
console.log('[prices.js] ADMIN_API_KEY configured:', !!ADMIN_API_KEY);

const pool = new Pool({
  connectionString: DATABASE_URL,
});

// GET: Fetch all prices
exports.handler = async (event) => {
  console.log('[prices function] Method:', event.httpMethod);
  console.log('[prices function] Path:', event.path);

  if (event.httpMethod === 'GET') {
    try {
      console.log('[GET] Connecting to database...');
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT id, slug, name, price FROM products ORDER BY id');
        console.log(`[GET] ✅ Success: ${result.rows.length} products fetched`);
        
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: true,
            prices: result.rows,
            timestamp: new Date().toISOString(),
          }),
        };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('[GET] ❌ Error:', error.message);
      console.error('[GET] Code:', error.code);
      console.error('[GET] Address:', error.address);
      console.error('[GET] Port:', error.port);
      
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: error.message,
          code: error.code,
        }),
      };
    }
  }

  if (event.httpMethod === 'POST') {
    try {
      const apiKey = event.headers['x-api-key'];
      console.log('[POST] API Key check:', apiKey === ADMIN_API_KEY ? '✅ PASS' : '❌ FAIL');

      if (apiKey !== ADMIN_API_KEY) {
        return {
          statusCode: 401,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: false,
            error: 'Unauthorized',
          }),
        };
      }

      const body = JSON.parse(event.body);
      const { productId, newPrice } = body;

      if (!productId || newPrice === undefined) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: false,
            error: 'Missing productId or newPrice',
          }),
        };
      }

      console.log(`[POST] Updating ${productId} to ${newPrice}`);
      const client = await pool.connect();
      try {
        const result = await client.query(
          'UPDATE products SET price = $1 WHERE id = $2 RETURNING id, slug, name, price',
          [newPrice, productId]
        );

        if (result.rows.length === 0) {
          return {
            statusCode: 404,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              success: false,
              error: 'Product not found',
            }),
          };
        }

        console.log(`[POST] ✅ Updated:`, result.rows[0]);
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
      console.error('[POST] ❌ Error:', error.message);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: error.message,
        }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
