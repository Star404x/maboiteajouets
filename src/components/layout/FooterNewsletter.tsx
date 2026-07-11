"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");

  return (
    <form
      className="flex items-center gap-2 w-full md:w-auto"
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: connect to backend
        setEmail("");
      }}
    >
      <label htmlFor="footer-newsletter" className="sr-only">
        Email
      </label>
      <input
        id="footer-newsletter"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre email"
        className="flex-1 md:w-64 h-11 px-4 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-coral focus:bg-white/15"
      />
      <button
        type="submit"
        className="h-11 px-5 rounded-full bg-coral hover:bg-coral-500 text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors"
        aria-label="S'inscrire"
      >
        <Send className="w-4 h-4" />
        <span className="hidden sm:inline">Je m&apos;inscris</span>
      </button>
    </form>
  );
}
