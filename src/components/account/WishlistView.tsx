/**
 * WishlistView - Display user's wishlist
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface WishlistItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  slug: string;
  added_at: string;
}

export function WishlistView() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/user/wishlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`/api/user/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchWishlist();
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-800 p-4 rounded-lg">{error}</div>;
  }

  if (wishlist.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-600 mb-4">Votre liste de souhaits est vide</p>
        <Link
          href="/boutique"
          className="inline-block px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy/90"
        >
          Découvrir nos produits
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {wishlist.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <Link href={`/produit/${item.slug}`}>
            <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
              {item.images?.[0] ? (
                typeof item.images[0] === 'string' && item.images[0].startsWith('/') ? (
                  <img src={item.images[0]} alt={item.product_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">{item.images[0]}</span>
                )
              ) : (
                <span className="text-4xl">🎁</span>
              )}
            </div>
          </Link>

          <div className="p-4">
            <Link href={`/produit/${item.slug}`}>
              <h3 className="font-semibold text-navy hover:text-coral transition-colors line-clamp-2">
                {item.product_name}
              </h3>
            </Link>

            <div className="flex items-center justify-between mt-2 mb-3">
              <span className="text-sm text-gray-600">⭐ {item.rating.toFixed(1)} ({item.reviewCount})</span>
              <span className="font-semibold text-navy">{formatPrice(item.price)}</span>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/produit/${item.slug}`}
                className="flex-1 px-3 py-2 bg-navy text-white text-sm rounded hover:bg-navy/90 text-center"
              >
                Voir
              </Link>
              <button
                onClick={() => handleRemove(item.product_id)}
                className="px-3 py-2 border border-red-300 text-red-600 text-sm rounded hover:bg-red-50"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
