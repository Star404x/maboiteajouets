"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.email || !formData.password) {
      setFormError("Email and password are required");
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Save user name to localStorage for header
      if (result.user?.fullName) {
        localStorage.setItem('user_name', result.user.fullName);
      }
      // Redirect to account page
      router.push("/compte");
    } else {
      setFormError(result.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(formError || error) && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-800 font-medium">{formError || error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-navy mb-3">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="votre@email.com"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/10 transition-colors"
          required
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-navy mb-3">
          Mot de passe
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Entrez votre mot de passe"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/10 transition-colors"
          required
          autoComplete="current-password"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
          />
          <span className="text-navy/70">Se souvenir de moi</span>
        </label>
        <Link href="#" className="text-coral font-semibold hover:text-coral/80 transition-colors">
          Mot de passe oublié ?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full mt-8 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Connexion en cours..." : "Se connecter"}
      </Button>

      <div className="text-center text-sm text-navy/70 pt-2">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-coral font-semibold hover:text-coral/80 transition-colors">
          Créer un compte
        </Link>
      </div>
    </form>
  );
}
