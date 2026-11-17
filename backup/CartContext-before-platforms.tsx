"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type CartItems = Record<string, number>;

type CartContextType = {
  cart: CartItems;
  count: number;
  change: (id: string, delta: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "nexora-games-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItems>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const validCart: CartItems = {};

          for (const [id, quantity] of Object.entries(parsed)) {
            if (
              typeof quantity === "number" &&
              Number.isSafeInteger(quantity) &&
              quantity > 0 &&
              quantity <= 99
            ) {
              validCart[id] = quantity;
            }
          }

          setCart(validCart);
        }
      }
    } catch {
      console.warn("Não foi possível recuperar o carrinho.");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const change = useCallback((id: string, delta: number) => {
    setCart((current) => {
      const quantity = Math.max(
        0,
        Math.min(99, (current[id] || 0) + delta)
      );

      const updated = { ...current };

      if (quantity === 0) {
        delete updated[id];
      } else {
        updated[id] = quantity;
      }

      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({});
  }, []);

  const count = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0
  );

  return (
    <CartContext.Provider value={{ cart, count, change, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart precisa estar dentro de CartProvider");
  }

  return context;
}
