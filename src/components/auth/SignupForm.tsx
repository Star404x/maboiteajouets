"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function SignupForm() {
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    passwordConfirm: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

    // Validation
    if (!formData.email || !formData.password || !formData.passwordConfirm) {
      setFormError("Tous les champs sont requis");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setFormError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 8) {
      setFormError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    const result = await register(
      formData.email,
      formData.password,
      formData.passwordConfirm,
      formData.fullName || undefined
    );

    if (result.success) {
      // Save user name to localStorage for header
      if (result.user?.fullName) {
        localStorage.setItem('user_name', result.user.fullName);
      }
      setSuccess(true);
      setFormData({
        email: "",
        fullName: "",
        password: "",
        passwordConfirm: "",
      });
    } else {
      setFormError(result.error || "Inscription échouée");
    }
  };

  if (success) {
    return (
      <div className="p-6 rounded-2xl bg-green-50 border-2 border-green-200">
        <h2 className="font-display font-bold text-green-900 mb-3 text-lg">
          ✅ Compte créé avec succès !
        </h2>
        <p className="text-sm text-green-800 mb-6">
          Votre compte a été créé. Vous pouvez maintenant vous connecter.
        </p>
        <Button asChild className="w-full bg-green-600 hover:bg-green-700">
          <Link href="/connexion">Aller à la connexion</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(formError || error) && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-800 font-medium">{formError || error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-navy mb-3">
          Nom complet
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Votre nom"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/10 transition-colors"
          autoComplete="name"
        />
      </div>

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
          placeholder="Min. 8 caractères"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/10 transition-colors"
          required
          autoComplete="new-password"
        />
        <p className="text-xs text-navy/60 mt-2">
          Doit contenir majuscules, minuscules et chiffres
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-navy mb-3">
          Confirmez le mot de passe
        </label>
        <input
          type="password"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
          placeholder="Confirmez votre mot de passe"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/10 transition-colors"
          required
          autoComplete="new-password"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full mt-8 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Inscription en cours..." : "Créer le compte"}
      </Button>

      <div className="text-center text-sm text-navy/70 pt-2">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="text-coral font-semibold hover:text-coral/80 transition-colors">
          Se connecter
        </Link>
      </div>
    </form>
  );
}
