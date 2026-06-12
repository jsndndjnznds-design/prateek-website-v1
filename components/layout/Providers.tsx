"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/components/cart/CartProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
