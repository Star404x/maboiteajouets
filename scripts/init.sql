-- Railway PostgreSQL Database Initialization for maboiteajouets
-- Copy and paste this into Railway Console or run with psql

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  category VARCHAR NOT NULL,
  categoryName VARCHAR,
  description TEXT,
  price DECIMAL NOT NULL,
  oldPrice DECIMAL,
  rating DECIMAL DEFAULT 4.5,
  reviewCount INT DEFAULT 0,
  inStock BOOLEAN DEFAULT true,
  images TEXT[],
  materials TEXT[],
  safety TEXT[],
  badge VARCHAR,
  bgClass VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample products
INSERT INTO products (id, name, slug, category, categoryName, description, price, oldPrice, rating, reviewCount, inStock, images, materials, safety, badge, bgClass)
VALUES
  ('p-009', 'Boîte d''activités Hape', 'boite-activites-hape', 'jouets-bebe', 'Jouets bébé', 'Boîte d''activités 5 faces avec engrenages, boules, blocs, labyrinthe et miroir pour éveiller la motricité.', 36.4, NULL, 4.8, 245, true, ARRAY['/products/boite-activites-hape-1.png'], ARRAY['Bois', 'Plastique'], ARRAY['Certifié CE'], 'Populaire', 'bg-amber-50'),
  ('p-015', 'O-Ball - Ballon sensoriel multicolore', 'balle-prehension-multicolore', 'jouets-bebe', 'Jouets bébé', 'Ballon avec trous pour une bonne prise en main - stimule les sens et la motricité fine.', 7.8, NULL, 4.7, 180, true, ARRAY['/products/balle-prehension-1.png'], ARRAY['Plastique'], ARRAY['Certifié CE'], NULL, 'bg-blue-50'),
  ('p-017', 'Cube sensoriel Ludi', 'cube-sensoriel-ludi', 'jouets-bebe', 'Jouets bébé', 'Cube avec 6 activités différentes pour éveiller bébé - sons, textures, couleurs.', 13.9, NULL, 4.8, 92, true, ARRAY['/products/cube-sensoriel-ludi-1.png'], ARRAY['Tissu', 'Plastique'], ARRAY['Certifié CE'], 'Nouveau', 'bg-pink-50'),
  ('p-021', 'Actiroller - Rouleau Musical Miniland', 'actiroller-rouleau-musical', 'jouets-bebe', 'Jouets bébé', 'Rouleau musical qui roule et produit des sons mélodieux.', 32.8, NULL, 4.7, 78, true, ARRAY['/products/actiroller-rouleau-musical-1.png'], ARRAY['Plastique'], ARRAY['Certifié CE'], NULL, 'bg-purple-50')
ON CONFLICT (id) DO NOTHING;

-- Verify data
SELECT COUNT(*) as product_count FROM products;
