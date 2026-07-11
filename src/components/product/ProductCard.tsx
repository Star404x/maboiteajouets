"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, cn, computeDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { useCart } from "@/lib/store/cart";
import { toast } from "@/lib/store/toast";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const toggleFav = useCart((s) => s.toggleFavorite);
  const isFav = useCart((s) => s.isFavorite(product.id));
  const discount = product.oldPrice ? computeDiscount(product.oldPrice, product.price) : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col bg-white rounded-3xl shadow-soft hover:shadow-card transition-all duration-500 overflow-hidden"
    >
      {/* Image area */}
      <Link href={`/produit/${product.slug}`} className="block">
        <div
          className={cn(
            "relative aspect-square flex items-center justify-center overflow-hidden",
            product.bgClass,
          )}
        >
          {/* Placeholder emoji — replace with <Image /> when 3D renders arrive */}
          <span
            className="text-[7rem] leading-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
            role="img"
            aria-label={product.name}
          >
            {product.images[0]}
          </span>

          {/* Top-left badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.badge && <Badge label={product.badge} />}
            {discount > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-navy text-white text-[11px] font-bold shadow-soft">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick-view button — appears on hover */}
          <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur text-navy text-xs font-semibold shadow-card">
              <Eye className="w-3.5 h-3.5" />
              Aperçu rapide
            </span>
          </div>
        </div>
      </Link>

      {/* Favorite */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFav(product.id);
          toast(
            isFav ? "Retiré des favoris" : "Ajouté aux favoris",
            product.name,
          );
        }}
        className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/95 backdrop-blur shadow-soft inline-flex items-center justify-center hover:scale-110 transition-transform"
        aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Heart
          className={cn(
            "w-4 h-4 transition-colors",
            isFav ? "fill-coral text-coral" : "text-navy/60",
          )}
        />
      </button>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-[11px] font-semibold text-navy/50 uppercase tracking-wider">
          {product.categoryName}
        </p>
        <Link href={`/produit/${product.slug}`} className="group/link">
          <h3 className="font-display font-semibold text-navy text-base leading-tight group-hover/link:text-coral transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <Rating value={product.rating} count={product.reviewCount} size="sm" />
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display font-bold text-navy text-lg">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-navy/40 text-sm line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              addItem(product.id, 1);
              openCart();
              toast("Ajouté au panier", product.name);
            }}
            className="h-10 w-10 shrink-0 rounded-full bg-navy hover:bg-coral text-white inline-flex items-center justify-center transition-colors shadow-soft"
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
