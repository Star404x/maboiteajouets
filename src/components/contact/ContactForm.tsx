"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-mint/20 mx-auto mb-4 inline-flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-mint" />
        </div>
        <h3 className="font-display font-bold text-navy text-xl mb-2">Merci !</h3>
        <p className="text-navy/70">Nous vous répondrons très bientôt.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        // TODO: POST vers API interne / Formspree / Resend
      }}
      className="space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="c-name" className="block text-sm font-semibold text-navy mb-1.5">
            Nom
          </label>
          <input
            id="c-name"
            required
            className="w-full h-12 px-4 rounded-2xl border-2 border-navy/10 focus:outline-none focus:border-coral"
          />
        </div>
        <div>
          <label htmlFor="c-email" className="block text-sm font-semibold text-navy mb-1.5">
            Email
          </label>
          <input
            id="c-email"
            type="email"
            required
            className="w-full h-12 px-4 rounded-2xl border-2 border-navy/10 focus:outline-none focus:border-coral"
          />
        </div>
      </div>
      <div>
        <label htmlFor="c-subject" className="block text-sm font-semibold text-navy mb-1.5">
          Sujet
        </label>
        <input
          id="c-subject"
          required
          className="w-full h-12 px-4 rounded-2xl border-2 border-navy/10 focus:outline-none focus:border-coral"
        />
      </div>
      <div>
        <label htmlFor="c-message" className="block text-sm font-semibold text-navy mb-1.5">
          Votre message
        </label>
        <textarea
          id="c-message"
          rows={5}
          required
          className="w-full px-4 py-3 rounded-2xl border-2 border-navy/10 focus:outline-none focus:border-coral resize-none"
        />
      </div>
      <Button type="submit" size="lg" className="w-full">
        <Send className="w-4 h-4" />
        Envoyer le message
      </Button>
    </form>
  );
}
