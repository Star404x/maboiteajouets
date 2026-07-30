-- Migration: Remove products with NULL slug
-- Date: 2026-07-30
-- Author: Star404
-- Description: Fix database integrity by removing products with NULL slug and ensure Cube de manipulation price is 36.9€

BEGIN;

-- Check for NULL slugs
SELECT COUNT(*) as null_slug_count FROM products WHERE slug IS NULL;

-- Delete products with NULL slug
DELETE FROM products WHERE slug IS NULL;

-- Update Cube de manipulation sensoriel Ludi price
UPDATE products 
SET price = 36.9 
WHERE name LIKE '%Cube de manipulation%' 
  AND price != 36.9;

-- Verify: no more NULL slugs
SELECT COUNT(*) as remaining_null_slugs FROM products WHERE slug IS NULL;

-- Verify: Cube price is correct
SELECT id, name, price FROM products WHERE name LIKE '%Cube de manipulation%';

COMMIT;
