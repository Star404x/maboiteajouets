import { useEffect, useState } from 'react';

interface CachedPrice {
  [productId: string]: number;
}

/**
 * Hook для получения актуальных цен
 * Сначала смотрит в localStorage (админ-панель)
 * Потом берет из props/static data
 */
export function usePriceCache(basePrice: number, productId: string): number {
  const [cachedPrice, setCachedPrice] = useState<number>(basePrice);

  useEffect(() => {
    try {
      const adminPrices = localStorage.getItem('adminPrices');
      if (adminPrices) {
        const prices = JSON.parse(adminPrices);
        const product = prices.find((p: any) => p.id === productId);
        if (product && product.price !== basePrice) {
          console.log(`[usePriceCache] Using cached price for ${productId}: €${product.price}`);
          setCachedPrice(product.price);
          return;
        }
      }
    } catch (error) {
      console.error('[usePriceCache] Error reading cache:', error);
    }

    setCachedPrice(basePrice);
  }, [basePrice, productId]);

  return cachedPrice;
}

/**
 * Получить ВСЕ кэшированные цены (для компонентов которые отображают много товаров)
 */
export function getAllCachedPrices(): CachedPrice {
  try {
    const adminPrices = localStorage.getItem('adminPrices');
    if (adminPrices) {
      const prices = JSON.parse(adminPrices);
      const result: CachedPrice = {};
      prices.forEach((p: any) => {
        result[p.id] = p.price;
      });
      return result;
    }
  } catch (error) {
    console.error('[getAllCachedPrices] Error:', error);
  }
  return {};
}
