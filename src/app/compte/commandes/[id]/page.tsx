/**
 * /compte/commandes/[id] - Order details page
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/account/ProtectedRoute';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
}

interface Order {
  id: string;
  customer_email: string;
  customer_name: string | null;
  status: string;
  total_amount: number;
  currency: string;
  tracking_number?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const response = await fetch(`/api/user/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <ProtectedRoute>
      <div className="container-wide py-8 lg:py-14">
        <div className="max-w-3xl mx-auto">
          <a href="/compte/commandes" className="text-navy hover:underline mb-6 inline-block">
            ← Retour aux commandes
          </a>

          {loading && <div className="text-center py-8">Chargement...</div>}
          {error && <div className="bg-red-50 text-red-800 p-4 rounded-lg">{error}</div>}

          {order && (
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="font-display font-bold text-3xl text-navy mb-2">Commande #{order.id}</h1>
                    <p className="text-gray-600">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full font-semibold ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.status === 'completed' && 'Livrée'}
                    {order.status === 'pending' && 'En attente de paiement'}
                    {order.status === 'failed' && 'Échouée'}
                  </span>
                </div>

                {order.tracking_number && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Numéro de suivi</p>
                    <p className="font-mono text-lg font-semibold text-navy">{order.tracking_number}</p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div>
                <h2 className="font-display font-bold text-xl text-navy mb-4">Articles commandés</h2>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-navy">{item.product_name}</p>
                        <p className="text-sm text-gray-600">ID: {item.product_id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {item.quantity}x {formatPrice(item.price)}
                        </p>
                        <p className="font-semibold text-navy">{formatPrice(item.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-semibold">{formatPrice(order.total_amount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-semibold">Gratuite</span>
                  </div>
                  <div className="flex justify-between items-center text-lg border-t border-gray-200 pt-3">
                    <span className="font-semibold text-navy">Total</span>
                    <span className="font-display font-bold text-navy">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-3 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90">
                    Télécharger la facture
                  </button>
                  {order.status === 'completed' && (
                    <button className="flex-1 px-4 py-3 border border-navy text-navy rounded-lg font-semibold hover:bg-navy/5">
                      Retourner un article
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
