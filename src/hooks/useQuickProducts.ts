import { useState, useEffect } from 'react';

const STORAGE_KEY = 'pos_quick_products';
const MAX_QUICK_PRODUCTS = 12;

export function useQuickProducts() {
  const [quickProducts, setQuickProductsState] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setQuickProductsState(Array.isArray(parsed) ? parsed : []);
      } catch {
        setQuickProductsState([]);
      }
    }
  }, []);

  const setQuickProducts = (products: string[]) => {
    const limited = products.slice(0, MAX_QUICK_PRODUCTS);
    setQuickProductsState(limited);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  };

  return {
    quickProducts,
    setQuickProducts,
    maxQuickProducts: MAX_QUICK_PRODUCTS,
  };
}
