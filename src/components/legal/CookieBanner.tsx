"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "mbaj-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Small delay so it doesn't fight with hero animations
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const set = (value: "accepted" | "essential") => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
    // NOTE: GDPR — do NOT enable analytics unless value === "accepted"
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:bottom-6 md:max-w-md z-[95]"
          role="dialog"
          aria-live="polite"
          aria-label="Consentement cookies"
        >
          <div className="bg-white rounded-3xl shadow-card border border-navy/5 p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-sunflower/20 inline-flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 text-sunflower" />
              </div>
              <div>
                <h3 className="font-display font-bold text-navy mb-1">Un petit cookie ? 🍪</h3>
                <p className="text-sm text-navy/70 leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience. Les cookies analytiques restent désactivés jusqu'à votre accord.{" "}
                  <Link href="/cookies" className="text-coral underline">
                    En savoir plus
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button size="sm" variant="secondary" onClick={() => set("essential")} className="flex-1">
                Essentiels uniquement
              </Button>
              <Button size="sm" onClick={() => set("accepted")} className="flex-1">
                Tout accepter
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
