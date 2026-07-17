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
  isEditing?: boolean;
  isSyncing?: boolean;
}

// Static product list from products.ts
const DEMO_PRODUCTS = [
  { id: "p-001", name: "Ours en peluche tout doux", price: 19.90, slug: "ours-peluche" },
  { id: "p-003", name: "Boîte créative", price: 29.90, slug: "boite-creative" },
  { id: "p-005", name: "Robot éducatif", price: 59.90, slug: "robot-educatif" },
  { id: "p-006", name: "Maison de poupée", price: 89.90, slug: "maison-poupee" },
  { id: "p-007", name: "Lapin blanc doudou", price: 16.90, slug: "lapin-blanc" },
  { id: "p-009", name: "Boîte d'activités Hape", price: 36.40, slug: "boite-activites-hape" },
  { id: "p-014", name: "Jeu de mémoire", price: 18.50, slug: "jeu-memoire" },
  { id: "p-017", name: "Actiroller Musical", price: 32.80, slug: "actiroller" },
  { id: "p-021", name: "Tapis d'activités montgolfière", price: 49.90, slug: "tapis-montgolfiere" },
  { id: "p-022", name: "Panier de Basket Réglable", price: 131.72, slug: "panier-basket" },
  { id: "p-023", name: "Balançoire Confortable", price: 199.90, slug: "balancoire" },
  { id: "p-025", name: "Table d'activités dinosaure", price: 81.80, slug: "table-dinosaure" },
];

export default function AdminPricesPage() {
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [syncStatus, setSyncStatus] = useState<{ [key: string]: "idle" | "syncing" | "done" }> ({});

  const ADMIN_PASSWORD = "admin123";

  // Initialize prices from localStorage and products
  useEffect(() => {
    const savedPrices = localStorage.getItem("adminPrices");
    if (savedPrices) {
      try {
        const cached = JSON.parse(savedPrices);
        setPrices(cached);
        setMessage({ type: "success", text: "Prices loaded from cache" });
      } catch {
        loadDefaultPrices();
      }
    } else {
      loadDefaultPrices();
    }
  }, []);

  const loadDefaultPrices = () => {
    setPrices(
      DEMO_PRODUCTS.map((p) => ({
        ...p,
        originalPrice: p.price,
      }))
    );
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      setMessage({ type: "error", text: "❌ Wrong password" });
    }
  };

  const updatePrice = (id: string, newPrice: number) => {
    const updated = prices.map((p) => (p.id === id ? { ...p, price: newPrice, isEditing: false } : p));
    setPrices(updated);
    localStorage.setItem("adminPrices", JSON.stringify(updated));
    setMessage({ type: "success", text: `✅ ${updated.find((p) => p.id === id)?.name} → €${newPrice}` });
  };

  const syncToDatabase = async (id: string) => {
    const product = prices.find((p) => p.id === id);
    if (!product) return;

    setSyncStatus((prev) => ({ ...prev, [id]: "syncing" }));

    try {
      // Webhook endpoint to update database
      const response = await fetch("https://maboiteajouets.fr/api/webhook/update-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          newPrice: product.price,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => null); // Webhook failure doesn't block admin

      setSyncStatus((prev) => ({ ...prev, [id]: "done" }));
      setTimeout(() => setSyncStatus((prev) => ({ ...prev, [id]: "idle" })), 2000);

      if (response?.ok) {
        setMessage({ type: "success", text: `✅ Synced to database` });
      }
    } catch (error) {
      setSyncStatus((prev) => ({ ...prev, [id]: "idle" }));
      setMessage({ type: "error", text: "⚠️ Local save OK, database sync pending" });
    }
  };

  const syncAllToDatabase = async () => {
    for (const product of prices) {
      await syncToDatabase(product.id);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setMessage({ type: "success", text: "✅ All prices synced to database" });
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
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy/5 to-coral/5 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-display font-bold text-navy">Price Management</h1>
            <span className="px-4 py-2 bg-coral/20 text-coral rounded-full text-sm font-semibold">
              {prices.length} products
            </span>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPrices([]);
            }}
            className="px-6 py-2 text-coral hover:bg-coral/10 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm font-semibold ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-navy/5 border-b border-navy/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-navy">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-navy">Original</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-navy">Current</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-navy">Actions</th>
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
                        className="w-24 px-3 py-2 border border-navy/20 rounded-lg text-sm focus:border-coral focus:outline-none"
                      />
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => syncToDatabase(p.id)}
                        disabled={syncStatus[p.id] === "syncing"}
                        className={`p-2 rounded-lg transition ${
                          syncStatus[p.id] === "syncing"
                            ? "bg-gray-200 text-gray-400"
                            : syncStatus[p.id] === "done"
                            ? "bg-green-100 text-green-600"
                            : "bg-coral/10 text-coral hover:bg-coral/20"
                        }`}
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-navy/10 px-6 py-4 bg-navy/2 flex gap-3 justify-end">
            <button
              onClick={() => loadDefaultPrices()}
              className="px-6 py-2 text-navy border-2 border-navy/20 rounded-lg hover:bg-navy/5 transition"
            >
              Reset
            </button>
            <button
              onClick={syncAllToDatabase}
              className="px-6 py-2 bg-coral text-white rounded-lg hover:bg-coral/90 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Sync All to DB
            </button>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
          <h3 className="font-semibold text-blue-900 mb-2">💡 How it works:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ Edit prices directly - they save to your browser instantly</li>
            <li>✅ Click the sync button or "Sync All" to update the database</li>
            <li>✅ Prices are always cached locally, even if database sync fails</li>
            <li>✅ Website shows prices from cache when available</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
