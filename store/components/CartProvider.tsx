"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/lib/types";

const KEY = "csh-cart-v1";
const lineKey = (l: Pick<CartLine, "productId" | "orderType">) =>
  `${l.productId}:${l.orderType}`;

interface CartContextValue {
  items: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  addItem: (line: CartLine) => void;
  updateQty: (productId: string, orderType: CartLine["orderType"], qty: number) => void;
  removeItem: (productId: string, orderType: CartLine["orderType"]) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (line: CartLine) =>
      setItems((prev) => {
        const idx = prev.findIndex((p) => lineKey(p) === lineKey(line));
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + line.qty };
          return next;
        }
        return [...prev, line];
      });

    const updateQty = (
      productId: string,
      orderType: CartLine["orderType"],
      qty: number,
    ) =>
      setItems((prev) =>
        prev
          .map((p) =>
            lineKey(p) === lineKey({ productId, orderType })
              ? { ...p, qty: Math.max(1, qty) }
              : p,
          )
          .filter((p) => p.qty > 0),
      );

    const removeItem = (productId: string, orderType: CartLine["orderType"]) =>
      setItems((prev) =>
        prev.filter((p) => lineKey(p) !== lineKey({ productId, orderType })),
      );

    const clear = () => setItems([]);

    const count = items.reduce((s, l) => s + l.qty, 0);
    const subtotal = items.reduce((s, l) => s + l.price * l.qty, 0);

    return { items, count, subtotal, ready, addItem, updateQty, removeItem, clear };
  }, [items, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
