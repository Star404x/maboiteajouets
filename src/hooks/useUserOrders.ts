/**
 * useUserOrders - Get user's order history
 */

import { useEffect, useState } from "react";

export interface OrderItemType {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderType {
  id: string;
  customer_email: string;
  customer_name: string | null;
  status: string;
  total_amount: number;
  currency: string;
  tracking_number?: string;
  items: OrderItemType[];
  created_at: string;
  updated_at: string;
}

export function useUserOrders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("auth_token");
      if (!token) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/user/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders };
}
