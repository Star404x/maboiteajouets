# 💰 Price Synchronization Guide

## How Prices Work

**Architecture:**
- All prices defined in `/src/lib/data/products.ts` (single source of truth)
- Cart stores only `productId` + `quantity` (NOT prices)
- Prices computed dynamically when needed via `computeCart()`
- Every time cart is displayed/calculated, it fetches CURRENT prices from PRODUCTS

**Result:** Prices ALWAYS stay in sync, no stale values anywhere.

## Changing a Price

### Option 1: Manual Edit
```bash
# Edit the price directly in src/lib/data/products.ts
nano src/lib/data/products.ts
# Find the product, change the "price" value
# Save and close
```

### Option 2: Script (Recommended)
```bash
# Update single product
node scripts/update-prices.js p-009 39.99

# Update multiple products
node scripts/update-prices.js p-015 8.99
node scripts/update-prices.js p-017 34.99
```

### Option 3: Audit Current Prices
```bash
# See all current prices
node scripts/sync-prices-everywhere.js
```

## Deploy Updated Prices

```bash
# After updating prices:
npm run build
netlify deploy --prod
```

**That's it!** Prices automatically propagate to:
- ✅ Product listings
- ✅ Cart display
- ✅ Checkout form
- ✅ Payment calculation
- ✅ Order confirmation

## Technical Details

### Cart Storage
```typescript
// What cart stores (lightweight)
interface CartLine {
  productId: string;      // e.g., "p-009"
  quantity: number;       // e.g., 2
}
// NOTE: Price is NOT stored here
```

### Price Lookup
```typescript
// How prices are always fresh
function computeCart(items: CartLine[]) {
  const lines = items.map((i) => {
    const product = PRODUCTS.find((p) => p.id === i.productId);
    // Uses current price from PRODUCTS ✓
    return { ...i, product };
  });
  
  const subtotal = lines.reduce(
    (sum, l) => sum + l.product.price * l.quantity, // Always CURRENT price
    0
  );
  return { lines, subtotal, ... };
}
```

### LocalStorage
- Cart data persists in localStorage as: `{ items: CartLine[] }`
- prices are NOT cached
- On next visit, computeCart() fetches current prices
- Old localStorage doesn't affect price calculations

## Troubleshooting

**Issue: Still seeing old price in cart**
1. Check if `npm run build` was run
2. Check if `netlify deploy --prod` completed
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
4. Clear localStorage:
   ```javascript
   // In browser console:
   localStorage.clear();
   ```

**Issue: Price mismatch at payment**
1. Run: `node scripts/sync-prices-everywhere.js`
2. Check console for errors
3. Verify product exists in PRODUCTS array
4. Rebuild and redeploy

## Files Modified
- `/src/lib/data/products.ts` - Source of truth for prices
- `/src/lib/store/cart.ts` - computeCart() logic
- `/src/lib/store/price-sync.ts` - Helper utilities
- `/scripts/update-prices.js` - Update helper script
- `/scripts/sync-prices-everywhere.js` - Audit script

## Best Practice
Always update prices in `products.ts`, never elsewhere. The system ensures consistency everywhere.
