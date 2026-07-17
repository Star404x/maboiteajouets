"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSent(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="c-name" className="block text-sm font-semibold text-navy mb-1.5">
            Nom
          </label>
          <input
            id="c-name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 rounded-2xl border-2 border-navy/10 focus:outline-none focus:border-coral resize-none"
        />
      </div>
      {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        <Send className="w-4 h-4" />
        {loading ? "Envoi en cours..." : "Envoyer le message"}
      </Button>
    </form>
  );
}
