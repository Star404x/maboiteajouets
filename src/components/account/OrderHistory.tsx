/**
 * OrderHistory - Display user's orders
 */

'use client';

import Link from 'next/link';
import { useUserOrders } from '@/hooks/useUserOrders';
import { formatPrice } from '@/lib/utils';

export function OrderHistory() {
  const { orders, loading, error } = useUserOrders();

  if (loading) {
    return <div className="text-center py-8">Chargement de vos commandes...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-lg">
        Erreur: {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-600 mb-4">Vous n'avez pas encore passé de commande</p>
        <Link
          href="/boutique"
          className="inline-block px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy/90"
        >
          Découvrir notre boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Link key={order.id} href={`/compte/commandes/${order.id}`}>
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">Numéro de commande</p>
                <p className="font-mono text-navy">{order.id}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.status === 'completed' && 'Livrée'}
                {order.status === 'pending' && 'En attente'}
                {order.status === 'failed' && 'Échouée'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-600 uppercase">Date</p>
                <p className="text-sm font-semibold">
                  {new Date(order.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase">Articles</p>
                <p className="text-sm font-semibold">{order.items?.length || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase">Total</p>
                <p className="text-sm font-semibold">{formatPrice(order.total_amount)}</p>
              </div>
              {order.tracking_number && (
                <div>
                  <p className="text-xs text-gray-600 uppercase">Suivi</p>
                  <p className="text-sm font-mono">{order.tracking_number}</p>
                </div>
              )}
            </div>

            <div className="text-sm text-navy hover:underline">
              Voir les détails →
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
