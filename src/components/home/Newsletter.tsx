"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: connecter à backend (Klaviyo / Mailchimp / API interne)
    setStatus("success");
    setTimeout(() => {
      setStatus("idle");
      setEmail("");
    }, 3500);
  };

  return (
    <section className="container-wide py-16 lg:py-20">
      <div className="relative overflow-hidden rounded-4xl bg-cream-soft border border-coral/10 p-8 md:p-14">
        {/* Decorative sparkles */}
        <div aria-hidden className="absolute top-8 right-10 text-4xl">✨</div>
        <div aria-hidden className="absolute bottom-8 left-10 text-3xl opacity-60">⭐</div>

        <div className="max-w-2xl mx-auto text-center relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-coral/10 mb-6">
            <Mail className="w-7 h-7 text-coral" />
          </div>

          <h2 className="font-display font-bold text-navy text-display-md md:text-display-lg text-balance">
            Un peu de magie dans votre <span className="text-coral">boîte mail</span>
          </h2>
          <p className="mt-4 text-navy/70 text-lg">
            Recevez nos nouveautés, nos idées cadeaux et nos offres exclusives.
          </p>

          <form onSubmit={submit} className="mt-8 max-w-lg mx-auto">
            {status === "success" ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-3 p-4 rounded-full bg-mint/10 text-navy"
              >
                <CheckCircle2 className="w-5 h-5 text-mint" />
                <span className="font-semibold">Merci ! On vous écrit très bientôt 💌</span>
              </motion.div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <label htmlFor="newsletter-email" className="sr-only">
                  Votre email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="flex-1 h-14 px-6 rounded-full bg-white border-2 border-navy/10 focus:border-coral focus:outline-none text-navy placeholder:text-navy/40"
                />
                <Button type="submit" size="lg">
                  <Sparkles className="w-4 h-4" />
                  Je m'inscris
                </Button>
              </div>
            )}
          </form>

          <p className="mt-4 text-xs text-navy/50">
            En vous inscrivant, vous acceptez de recevoir nos emails. Désinscription en 1 clic.
          </p>
        </div>
      </div>
    </section>
  );
}
