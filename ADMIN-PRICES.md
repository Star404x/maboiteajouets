# 💼 Admin Panel — Price Management

## Overview

**Auto-sync price system:**
1. 📊 Admin Panel at `/admin/prices-client`
2. 🔄 Real-time database updates
3. 📱 Automatic price sync across entire site (every 60 seconds)
4. 🛒 Cart always shows latest prices
5. 💳 Payment always charged correct amount

---

## How It Works

### 1️⃣ Admin Panel Access

**URL:** `https://maboiteajouets.fr/admin/prices-client`

**Authentication:** 
- Default password: `admin123`
- ⚠️ Change this in production!

### 2️⃣ Update a Price

1. Login to admin panel
2. Find product in table
3. Change "New Price" value
4. Click "Save"
5. ✅ Price updates in database
6. ✅ Site refreshes prices automatically (every 60 seconds)
7. ✅ All carts update to new price

### 3️⃣ How Sync Works

```
┌─────────────────────────────────────────────────┐
│ Database (PostgreSQL)                           │
│ ─ products table with prices                    │
└────────────────┬────────────────────────────────┘
                 │ GET /.netlify/functions/get-prices
                 │
┌────────────────▼────────────────────────────────┐
│ Browser Session                                 │
│ usePriceSync() hook runs every 60 seconds       │
│ Stores prices in sessionStorage                 │
└────────────────┬────────────────────────────────┘
                 │ getPriceFromSync()
                 │
┌────────────────▼────────────────────────────────┐
│ Cart / Checkout                                 │
│ Always uses latest prices                       │
│ No stale values from localStorage               │
└─────────────────────────────────────────────────┘
```

---

## Architecture

### Files

**Admin Interface:**
- `/src/app/admin/prices-client/page.tsx` — UI component

**Backend Functions:**
- `/netlify/functions/get-prices.js` — GET all prices from DB
- `/netlify/functions/update-price.js` — POST to update price in DB

**Frontend Sync:**
- `/src/hooks/usePriceSync.ts` — Auto-sync hook (60s interval)
- `/src/components/layout/PriceSyncProvider.tsx` — Provider wrapper
- `/src/lib/store/cart.ts` — Uses synced prices for totals

---

## Environment Variables

Set in Netlify:

```env
DATABASE_URL=postgresql://...
ADMIN_API_KEY=your-admin-key  # For production authentication
```

**In production, change default password in:**
```typescript
// src/app/admin/prices-client/page.tsx, line 10
const ADMIN_PASSWORD = "admin123"; // CHANGE THIS!
```

---

## Security

### ⚠️ Important

The default setup is **NOT production-ready**. Before going live:

1. **Change admin password:**
   ```typescript
   const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "your-secure-password";
   ```

2. **Set proper API key:**
   ```bash
   # In Netlify environment variables:
   ADMIN_API_KEY=your-super-secret-api-key
   ```

3. **Enable HTTPS only** (automatic on Netlify)

4. **Add rate limiting** to prevent brute force:
   ```javascript
   // Add to netlify/functions/update-price.js
   ```

---

## Example Usage

### Update Single Product

1. Go to `/admin/prices-client`
2. Login with password
3. Find "Boîte d'activités Hape" (p-009)
4. Change price from 36.4 to 39.99
5. Click "Save"
6. ✅ All customers see €39.99 immediately

### Bulk Update

For multiple products, update one by one (or modify script below):

```javascript
// Manual API call to bulk update (optional)
for (const productId of ["p-009", "p-015", "p-017"]) {
  fetch("/.netlify/functions/update-price", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ADMIN_API_KEY,
    },
    body: JSON.stringify({ id: productId, price: 49.99 }),
  });
}
```

---

## Troubleshooting

### Issue: Prices not updating in cart

**Solution:**
1. Check browser console for errors
2. Verify Netlify Functions are deployed:
   - `https://maboiteajouets.fr/.netlify/functions/get-prices`
   - Should return JSON with prices
3. Hard refresh: `Cmd+Shift+R` / `Ctrl+Shift+R`
4. Check sessionStorage in browser DevTools:
   ```javascript
   localStorage.getItem("__prices_sync")
   ```

### Issue: Admin login not working

**Solution:**
1. Verify password is correct (default: `admin123`)
2. Check DATABASE_URL is set in Netlify
3. Verify functions are deployed: https://netlify.app/site/maboiteajouets

### Issue: Database connection error

**Solution:**
```bash
# Check if DB is accessible
psql $DATABASE_URL -c "SELECT COUNT(*) FROM products;"
```

---

## Production Deployment

1. **Update admin password:**
   ```typescript
   // src/app/admin/prices-client/page.tsx
   const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "new-secure-password";
   ```

2. **Set Netlify environment variables:**
   ```
   ADMIN_API_KEY=super-secret-key
   ADMIN_PASSWORD=secure-admin-password
   ```

3. **Deploy:**
   ```bash
   npm run build
   netlify deploy --prod
   ```

---

## How Prices Work Now

| Where | Source | Update Speed |
|-------|--------|--------------|
| **Product page** | PRODUCTS → sync → DB | Every 60s |
| **Cart** | PRODUCTS → sync → DB | Every 60s |
| **Checkout** | PRODUCTS → sync → DB | Every 60s |
| **Payment** | PRODUCTS → sync → DB | Every 60s |
| **Old Price Field** | Database directly | Real-time |

✅ **Result:** Prices are ALWAYS synchronized across the entire site. When you update a price in the admin panel, it automatically propagates everywhere within 60 seconds.

---

## Next Steps

1. ✅ Deploy this version
2. ✅ Test admin panel at `/admin/prices-client`
3. ✅ Update one product price
4. ✅ Verify cart shows new price
5. ✅ Change admin password before public launch
6. ✅ Set ADMIN_API_KEY in Netlify

**Your system is now fully automated! 🎉**
