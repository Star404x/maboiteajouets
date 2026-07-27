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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      {(formError || error) && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-800">{formError || error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-navy mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-2xl border border-navy/10 focus:outline-none focus:border-coral"
          required
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-navy mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Your password"
          className="w-full px-4 py-3 rounded-2xl border border-navy/10 focus:outline-none focus:border-coral"
          required
          autoComplete="current-password"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded"
          />
          <span className="text-navy/60">Remember me</span>
        </label>
        <Link href="#" className="text-coral font-semibold hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Logging in..." : "Log In"}
      </Button>

      <p className="text-center text-sm text-navy/60">
        Don't have an account?{" "}
        <Link href="/inscription" className="text-coral font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
