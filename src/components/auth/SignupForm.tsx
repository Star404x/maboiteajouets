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
      setFormError("All fields are required");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setFormError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters long");
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
      setFormError(result.error || "Registration failed");
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-3xl bg-green-50 border-2 border-green-200">
        <h2 className="font-display font-bold text-green-900 mb-4">
          ✅ Account Created!
        </h2>
        <p className="text-sm text-green-800 mb-6">
          Your account has been created successfully. You can now log in.
        </p>
        <Button asChild className="w-full">
          <Link href="/connexion">Go to Login</Link>
        </Button>
      </div>
    );
  }

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
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-navy mb-2">
          Full Name (optional)
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full px-4 py-3 rounded-2xl border border-navy/10 focus:outline-none focus:border-coral"
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
          placeholder="At least 8 characters"
          className="w-full px-4 py-3 rounded-2xl border border-navy/10 focus:outline-none focus:border-coral"
          required
        />
        <p className="text-xs text-navy/60 mt-2">
          Must contain uppercase, lowercase, and numbers
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-navy mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
          placeholder="Repeat password"
          className="w-full px-4 py-3 rounded-2xl border border-navy/10 focus:outline-none focus:border-coral"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-navy/60">
        Already have an account?{" "}
        <Link href="/connexion" className="text-coral font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
