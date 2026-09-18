"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type WishlistContextValue = {
  productIds: string[];
  count: number;
  isWishlisted: (productId: string) => boolean;
  toggleItem: (productId: string) => void;
  removeItem: (productId: string) => void;
};

const STORAGE_KEY = "holovista-wishlist";
const WishlistContext = createContext<WishlistContextValue | null>(null);

function readStoredWishlist(value: string | null) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as unknown;

    if (Array.isArray(parsed)) {
      return [...new Set(parsed.filter((item): item is string => typeof item === "string" && item.length > 0))];
    }

    // Preserve the single-item format used by the previous product-page toggle.
    if (typeof parsed === "string" && parsed.length > 0) return [parsed];
  } catch {
    if (value.length > 0) return [value];
  }

  return [];
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      setProductIds(readStoredWishlist(window.localStorage.getItem(STORAGE_KEY)));
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
    }
  }, [hydrated, productIds]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      productIds,
      count: productIds.length,
      isWishlisted: (productId) => productIds.includes(productId),
      toggleItem: (productId) => {
        setProductIds((current) =>
          current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
        );
      },
      removeItem: (productId) => {
        setProductIds((current) => current.filter((id) => id !== productId));
      },
    }),
    [productIds],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider.");
  }

  return context;
}
