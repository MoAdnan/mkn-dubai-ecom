"use client";

import * as React from "react";

export interface CartItem {
  id: string; // unique item key e.g. variantId or productId
  productId: string;
  variantId?: string;
  title: string;
  variantName?: string;
  priceFils: number; // Stored in integer fils (e.g. 199900 fils = 1,999.00 AED)
  image: string;
  quantity: number;
  maxStock: number;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalCount: number;
  subtotalFils: number;
  vatFils: number; // 5% UAE VAT included or calculated
  totalFils: number;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "mkn_dubai_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage
  React.useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to persist cart", e);
    }
  }, [items, isHydrated]);

  const addItem = React.useCallback(
    (newItem: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === newItem.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = Math.min(
            updated[existingIndex].quantity + quantity,
            updated[existingIndex].maxStock || 99
          );
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
          };
          return updated;
        }
        return [...prev, { ...newItem, quantity: Math.min(quantity, newItem.maxStock || 99) }];
      });
      setIsCartOpen(true);
    },
    []
  );

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = React.useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(quantity, item.maxStock || 99) }
          : item
      )
    );
  }, []);

  const clearCart = React.useCallback(() => {
    setItems([]);
  }, []);

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Subtotal in fils
  const subtotalFils = items.reduce(
    (acc, item) => acc + item.priceFils * item.quantity,
    0
  );

  // UAE VAT 5%: When prices are tax-inclusive (retail requirement in UAE),
  // VAT = subtotal - (subtotal / 1.05)
  // When tax-exclusive: VAT = round(subtotal * 0.05).
  // Here we use standard UAE retail pricing (prices displayed are inclusive of 5% VAT)
  const vatFils = Math.round(subtotalFils - subtotalFils / 1.05);
  const totalFils = subtotalFils;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalCount,
        subtotalFils,
        vatFils,
        totalFils,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

