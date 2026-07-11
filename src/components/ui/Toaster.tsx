"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { toastStore } from "@/lib/store/toast";

export function Toaster() {
  const [items, setItems] = useState(toastStore.getState());

  useEffect(() => {
    const unsubscribe = toastStore.subscribe(setItems);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="fixed top-24 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="pointer-events-auto flex items-start gap-3 bg-white rounded-2xl shadow-card p-4 pr-3 border border-navy/5 min-w-[280px] max-w-[380px]"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="w-5 h-5 text-mint shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-display font-semibold text-navy text-sm">{t.title}</p>
              {t.description && (
                <p className="text-navy/70 text-xs mt-0.5">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => toastStore.dismiss(t.id)}
              className="text-navy/40 hover:text-navy transition-colors p-1"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
