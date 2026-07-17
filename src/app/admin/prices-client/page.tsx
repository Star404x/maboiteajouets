"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Lock, Save, RotateCw } from "lucide-react";

interface PriceRow {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  isEditing?: boolean;
}

export default function AdminPricesPage() {
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const ADMIN_PASSWORD = "admin123";
const ADMIN_API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || "admin123";

  // Load prices from API
  const loadPrices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/prices");
      const data = await res.json();
      if (data.success) {
        setPrices(data.prices.map((p: any) => ({ ...p, originalPrice: p.price })));
        setMessage({ type: "success", text: "Prices loaded" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadPrices();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      setMessage({ type: "error", text: "Wrong password" });
    }
  };

  const updatePrice = async (id: string, newPrice: number) => {
    try {
      const res = await fetch("/api/prices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ADMIN_API_KEY,
        },
        body: JSON.stringify({ id, price: newPrice }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local state
        setPrices(prices.map((p) => (p.id === id ? { ...p, price: newPrice, originalPrice: newPrice } : p)));
        setMessage({ type: "success", text: `${data.product.name} updated to €${newPrice}` });
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coral to-coral/80">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-coral mr-2" />
            <h1 className="text-2xl font-display font-bold text-navy">Admin Panel</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-navy/20 rounded-2xl focus:border-coral focus:outline-none"
                placeholder="Enter admin password"
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Login
            </Button>
          </form>

          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-cream-soft p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-navy">Price Management</h1>
          <Button
            onClick={() => {
              setIsAuthenticated(false);
              setPrices([]);
            }}
            variant="secondary"
            size="sm"
          >
            Logout
          </Button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-4 rounded-2xl ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border-2 border-green-300"
                : "bg-red-100 text-red-700 border-2 border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Refresh button */}
        <div className="mb-6">
          <Button
            onClick={loadPrices}
            disabled={loading}
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            {loading ? "Loading..." : "Refresh Prices"}
          </Button>
        </div>

        {/* Prices Table */}
        {prices.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 md:p-6 border-b-2 border-navy/10 font-semibold">
              <div>Product</div>
              <div>Current Price</div>
              <div>New Price</div>
              <div></div>
            </div>

            <div className="divide-y divide-navy/10">
              {prices.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 md:p-6 items-center hover:bg-cream-soft transition-colors"
                >
                  <div>
                    <p className="font-semibold text-navy">{row.name}</p>
                    <p className="text-xs text-navy/60">{row.id}</p>
                  </div>

                  <div className="text-lg font-semibold text-coral">
                    {formatPrice(row.originalPrice || row.price)}
                  </div>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={row.price}
                    onChange={(e) => {
                      setPrices(
                        prices.map((p) =>
                          p.id === row.id ? { ...p, price: parseFloat(e.target.value) || 0 } : p
                        )
                      );
                    }}
                    className="px-3 py-2 border-2 border-navy/20 rounded-lg focus:border-coral focus:outline-none font-semibold"
                  />

                  <Button
                    onClick={() => updatePrice(row.id, row.price)}
                    disabled={row.price === row.originalPrice}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : !loading ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-soft">
            <p className="text-navy/60">No prices loaded</p>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl shadow-soft">
            <p className="text-navy/60">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
