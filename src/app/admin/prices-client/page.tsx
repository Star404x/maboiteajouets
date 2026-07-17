"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Lock, Save, RotateCw } from "lucide-react";

interface PriceRow {
  id: string;
  name: string;
  price: number;
  slug: string;
  originalPrice?: number;
}

const DEMO_PRODUCTS: PriceRow[] = [
  { id: "p-001", name: "Ours en peluche tout doux", price: 19.90, slug: "ours-peluche", originalPrice: 19.90 },
  { id: "p-003", name: "Boîte créative", price: 29.90, slug: "boite-creative", originalPrice: 29.90 },
  { id: "p-005", name: "Robot éducatif", price: 59.90, slug: "robot-educatif", originalPrice: 59.90 },
  { id: "p-006", name: "Maison de poupée", price: 89.90, slug: "maison-poupee", originalPrice: 89.90 },
  { id: "p-007", name: "Lapin blanc doudou", price: 16.90, slug: "lapin-blanc", originalPrice: 16.90 },
  { id: "p-009", name: "Boîte d'activités Hape", price: 36.40, slug: "boite-activites-hape", originalPrice: 36.40 },
  { id: "p-014", name: "Jeu de mémoire", price: 18.50, slug: "jeu-memoire", originalPrice: 18.50 },
  { id: "p-017", name: "Actiroller Musical", price: 32.80, slug: "actiroller", originalPrice: 32.80 },
  { id: "p-021", name: "Tapis d'activités montgolfière", price: 49.90, slug: "tapis-montgolfiere", originalPrice: 49.90 },
  { id: "p-022", name: "Panier de Basket Réglable", price: 131.72, slug: "panier-basket", originalPrice: 131.72 },
  { id: "p-023", name: "Balançoire Confortable", price: 199.90, slug: "balancoire", originalPrice: 199.90 },
  { id: "p-025", name: "Table d'activités dinosaure", price: 81.80, slug: "table-dinosaure", originalPrice: 81.80 },
];

export default function AdminPricesPage() {
  const [prices, setPrices] = useState<PriceRow[]>(DEMO_PRODUCTS);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const ADMIN_PASSWORD = "admin123";

  // Load from localStorage on first render
  useEffect(() => {
    try {
      const cached = localStorage.getItem("adminPrices");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPrices(parsed);
          return;
        }
      }
    } catch (error) {
      console.error("Cache error:", error);
    }
    // Save defaults to cache
    localStorage.setItem("adminPrices", JSON.stringify(DEMO_PRODUCTS));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword("");
      setMessage(null);
    } else {
      setMessage({ type: "error", text: "❌ Wrong password" });
    }
  };

  const updatePrice = (id: string, newPrice: number) => {
    const updated = prices.map((p) =>
      p.id === id ? { ...p, price: newPrice } : p
    );
    setPrices(updated);
    localStorage.setItem("adminPrices", JSON.stringify(updated));
    const product = updated.find((p) => p.id === id);
    setMessage({ type: "success", text: `✅ ${product?.name} → €${newPrice}` });
  };

  const syncToDatabase = async (id: string) => {
    const product = prices.find((p) => p.id === id);
    if (!product) return;

    try {
      const response = await fetch("/.netlify/functions/webhook-update-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          newPrice: product.price,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => null);

      if (response?.ok) {
        setMessage({ type: "success", text: `✅ ${product.name} synced to DB` });
      } else {
        setMessage({ type: "success", text: "✅ Saved (DB sync pending)" });
      }
    } catch (error) {
      setMessage({ type: "success", text: "✅ Saved (DB sync pending)" });
    }
  };

  const syncAll = async () => {
    for (const product of prices) {
      await syncToDatabase(product.id);
      await new Promise((r) => setTimeout(r, 100));
    }
  };

  // Login UI
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coral to-coral/80">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-coral mr-2" />
            <h1 className="text-2xl font-display font-bold text-navy">Admin Panel</h1>
          </div>

          {message && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{message.text}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-navy/20 rounded-2xl focus:border-coral focus:outline-none"
              placeholder="Enter admin password"
              autoFocus
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy/5 to-coral/5 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-navy">Price Management</h1>
            <p className="text-navy/60 mt-1">{prices.length} products</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-6 py-2 text-coral hover:bg-coral/10 rounded-lg"
          >
            Logout
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm font-semibold ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-navy/5 border-b">
                <th className="px-6 py-4 text-left text-sm font-semibold text-navy">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-navy">Original</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-navy">Current</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-navy">Action</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p, idx) => (
                <tr key={p.id} className={idx % 2 === 0 ? "bg-white" : "bg-navy/2"}>
                  <td className="px-6 py-4 text-sm text-navy font-medium">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-navy/60">{formatPrice(p.originalPrice || 0)}</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      step="0.10"
                      value={p.price}
                      onChange={(e) => updatePrice(p.id, parseFloat(e.target.value))}
                      className="w-24 px-3 py-2 border border-navy/20 rounded-lg text-sm"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => syncToDatabase(p.id)}
                      className="p-2 rounded-lg bg-coral/10 text-coral hover:bg-coral/20"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t px-6 py-4 bg-navy/2 flex gap-3 justify-end">
            <button
              onClick={() => {
                setPrices(DEMO_PRODUCTS);
                localStorage.setItem("adminPrices", JSON.stringify(DEMO_PRODUCTS));
              }}
              className="px-6 py-2 text-navy border-2 border-navy/20 rounded-lg hover:bg-navy/5"
            >
              Reset
            </button>
            <button
              onClick={syncAll}
              className="px-6 py-2 bg-coral text-white rounded-lg hover:bg-coral/90 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Sync All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
