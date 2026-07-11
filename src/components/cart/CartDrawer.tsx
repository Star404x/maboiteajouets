"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag, Truck, ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { useCart, FREE_SHIPPING } from "@/lib/store/cart";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const closeCart = useCart((s) => s.closeCart);
  const lines = useCart((s) => s.getLines());
  const subtotal = useCart((s) => s.getSubtotal());
  const shipping = useCart((s) => s.getShipping());
  const total = useCart((s) => s.getTotal());
  const updateQty = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-[80]"
            onClick={closeCart}
            aria-hidden
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-cream z-[90] shadow-card flex flex-col"
            role="dialog"
            aria-label="Panier"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-navy/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-coral/10 inline-flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-coral" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-navy">Votre panier</h2>
                  <p className="text-xs text-navy/60">{lines.length} article{lines.length > 1 ? "s" : ""}</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="h-10 w-10 inline-flex items-center justify-center rounded-full text-navy hover:bg-navy/5"
                aria-label="Fermer le panier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free shipping progress */}
            {lines.length > 0 && (
              <div className="px-5 py-4 border-b border-navy/5">
                {remaining > 0 ? (
                  <>
                    <p className="text-sm text-navy/80 mb-2 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-coral" />
                      Plus que{" "}
                      <span className="font-bold text-coral">{formatPrice(remaining)}</span>{" "}
                      pour la livraison gratuite
                    </p>
                    <div className="h-2 rounded-full bg-navy/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-coral rounded-full"
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-mint flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Livraison gratuite débloquée ! 🎉
                  </p>
                )}
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {lines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-24 h-24 rounded-full bg-cream-soft flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-navy/30" />
                  </div>
                  <h3 className="font-display font-bold text-navy text-lg mb-2">
                    Votre panier est vide
                  </h3>
                  <p className="text-navy/60 text-sm mb-6 max-w-[240px]">
                    Découvrez nos jouets et faites plaisir aux petits comme aux grands.
                  </p>
                  <Button onClick={closeCart} asChild>
                    <Link href="/boutique">Découvrir la boutique</Link>
                  </Button>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  <AnimatePresence>
                    {lines.map((line) => (
                      <motion.li
                        key={line.productId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 bg-white rounded-2xl p-3 shadow-soft"
                      >
                        <Link
                          href={`/produit/${line.product.slug}`}
                          onClick={closeCart}
                          className={cn(
                            "shrink-0 w-20 h-20 rounded-xl flex items-center justify-center text-4xl",
                            line.product.bgClass,
                          )}
                        >
                          {line.product.images[0]}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/produit/${line.product.slug}`}
                            onClick={closeCart}
                            className="font-display font-semibold text-navy text-sm hover:text-coral line-clamp-2"
                          >
                            {line.product.name}
                          </Link>
                          <p className="text-xs text-navy/60 mb-2">
                            {line.product.categoryName}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <div className="inline-flex items-center h-8 rounded-full border border-navy/10 bg-cream-light">
                              <button
                                onClick={() => updateQty(line.productId, line.quantity - 1)}
                                className="h-full w-8 inline-flex items-center justify-center text-navy hover:text-coral"
                                aria-label="Diminuer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center text-sm font-bold tabular-nums">
                                {line.quantity}
                              </span>
                              <button
                                onClick={() => updateQty(line.productId, line.quantity + 1)}
                                className="h-full w-8 inline-flex items-center justify-center text-navy hover:text-coral"
                                aria-label="Augmenter"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-navy text-sm">
                                {formatPrice(line.product.price * line.quantity)}
                              </span>
                              <button
                                onClick={() => removeItem(line.productId)}
                                className="text-navy/40 hover:text-coral p-1"
                                aria-label="Retirer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {lines.length > 0 && (
              <div className="border-t border-navy/5 p-5 space-y-3 bg-white">
                <div className="flex items-center justify-between text-sm text-navy/70">
                  <span>Sous-total</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-navy/70">
                  <span>Livraison</span>
                  <span className="font-semibold">
                    {shipping === 0 ? "Gratuite" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg pt-3 border-t border-navy/5">
                  <span className="font-display font-bold text-navy">Total</span>
                  <span className="font-display font-bold text-navy text-xl">
                    {formatPrice(total)}
                  </span>
                </div>
                <Button asChild size="lg" className="w-full mt-2">
                  <Link href="/commande" onClick={closeCart}>
                    Passer la commande
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/panier" onClick={closeCart}>
                    Voir le panier
                  </Link>
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
