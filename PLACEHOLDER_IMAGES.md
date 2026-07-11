# 🎨 Placeholders — À remplacer avant lancement

Toutes les illustrations sont actuellement des **emoji + fonds pastel**.
Elles doivent être remplacées par de vraies **illustrations 3D** dans le style visuel du référentiel.

## 🎯 Prompt de base (à réutiliser pour toutes les images)

```
Premium soft 3D illustration for a French children's toy store, cute and friendly,
warm studio lighting, rounded organic forms, pastel colors, soft ambient shadows,
clean cream background (#FFF9F1), high-end commercial advertising style,
child-friendly, no text, no watermark, no realistic children.
Style: octane render, subtle depth of field, matte finish.
```

## 📸 Images à générer

### Hero — composition principale (obligatoire)
- **Fichier attendu :** `public/images/hero-composition.webp` (1200×1200, transparent PNG ou WebP)
- **Prompt :**
  ```
  {base prompt} — an open cardboard toy box in the center, teddy bear popping out,
  white bunny, friendly green dinosaur, cute rocket, wooden blocks, star pyramid,
  wooden train — floating clouds and stars around, warm coral and yellow glow.
  ```
- **Utilisation :** `src/components/home/Hero.tsx` (remplacer `<HeroIllustration />`)

### Catégories (6 tuiles)
Chaque tuile ~ 400×400, fond transparent.
Utilisation : `src/lib/data/categories.ts` — remplacer le champ `icon` (emoji) par un chemin d'image.

| Slug | Prompt suffix | Fichier |
|---|---|---|
| peluches | `a cute soft plush teddy bear front view` | `public/images/cat-peluches.webp` |
| jouets-educatifs | `colorful wooden puzzle with alphabet` | `public/images/cat-educatifs.webp` |
| vehicules | `red toy sports car, chunky shapes` | `public/images/cat-vehicules.webp` |
| jeux-de-societe | `stack of colorful board games and dice` | `public/images/cat-jeux.webp` |
| jouets-bebe | `wooden stacking rings and rattle` | `public/images/cat-bebe.webp` |
| jeux-exterieur | `child kick scooter and ball` | `public/images/cat-exterieur.webp` |

### Produits (14 tuiles)
Chaque produit ~ 800×800, fond transparent.
Utilisation : `src/lib/data/products.ts` — remplacer `images: ["emoji"]` par `images: ["/images/products/slug.webp"]`.

**Prompt template :**
```
{base prompt} — {PRODUCT_DESCRIPTION}, isolated centered composition,
subtle drop shadow underneath.
```

Liste :
- `ours-en-peluche-tout-doux` — soft brown teddy bear plush, medium size
- `train-en-bois` — colorful wooden toy train with 3 carriages
- `boite-creative` — open craft box with stickers, markers, stencils
- `trottinette-enfant` — kids 3-wheel scooter, coral pink accents
- `robot-educatif` — friendly small robot toy with round head, mint accents
- `maison-de-poupee` — wooden dollhouse with pastel roof
- `lapin-blanc-doudou` — small white plush bunny with long ears
- `dinosaure-vert-cuddly` — cute green plush dinosaur
- `cubes-en-bois` — stack of colored wooden blocks
- `fusee-lumineuse` — cartoon rocket ship, coral and yellow
- `puzzle-animaux` — wooden farm animal puzzle
- `ballon-multicolore` — multicolor rubber ball
- `cuisine-de-jeu` — mini wooden play kitchen with accessories
- `jeu-de-memoire` — small stack of wooden memory cards with animals

### Blocks additionnels
- **Benefits (rocket)** — `public/images/rocket-with-clouds.webp`
- **PromoBanner (gift box)** — `public/images/gift-box-open.webp`
- **About page hero** — `public/images/story-scene.webp`
- **404 page** — `public/images/lost-teddy.webp`
- **OpenGraph** — `public/og-image.jpg` (1200×630)
- **Favicon** — `public/favicon.ico` (32×32 + 16×16 + 192×192 + 512×512)
- **Apple touch icon** — `public/apple-touch-icon.png` (180×180)

## 🔄 Comment remplacer

1. Placer les fichiers dans `public/images/`
2. Dans le composant concerné, remplacer :
   ```tsx
   <span className="text-9xl">🧸</span>
   ```
   par :
   ```tsx
   <Image
     src="/images/products/ours-en-peluche-tout-doux.webp"
     alt="Ours en peluche"
     width={400}
     height={400}
     priority // pour les images above-the-fold
   />
   ```
3. Dans `src/lib/data/products.ts`, changer `images: ["🧸"]` en `images: ["/images/products/xxx.webp"]`
4. Adapter `ProductCard.tsx` et `ProductDetail.tsx` pour utiliser `<Image>` au lieu du `<span>`

## ✅ Checklist visuelle avant lancement

- [ ] Toutes les illustrations 3D générées et optimisées (WebP + AVIF)
- [ ] Cohérence du style entre toutes les images
- [ ] Poids max par image : 200 KB
- [ ] Alt-texts en français, descriptifs
- [ ] `sizes` correct pour chaque `<Image>` (mobile/desktop)
- [ ] Favicon + Apple touch icon en place
- [ ] OG image générée avec logo visible
- [ ] Test sur écran Retina + non-Retina
- [ ] Zoom 200% : les images restent nettes

## 🚫 Marques et logos externes

Les logos LEGO, Playmobil, VTech, Smoby, Janod affichés dans `BrandsStrip` sont
des **placeholders textuels**. Avant toute mise en ligne, il faut :

1. Obtenir l'autorisation écrite d'utilisation
2. OU les remplacer par des marques dont nous avons les droits
3. OU les retirer complètement
