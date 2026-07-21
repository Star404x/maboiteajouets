"use client";

import { useEffect, useState } from "react";

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  newsletterSubscribed?: boolean;
  createdAt?: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        if (!token) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
          }));
          return;
        }

        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Token is invalid, clear it
          localStorage.removeItem("auth_token");
          setState((prev) => ({
            ...prev,
            isLoading: false,
          }));
          return;
        }

        const data = await response.json();

        if (data.success) {
          setState({
            user: data.user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        }
      } catch (err) {
        console.error("[AUTH] Error checking authentication:", err);
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    checkAuth();
  }, []);

  const register = async (
    email: string,
    password: string,
    passwordConfirm: string,
    fullName?: string
  ) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          passwordConfirm,
          fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      setState({
        user: data.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      return { success: true, user: data.user };
    } catch (err: any) {
      const errorMsg = err.message || "Registration failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));
      return { success: false, error: errorMsg };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      setState({
        user: data.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      return { success: true, user: data.user };
    } catch (err: any) {
      const errorMsg = err.message || "Login failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });
  };

  return {
    ...state,
    register,
    login,
    logout,
  };
}
