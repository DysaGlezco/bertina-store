"use client";

import { createContext, useContext, useReducer, useCallback } from "react";
import type { CartItem } from "@/types";

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; index: number }
  | { type: "UPDATE_QUANTITY"; index: number; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "CLOSE_CART" };

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = { items: [], isOpen: false };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, isOpen: true, items: [...state.items, action.item] };
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((_, i) => i !== action.index) };
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((_, i) => i !== action.index) };
      }
      return {
        ...state,
        items: state.items.map((item, i) =>
          i === action.index ? { ...item, quantity: action.quantity } : item
        ),
      };
    }
    case "CLEAR_CART":  return { ...state, items: [] };
    case "TOGGLE_CART": return { ...state, isOpen: !state.isOpen };
    case "CLOSE_CART":  return { ...state, isOpen: false };
    default:            return state;
  }
}

interface CartContextValue extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPriceUSD: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem        = useCallback((item: CartItem) => dispatch({ type: "ADD_ITEM", item }), []);
  const removeItem     = useCallback((index: number) => dispatch({ type: "REMOVE_ITEM", index }), []);
  const updateQuantity = useCallback((index: number, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", index, quantity }), []);
  const clearCart      = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const toggleCart     = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);
  const closeCart      = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);

  const totalItems    = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPriceUSD = state.items.reduce((s, i) => s + i.priceUSD * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ ...state, addItem, removeItem, updateQuantity, clearCart, toggleCart, closeCart, totalItems, totalPriceUSD }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
