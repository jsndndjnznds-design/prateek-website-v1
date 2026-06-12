"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartItem } from "@/types";
import { getCartCount, getCartSubtotal } from "@/lib/utils";

type CartContextValue = {
  items: CartItem[];
  subtotal: number;
  count: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setItems: Dispatch<SetStateAction<CartItem[]>>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("holovista-cart");
      if (stored) {
        setItems(JSON.parse(stored) as CartItem[]);
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem("holovista-cart", JSON.stringify(items));
    }
  }, [hydrated, items]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (item: CartItem) => {
      setItems((current) => {
        const existing = current.find((cartItem) => cartItem.productId === item.productId);
        if (!existing) return [...current, item];

        return current.map((cartItem) =>
          cartItem.productId === item.productId
            ? {
                ...cartItem,
                quantity: Math.min(cartItem.quantity + item.quantity, 9),
              }
            : cartItem,
        );
      });
    };

    const updateQuantity = (productId: string, quantity: number) => {
      setItems((current) =>
        current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, Math.min(quantity, 9)) }
            : item,
        ),
      );
    };

    const removeItem = (productId: string) => {
      setItems((current) => current.filter((item) => item.productId !== productId));
    };

    return {
      items,
      subtotal: getCartSubtotal(items),
      count: getCartCount(items),
      addItem,
      updateQuantity,
      removeItem,
      clearCart: () => setItems([]),
      setItems,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
