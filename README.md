# 🧸 Ma Boîte à Jouets

E-commerce français premium pour jouets d'enfants 0-12 ans.
Design moderne, animations soignées, prêt pour la production.

## 🛠 Stack

- **Framework :** Next.js 16 (App Router + Turbopack)
- **Langage :** TypeScript
- **UI :** React 19, Tailwind CSS v4
- **Animations :** Framer Motion
- **Carousels :** Swiper
- **Forms :** React Hook Form + Zod
- **State :** Zustand
- **Icons :** Lucide React + SVG custom

## 🚀 Démarrage

```bash
# Installer les dépendances
npm install

# Copier le template d'environnement
cp .env.example .env.local

# Lancer le dev server
npm run dev
# → http://localhost:3000

# Build production
npm run build
npm run start
```

## 📁 Structure

```
src/
├── app/
│   ├── layout.tsx          Root layout (header/footer/cart/toaster)
│   ├── page.tsx            Homepage
│   ├── boutique/           Catalog with filters
│   ├── categorie/[slug]/   Category page
│   ├── produit/[slug]/     Product detail
│   ├── panier/             Cart page
│   ├── commande/           Checkout (4 steps)
│   ├── favoris/            Favorites
│   ├── compte/             Account
│   ├── a-propos/           About
│   ├── contact/            Contact
│   ├── faq/                FAQ
│   ├── livraison/          Shipping/returns
│   ├── nouveautes/         New arrivals
│   ├── promotions/         Sales
│   ├── meilleures-ventes/  Best sellers
│   ├── mentions-legales/   Legal notice
│   ├── cgv/                T&C
│   ├── confidentialite/    Privacy policy
│   ├── cookies/            Cookie policy
│   ├── not-found.tsx       404
│   ├── robots.ts           robots.txt
│   └── sitemap.ts          sitemap.xml
├── components/
│   ├── brand/              Logo
│   ├── layout/             Header, Footer, MobileMenu
│   ├── home/               Home sections (Hero, Categories, etc.)
│   ├── product/            ProductCard, ProductGrid, ProductSlider, ProductDetail
│   ├── catalog/            CatalogView, CatalogFilters
│   ├── cart/               CartDrawer, CartPageClient
│   ├── checkout/           CheckoutView (4-step)
│   ├── search/             SearchModal
│   ├── legal/              LegalPage template, CookieBanner
│   ├── contact/            ContactForm
│   ├── faq/                FaqList
│   ├── shared/             Breadcrumbs, PageHero
│   └── ui/                 Button, Badge, Rating, Toaster, SocialIcons
└── lib/
    ├── data/               categories, products, reviews (test data)
    ├── store/              cart (Zustand), toast
    ├── types.ts            Domain types
    └── utils.ts            cn(), formatPrice(), computeDiscount(), slugify()
```

## 🎨 Design system

Défini dans `src/app/globals.css` via Tailwind v4 `@theme`.

### Couleurs
- **Base :** navy `#102A4C` (texte)
- **Accent :** coral `#F45168` (CTA principal)
- **Secondary :** sunflower, mint, sky, leaf, grape, tangerine
- **Backgrounds :** cream `#FFF9F1`, skywash, pinkwash

### Typographie
- **Display :** Fredoka (headings)
- **Body :** Nunito

### Composants réutilisables
`Button`, `Badge`, `Rating`, `Breadcrumbs`, `PageHero`, `QuantitySelector`, `ProductCard`, `ProductGrid`, `ProductSlider`, `CartDrawer`, `SearchModal`, `CookieBanner`, `Toaster`, `LegalPage`

## 🔌 Connecter un backend

Le code est **backend-agnostic**. Pour brancher un CMS ou une plateforme e-commerce :

1. Remplacer `src/lib/data/products.ts` par un fetcher async
2. Adapter les types dans `src/lib/types.ts` si nécessaire
3. Utiliser React Server Components ou route handlers pour les fetch

### Exemples
- **Shopify Storefront API** : `getProducts()` → `fetch(SHOPIFY_STORE + '/api/2024-01/graphql.json', ...)`
- **WooCommerce** : `fetch(WOOCOMMERCE_URL + '/wp-json/wc/v3/products', auth)`
- **Medusa** : `fetch(MEDUSA_BACKEND_URL + '/store/products')`
- **Strapi/Sanity** : GraphQL / REST endpoints

Voir `.env.example` pour la config.

## 🎯 SEO & Performance

- **Métadonnées** dynamiques par page (title, description, canonical, OG)
- **Structured data** : Organization, Product, BreadcrumbList, FAQPage
- **sitemap.xml** et **robots.txt** générés automatiquement
- **Static generation** pour toutes les pages produit et catégorie
- **prefers-reduced-motion** respecté
- **Lighthouse target :** ≥ 90 sur tous les axes

## ♿ Accessibilité

- ARIA labels sur tous les boutons icons
- Focus visible sur tous les interactifs
- `sr-only` labels pour form inputs
- Navigation clavier complète
- Contrast ratio ≥ 4.5:1 sur le texte
- `prefers-reduced-motion` désactive les animations lourdes

## 🍪 GDPR

Bandeau cookies affiché à la première visite. Choix :
- **Essentiels uniquement** (défaut) — panier, session, préférences
- **Tout accepter** — active analytics/marketing

⚠️ Aucune analyse externe ne doit être chargée avant le consentement.
Le choix est stocké dans `localStorage['mbaj-cookie-consent']`.

## 📸 Images

Actuellement en placeholder emoji + fond pastel.
Voir **`PLACEHOLDER_IMAGES.md`** pour la liste des images à générer et les prompts recommandés.

## 🚧 TODO avant lancement

- [ ] Générer et intégrer les vraies illustrations 3D (voir `PLACEHOLDER_IMAGES.md`)
- [ ] Brancher backend catalogue (Shopify / Woo / Medusa)
- [ ] Configurer Stripe (paiement réel)
- [ ] Configurer newsletter (Mailchimp / Brevo)
- [ ] Configurer emails transactionnels
- [ ] Ajouter analytics (uniquement post-consentement)
- [ ] Vérifier les droits d'utilisation des marques dans `BrandsStrip`
- [ ] Tests automatisés (Playwright / Vitest)
- [ ] Ajouter une page /connexion et /inscription réelles
- [ ] Compléter les infos légales (SIRET, TVA)
- [ ] Générer favicon + apple-touch-icon + OG image

## 📦 Déploiement

Recommandé : **Vercel** (natif Next.js).

```bash
vercel --prod
```

Alternatives : Netlify, Cloudflare Pages, Docker sur VPS.

## 🪪 Licence

Propriétaire — Ma Boîte à Jouets.

---

_Made with ❤️ and lots of ☕_

