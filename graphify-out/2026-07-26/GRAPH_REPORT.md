# Graph Report - .  (2026-07-26)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 795 nodes · 1126 edges · 107 communities (35 shown, 72 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.79)
- Token cost: 3,102 input · 749 output

## Graph Freshness
- Built from commit: `0f05074b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Product Catalog UI
- Static Account Pages
- NPM Dependencies
- Product Reviews Migration
- Dev Dependencies Types
- Shop Catalog Pages
- App Layout Footer
- TypeScript Config
- Auth API Routes
- Homepage Components
- Review Data Generation
- Price Sync Scripts
- Legal Pages
- Stripe Webhook Handler
- Product Rebuild Script
- Review Count Embedding
- Vercel Deployment Config
- Baby Product Images
- Price Update Script
- Checkout Page
- Railway Deployment Config
- Image Upload DB
- Product Reviews Hook
- Check Product Images
- Sync Products DB
- Base64 Image Upload
- Admin Orders Page
- Payment Intent Route
- DB Initialization
- Reviews SQL Migration
- Update Review Counts
- Prices API Route
- Reviews API Route
- Stripe DB Check
- Add Swing Product
- Add Ball Product
- Add Barrel Blocks
- Add Construction Blocks
- Add 10 Piece Blocks
- Add Stacking Blocks
- Add Shape Box
- Add Giant Truck
- Add Fire Truck
- Add Train Circuit
- Add Volcano Cube
- Add Mini Vehicles
- Add Roller Coaster
- Add Basketball Hoop
- Add Sweet Cocoon Stones
- Add Construction Set
- Add Ball Table
- Add Dinosaur Table
- Add Balloon Mat
- Add Stripe Column
- Check Blocks Product
- Check DB Categories
- Check Database
- Check DB Schema
- Check Dinosaur Product
- Check Mockups Remaining
- Check Review Counts
- Create Orders Schema
- Delete All Mockups
- Delete Add Blocks
- Delete Blocks Product
- Delete Educatif Mockups
- Delete Memory Game
- Delete Mock Products
- Delete Mock Vehicles
- Delete Plush Category
- Fix Cube Images
- Fix Hape Images
- Fix Images To URLs
- Fix Mat Category
- Init Railway DB
- List All Products
- Restore Deleted Products
- Update Blocks Images
- Update Stacking Blocks
- Update Shape Box
- Update Shape Box Price
- Update Fire Truck
- Update Games Category
- Update Train Circuit
- Update Cube Images
- Update Volcano Cube
- Update Dinosaur Price
- Update Mini Vehicles
- Update Stacking Stones
- Update Balloon Mat
- Update Construction Image
- Update Dinosaur Table
- Contact Email Route
- Products API Route
- Update Price Route
- Order Success Page
- Logout Page
- Brands Strip Component
- DB Sync Test
- Next.js Config
- Next.js Configuration
- PostCSS Configuration
- Database Schema Init

## God Nodes (most connected - your core abstractions)
1. `cn()` - 40 edges
2. `Breadcrumbs()` - 21 edges
3. `Button` - 21 edges
4. `PageHero()` - 17 edges
5. `formatPrice()` - 17 edges
6. `useCart` - 16 edges
7. `compilerOptions` - 16 edges
8. `PRODUCTS` - 11 edges
9. `ProductCard()` - 10 edges
10. `ProductGrid()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ProductReviews()` --calls--> `cn()`  [EXTRACTED]
  src/components/product/ProductReviews.tsx → src/lib/utils.ts
- `AdminPricesPage()` --calls--> `formatPrice()`  [EXTRACTED]
  src/app/admin/prices-client/page.tsx → src/lib/utils.ts
- `generateMetadata()` --calls--> `getCategory()`  [EXTRACTED]
  src/app/categorie/[slug]/page.tsx → src/lib/data/categories.ts
- `CategoryPage()` --calls--> `getCategory()`  [EXTRACTED]
  src/app/categorie/[slug]/page.tsx → src/lib/data/categories.ts
- `CatalogFilters()` --calls--> `cn()`  [EXTRACTED]
  src/components/catalog/CatalogFilters.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Baby Activity Gym – All Product Images Depicting Same SKU** — public_products_tapis_eveil_bois_2, public_products_tapis_eveil_bois_3, public_products_tapis_eveil_bois_4, concept_wooden_baby_activity_gym, concept_pink_quilted_play_mat, concept_hanging_toy_set, concept_tummy_time_pillow [EXTRACTED 0.97]

## Communities (107 total, 72 thin omitted)

### Community 0 - "Product Catalog UI"
Cohesion: 0.06
Nodes (50): AdminPricesPage(), DEMO_PRODUCTS, PriceRow, FavoritesPage(), metadata, Logo(), CartDrawer(), CartPageClient() (+42 more)

### Community 1 - "Static Account Pages"
Cohesion: 0.05
Nodes (35): metadata, VALUES, metadata, metadata, LINKS, metadata, metadata, metadata (+27 more)

### Community 2 - "NPM Dependencies"
Cohesion: 0.04
Nodes (45): bcryptjs, class-variance-authority, clsx, framer-motion, @hookform/resolvers, jsonwebtoken, lucide-react, next (+37 more)

### Community 3 - "Product Reviews Migration"
Cohesion: 0.08
Nodes (22): embedReviewsPostBuild(), extractProductIdFromSlug(), generateReviewsHTML(), { Pool }, { REVIEWS }, ProductReviews(), ProductReviewsProps, ProductReviewsSectionProps (+14 more)

### Community 4 - "Dev Dependencies Types"
Cohesion: 0.06
Nodes (34): devDependencies, tailwindcss, @tailwindcss/postcss, @types/bcryptjs, @types/jsonwebtoken, @types/node, @types/pg, @types/react (+26 more)

### Community 5 - "Shop Catalog Pages"
Cohesion: 0.09
Nodes (14): metadata, CategoryPage(), generateMetadata(), AGE_OPTIONS, CatalogFilters(), Filters, Props, SORT_OPTIONS (+6 more)

### Community 6 - "App Layout Footer"
Cohesion: 0.09
Nodes (20): fredoka, metadata, nunito, InstagramGallery(), TILES, COLUMNS, Footer(), FooterNewsletter() (+12 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 8 - "Auth API Routes"
Cohesion: 0.18
Nodes (15): getPool(), POST(), GET(), getPool(), getPool(), POST(), createToken(), DecodedToken (+7 more)

### Community 9 - "Homepage Components"
Cohesion: 0.12
Nodes (12): AGE_GROUPS, AgeSelector(), BENEFITS, BenefitsSection(), CategoriesStrip(), FeaturedProducts(), Hero(), NewProductsSlider() (+4 more)

### Community 10 - "Review Data Generation"
Cohesion: 0.13
Nodes (11): allReviews, colors, counts, fs, idMatches, path, productIds, productsContent (+3 more)

### Community 11 - "Price Sync Scripts"
Cohesion: 0.13
Nodes (14): cartContent, cartDrawer, cartDrawerPath, cartPage, cartPagePath, cartPath, checkoutContent, checkoutPath (+6 more)

### Community 12 - "Legal Pages"
Cohesion: 0.17
Nodes (6): metadata, metadata, metadata, metadata, LegalPage(), LegalPageProps

### Community 13 - "Stripe Webhook Handler"
Cohesion: 0.27
Nodes (10): getPool(), getStripe(), handleChargeRefunded(), handlePaymentIntentFailed(), handlePaymentIntentSucceeded(), POST(), TODO: Send confirmation email, TODO: Update inventory (+2 more)

### Community 14 - "Product Rebuild Script"
Cohesion: 0.18
Nodes (10): arrayEnd, arrayStart, content, filePath, firstProduct, fs, helpers, keepIds (+2 more)

### Community 15 - "Review Count Embedding"
Cohesion: 0.22
Nodes (8): fs, matches, path, productsContent, productsPath, reviewCounts, reviewsContent, reviewsPath

### Community 16 - "Vercel Deployment Config"
Cohesion: 0.25
Nodes (7): buildCommand, env, NEXT_PUBLIC_SITE_URL, NODE_ENV, envPrefix, framework, outputDirectory

### Community 17 - "Baby Product Images"
Cohesion: 0.76
Nodes (7): Hanging Toy Set (Giraffe, Flamingo, Rainbow Mirror, Pineapple, Sloth), Pink Quilted Round Play Mat, Tummy Time Pillow (Butterfly Shape, Pink Minky), Wooden Baby Activity Gym (Play Mat with Arch), Baby Activity Gym Product Photo – Studio Shot No Baby, Baby Activity Gym Product Photo – Baby Doing Tummy Time, Baby Activity Gym Product Photo – Nursery Room Setting

### Community 18 - "Price Update Script"
Cohesion: 0.29
Nodes (6): content, fs, matches, path, productRegex, productsPath

### Community 19 - "Checkout Page"
Cohesion: 0.33
Nodes (3): metadata, CheckoutPageClient(), stripePromise

### Community 20 - "Railway Deployment Config"
Cohesion: 0.33
Nodes (5): build, builder, deploy, startCommand, $schema

### Community 21 - "Image Upload DB"
Cohesion: 0.33
Nodes (4): fs, images, path, { Pool }

### Community 22 - "Product Reviews Hook"
Cohesion: 0.33
Nodes (4): Review, ReviewsResponse, ReviewStats, UseProductReviewsOptions

### Community 23 - "Check Product Images"
Cohesion: 0.40
Nodes (3): fs, path, { Pool }

### Community 24 - "Sync Products DB"
Cohesion: 0.40
Nodes (3): fs, path, { Pool }

### Community 25 - "Base64 Image Upload"
Cohesion: 0.40
Nodes (3): fs, images, { Pool }

### Community 26 - "Admin Orders Page"
Cohesion: 0.50
Nodes (4): AdminOrdersPage(), Order, OrderItem, statusColor()

### Community 27 - "Payment Intent Route"
Cohesion: 0.60
Nodes (3): getPool(), getStripe(), POST()

### Community 29 - "Reviews SQL Migration"
Cohesion: 0.50
Nodes (3): fs, path, reviewsFile

### Community 31 - "Prices API Route"
Cohesion: 0.83
Nodes (3): GET(), getPool(), POST()

### Community 32 - "Reviews API Route"
Cohesion: 0.83
Nodes (3): GET(), getPool(), POST()

## Knowledge Gaps
- **288 isolated node(s):** `{ Pool }`, `nextConfig`, `nextConfig`, `name`, `version` (+283 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **72 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Product Catalog UI` to `Static Account Pages`, `Product Reviews Migration`, `Shop Catalog Pages`, `App Layout Footer`, `Homepage Components`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `Breadcrumbs()` connect `Static Account Pages` to `Product Catalog UI`, `Product Reviews Migration`, `Legal Pages`, `Shop Catalog Pages`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `Button` connect `Product Catalog UI` to `Static Account Pages`, `Shop Catalog Pages`, `Homepage Components`, `App Layout Footer`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `{ Pool }`, `nextConfig`, `nextConfig` to the rest of the system?**
  _288 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Product Catalog UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06094627105052125 - nodes in this community are weakly interconnected._
- **Should `Static Account Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.052917232021709636 - nodes in this community are weakly interconnected._
- **Should `NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._