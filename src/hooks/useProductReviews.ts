"use client";

import { useEffect, useState } from "react";

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  avatarColor?: string;
  verified_purchase?: boolean;
  helpful_count?: number;
}

export interface ReviewStats {
  total: number;
  averageRating: number;
  distribution: {
    [key: number]: number;
  };
}

export interface ReviewsResponse {
  success: boolean;
  productId: string;
  reviews: Review[];
  stats: ReviewStats;
}

interface UseProductReviewsOptions {
  productId?: string;
  limit?: number;
  sortBy?: "recent" | "helpful" | "highest_rating" | "lowest_rating";
}

export function useProductReviews(options: UseProductReviewsOptions = {}) {
  const { productId, limit = 10, sortBy = "recent" } = options;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setReviews([]);
      setStats(null);
      return;
    }

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          productId,
          limit: limit.toString(),
          sortBy,
        });

        const response = await fetch(`/api/reviews?${params}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.statusText}`);
        }

        const data: ReviewsResponse = await response.json();

        if (data.success) {
          setReviews(data.reviews);
          setStats(data.stats);
        } else {
          throw new Error("API returned error");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("[REVIEWS HOOK ERROR]", message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, limit, sortBy]);

  return { reviews, stats, loading, error };
}
