"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Truck, Minus, Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart, FREE_SHIPPING, computeCart } from "@/lib/store/cart";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export function CartPageClient() {
  const items = useCart((s) => s.items);
  const updateQty = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  const { lines, subtotal, shipping, total } = useMemo(
    () => computeCart(items),
    [items],
  );

  const remaining = Math.max(0, FREE_SHIPPING - subtotal);

  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Panier" }]} />

      <h1 className="font-display font-bold text-navy text-display-md md:text-display-lg mb-8">
        Mon <span className="text-coral">panier</span>
      </h1>

      {lines.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 rounded-full bg-cream-soft mx-auto mb-6 inline-flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-navy/30" />
          </div>
          <h2 className="font-display font-bold text-navy text-2xl mb-3">
            Votre panier est vide
          </h2>
          <p className="text-navy/60 mb-8 max-w-md mx-auto">
            Découvrez notre collection de jouets premium et faites plaisir aux petits comme aux grands.
          </p>
          <Button asChild size="lg">
            <Link href="/boutique">
              <ArrowLeft className="w-4 h-4" />
              Continuer les achats
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">
          {/* Items */}
          <div className="space-y-3">
            <AnimatePresence>
              {lines.map((line) => (
                <motion.div
                  key={line.productId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  layout
                  className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-white rounded-3xl shadow-soft"
                >
                  <Link
                    href={`/produit/${line.product.slug}`}
                    className={cn(
                      "shrink-0 w-full sm:w-32 h-32 rounded-2xl flex items-center justify-center text-6xl",
                      line.product.bgClass,
                    )}
                  >
                    {line.product.images[0]}
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-navy/50">
                        {line.product.categoryName}
                      </p>
                      <Link
                        href={`/produit/${line.product.slug}`}
                        className="font-display font-bold text-navy text-lg hover:text-coral"
                      >
                        {line.product.name}
                      </Link>
                      <p className="text-navy/60 text-sm line-clamp-1 mt-1">
                        {line.product.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
                      <div className="inline-flex items-center h-10 rounded-full border-2 border-navy/10 bg-white">
                        <button
                          onClick={() => updateQty(line.productId, line.quantity - 1)}
                          className="h-full w-10 inline-flex items-center justify-center text-navy hover:text-coral"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(line.productId, line.quantity + 1)}
                          className="h-full w-10 inline-flex items-center justify-center text-navy hover:text-coral"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-navy text-lg">
                          {formatPrice(line.product.price * line.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(line.productId)}
                          className="p-2 text-navy/40 hover:text-coral transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="pt-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/boutique">
                  <ArrowLeft className="w-4 h-4" /> Continuer les achats
                </Link>
              </Button>
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 bg-white rounded-3xl shadow-card p-6 space-y-4">
            <h2 className="font-display font-bold text-navy text-xl">Récapitulatif</h2>

            {remaining > 0 && (
              <div className="p-4 rounded-2xl bg-coral/5 flex gap-3 items-start">
                <Truck className="w-5 h-5 text-coral shrink-0 mt-0.5" />
                <p className="text-sm text-navy/80">
                  Plus que <span className="font-bold text-coral">{formatPrice(remaining)}</span>{" "}
                  pour la livraison gratuite !
                </p>
              </div>
            )}

            <div className="space-y-2.5">
              <div className="flex justify-between text-navy/70">
                <span>Sous-total</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-navy/70">
                <span>Livraison</span>
                <span className="font-semibold">
                  {shipping === 0 ? (
                    <span className="text-mint">Gratuite</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              <div className="pt-3 border-t border-navy/10 flex justify-between text-lg">
                <span className="font-display font-bold text-navy">Total</span>
                <span className="font-display font-bold text-navy text-2xl">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <Button asChild size="lg" className="w-full">
              <Link href="/commande">
                Passer la commande <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <p className="text-xs text-navy/50 text-center">
              🔒 Paiement 100% sécurisé — CB, Apple Pay, PayPal
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
