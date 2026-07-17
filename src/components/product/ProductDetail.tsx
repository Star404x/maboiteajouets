"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Truck, ShieldCheck, RotateCcw, Check, Baby, Ruler, Star } from "lucide-react";
import type { Product, Review } from "@/lib/types";
import { formatPrice, cn, computeDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { QuantitySelector } from "./QuantitySelector";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/store/cart";
import { toast } from "@/lib/store/toast";

const AGE_LABEL: Record<string, string> = {
  "0-12m": "0-12 mois",
  "1-3": "1-3 ans",
  "3-5": "3-5 ans",
  "6-8": "6-8 ans",
  "9+": "9 ans et +",
};

export function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"description" | "caracteristiques" | "livraison">("description");
  const [imgIndex, setImgIndex] = useState(0);

  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const toggleFav = useCart((s) => s.toggleFavorite);
  const favorites = useCart((s) => s.favorites);
  const isFav = favorites.includes(product.id);
  const discount = product.oldPrice ? computeDiscount(product.oldPrice, product.price) : 0;

  const gallery = product.images.length > 1
    ? product.images
    : [product.images[0], product.images[0], product.images[0], product.images[0]];

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            sku: product.id,
            category: product.categoryName,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "EUR",
              availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              url: `https://maboiteajouets.fr/produit/${product.slug}`,
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: reviews.length > 0 ? reviews.length : product.reviewCount,
            },
          }),
        }}
      />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Gallery */}
        <div>
          <div
            className={cn(
              "relative aspect-square rounded-3xl flex items-center justify-center overflow-hidden shadow-soft",
              product.bgClass,
            )}
          >
            {typeof gallery[imgIndex] === 'string' && gallery[imgIndex].startsWith('/') ? (
              <motion.img
                key={imgIndex}
                src={gallery[imgIndex]}
                alt={product.name}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-contain"
              />
            ) : (
              <motion.span
                key={imgIndex}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-[14rem] leading-none"
                role="img"
                aria-label={product.name}
              >
                {gallery[imgIndex]}
              </motion.span>
            )}
            {product.badge && (
              <div className="absolute top-4 left-4">
                <Badge label={product.badge} />
              </div>
            )}
            {discount > 0 && (
              <div className="absolute top-4 right-4 bg-navy text-white px-3 py-1 rounded-full text-sm font-bold">
                -{discount}%
              </div>
            )}
          </div>

          {/* Thumbs */}
          <div className="mt-4 grid grid-cols-4 gap-3">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={cn(
                  "aspect-square rounded-2xl flex items-center justify-center text-4xl transition-all overflow-hidden",
                  product.bgClass,
                  imgIndex === i ? "ring-2 ring-coral scale-105" : "opacity-70 hover:opacity-100",
                )}
                aria-label={`Image ${i + 1}`}
              >
                {typeof img === 'string' && img.startsWith('/') ? (
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain" />
                ) : (
                  img
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <Link
            href={`/categorie/${product.category}`}
            className="text-xs font-bold uppercase tracking-wider text-coral hover:underline"
          >
            {product.categoryName}
          </Link>

          <h1 className="mt-3 font-display font-bold text-navy text-display-sm md:text-display-md text-balance">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-4">
            <Rating value={product.rating} count={reviews.length > 0 ? reviews.length : product.reviewCount} size="lg" />
            <span className="inline-flex items-center gap-1 text-sm text-mint font-semibold">
              <Check className="w-4 h-4" />
              En stock
            </span>
          </div>

          <p className="mt-6 text-lg text-navy/70 leading-relaxed">{product.description}</p>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-4">
            <span className="font-display font-bold text-navy text-4xl">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-navy/40 text-xl line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-coral font-bold">
                Économisez {formatPrice(product.oldPrice! - product.price)}
              </span>
            )}
          </div>

          {/* Age tags */}
          {product.age.length > 0 && (
            <div className="mt-6 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-sm text-navy/70">
                <Baby className="w-4 h-4" /> Âge recommandé :
              </span>
              {product.age.map((a) => (
                <span
                  key={a}
                  className="px-3 py-1 rounded-full bg-cream-soft text-navy text-xs font-semibold"
                >
                  {AGE_LABEL[a] ?? a}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QuantitySelector value={qty} onChange={setQty} />
            <Button
              size="lg"
              onClick={() => {
                addItem(product.id, qty);
                openCart();
                toast("Ajouté au panier", `${qty} × ${product.name}`);
              }}
              className="flex-1 min-w-[220px]"
            >
              <ShoppingBag className="w-5 h-5" />
              Ajouter au panier
            </Button>
            <button
              onClick={() => {
                toggleFav(product.id);
                toast(isFav ? "Retiré des favoris" : "Ajouté aux favoris");
              }}
              className={cn(
                "h-14 w-14 rounded-full border-2 inline-flex items-center justify-center transition-all",
                isFav
                  ? "border-coral bg-coral/10 text-coral"
                  : "border-navy/10 text-navy hover:border-coral hover:text-coral",
              )}
              aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart className={cn("w-5 h-5", isFav && "fill-current")} />
            </button>
          </div>

          {/* Trust bar */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { Icon: Truck, label: "Livraison rapide" },
              { Icon: ShieldCheck, label: "Paiement sécurisé" },
              { Icon: RotateCcw, label: "Retour 14 jours" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center p-3 rounded-2xl bg-cream-soft">
                <Icon className="w-5 h-5 text-coral" />
                <span className="text-xs font-semibold text-navy">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16 lg:mt-24">
        <div className="border-b border-navy/10 flex gap-1 overflow-x-auto">
          {[
            { id: "description", label: "Description" },
            { id: "caracteristiques", label: "Caractéristiques" },
            { id: "livraison", label: "Livraison & retours" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={cn(
                "relative px-5 py-3 font-display font-semibold text-sm transition-colors whitespace-nowrap",
                tab === t.id ? "text-coral" : "text-navy/60 hover:text-navy",
              )}
            >
              {t.label}
              {tab === t.id && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-coral rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="py-8 max-w-3xl">
          {tab === "description" && (
            <div className="prose prose-navy">
              <p className="text-navy/80 text-lg leading-relaxed">
                {product.longDescription ?? product.description}
              </p>
            </div>
          )}

          {tab === "caracteristiques" && (
            <dl className="grid sm:grid-cols-2 gap-4">
              {product.materials && (
                <div className="p-5 rounded-2xl bg-cream-soft">
                  <dt className="text-xs font-bold uppercase tracking-wider text-navy/60 mb-2">
                    Matériaux
                  </dt>
                  <dd className="text-navy">{product.materials.join(", ")}</dd>
                </div>
              )}
              {product.dimensions && (
                <div className="p-5 rounded-2xl bg-cream-soft">
                  <dt className="text-xs font-bold uppercase tracking-wider text-navy/60 mb-2 inline-flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5" /> Dimensions
                  </dt>
                  <dd className="text-navy">{product.dimensions}</dd>
                </div>
              )}
              <div className="p-5 rounded-2xl bg-cream-soft">
                <dt className="text-xs font-bold uppercase tracking-wider text-navy/60 mb-2">
                  Âge recommandé
                </dt>
                <dd className="text-navy">
                  {product.age.map((a) => AGE_LABEL[a] ?? a).join(", ")}
                </dd>
              </div>
              {product.safety && (
                <div className="p-5 rounded-2xl bg-cream-soft">
                  <dt className="text-xs font-bold uppercase tracking-wider text-navy/60 mb-2">
                    Sécurité
                  </dt>
                  <dd className="text-navy">{product.safety.join(", ")}</dd>
                </div>
              )}
            </dl>
          )}

          {tab === "livraison" && (
            <div className="space-y-4 text-navy/80">
              <p>
                <strong className="text-navy">Livraison rapide en France :</strong> 48 à 72h ouvrées.
                Livraison gratuite dès 49 € d'achat.
              </p>
              <p>
                <strong className="text-navy">Retours simples :</strong> vous avez 14 jours pour changer d'avis.
                Frais de retour gratuits.
              </p>
              <p>
                <strong className="text-navy">Emballage soigné :</strong> tous nos colis sont emballés avec soin
                et un mot de remerciement.
              </p>
            </div>
          )}
        </div>
      </div>



      {/* Sticky mobile CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-navy/5 p-3 flex items-center gap-3 shadow-card">
        <div>
          <p className="font-display font-bold text-navy text-lg leading-none">
            {formatPrice(product.price)}
          </p>
          {product.oldPrice && (
            <p className="text-xs text-navy/50 line-through">{formatPrice(product.oldPrice)}</p>
          )}
        </div>
        <Button
          className="flex-1"
          onClick={() => {
            addItem(product.id, qty);
            openCart();
            toast("Ajouté au паниер", product.name);
          }}
        >
          <ShoppingBag className="w-4 h-4" />
          Ajouter au panier
        </Button>
      </div>
    </>
  );
}
