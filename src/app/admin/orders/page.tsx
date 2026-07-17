"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw, Package, User, MapPin, CreditCard } from "lucide-react";

interface OrderItem {
  name: string;
  slug?: string;
  image?: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
}

interface Order {
  id: string;
  status: string;
  payment_status: string;
  total_cents: number;
  subtotal_cents: number;
  shipping_cents: number;
  currency: string;
  stripe_payment_intent_id: string | null;
  stripe_charge_id: string | null;
  created_at: string;
  paid_at: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  items: OrderItem[] | null;
}

function statusColor(status: string) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "canceled":
      return "bg-gray-100 text-gray-700";
    case "refunded":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetch("/.netlify/functions/admin-orders", { credentials: "include" })
      .then((r) => {
        if (r.status === 401) throw new Error("Non autorisé — rechargez la page pour vous connecter");
        if (!r.ok) throw new Error(`Erreur ${r.status}`);
        return r.json();
      })
      .then((data) => setOrders(data.orders || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const totalRevenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + o.total_cents, 0);

  const paidCount = orders.filter((o) => o.payment_status === "paid").length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy mb-1">Commandes</h1>
            <p className="text-navy/60 text-sm">
              {orders.length} commande{orders.length !== 1 ? "s" : ""} · {paidCount} payée{paidCount !== 1 ? "s" : ""} ·{" "}
              <span className="font-semibold text-green-700">
                {(totalRevenue / 100).toFixed(2)} €
              </span>{" "}
              encaissés
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={load}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-xl hover:bg-gray-50 text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
            <a
              href="/.netlify/functions/admin-orders?format=csv"
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-xl hover:bg-navy/90 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </a>
          </div>
        </div>

        {/* State */}
        {loading && (
          <div className="p-12 text-center text-navy/60">Chargement...</div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-6">
            <p className="font-semibold mb-1">Erreur</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-navy/5">
            <Package className="w-12 h-12 mx-auto text-navy/30 mb-3" />
            <p className="text-navy/60">Aucune commande pour le moment</p>
          </div>
        )}

        {/* Orders list */}
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="p-5 bg-white border border-navy/5 rounded-2xl shadow-sm"
            >
              {/* Top: id + status + total */}
              <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                <div>
                  <div className="font-mono text-xs text-navy/50 mb-0.5">{o.id}</div>
                  <div className="text-xs text-navy/60">
                    {new Date(o.created_at).toLocaleString("fr-FR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-navy">
                    {(o.total_cents / 100).toFixed(2)} €
                  </div>
                  <div className="flex gap-2 justify-end mt-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${statusColor(o.payment_status)}`}
                    >
                      💳 {o.payment_status}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${statusColor(o.status)}`}
                    >
                      📦 {o.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Customer */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-navy/50 uppercase mb-2">
                    <User className="w-3.5 h-3.5" />
                    Client
                  </div>
                  <div className="font-semibold text-navy">
                    {o.first_name} {o.last_name}
                  </div>
                  <div className="text-sm text-navy/70">
                    <a href={`mailto:${o.email}`} className="hover:underline">
                      {o.email}
                    </a>
                  </div>
                  {o.phone && (
                    <div className="text-sm text-navy/70">
                      <a href={`tel:${o.phone}`} className="hover:underline">
                        {o.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-navy/50 uppercase mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    Livraison
                  </div>
                  {o.line1 ? (
                    <>
                      <div className="text-sm text-navy">{o.line1}</div>
                      {o.line2 && <div className="text-sm text-navy">{o.line2}</div>}
                      <div className="text-sm text-navy">
                        {o.postal_code} {o.city} {o.country && `(${o.country})`}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-navy/40">Non renseignée</div>
                  )}
                </div>
              </div>

              {/* Items */}
              {o.items && o.items.length > 0 && (
                <div className="pt-3 border-t border-navy/5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-navy/50 uppercase mb-2">
                    <Package className="w-3.5 h-3.5" />
                    Articles
                  </div>
                  <div className="space-y-1">
                    {o.items.map((it, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-navy">
                          {it.name} <span className="text-navy/50">× {it.quantity}</span>
                        </span>
                        <span className="text-navy/70 font-mono text-xs">
                          {(it.line_total_cents / 100).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stripe info */}
              {o.stripe_payment_intent_id && (
                <div className="pt-3 mt-3 border-t border-navy/5 flex items-center gap-2 text-xs text-navy/50">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span className="font-mono">{o.stripe_payment_intent_id}</span>
                  <a
                    href={`https://dashboard.stripe.com/payments/${o.stripe_payment_intent_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy/70 hover:underline ml-1"
                  >
                    → Stripe
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
