import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductColor, Currency } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedSize: string, selectedColor: ProductColor, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  totalItems: number;
  subtotalPKR: number;
  discountPKR: number;
  shippingFeePKR: number;
  totalPKR: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  appliedPromo: string | null;
  promoError: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  freeShippingThresholdPKR: number;
  remainingForFreeShippingPKR: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'riva_streetwear_demo_cart_v1';
const FREE_SHIPPING_THRESHOLD_PKR = 7500;
const STANDARD_SHIPPING_PKR = 250;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>('PKR');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Unable to persist cart in localStorage:', e);
    }
  }, [cart]);

  const addToCart = (product: Product, selectedSize: string, selectedColor: ProductColor, quantity: number = 1) => {
    const itemId = `${product.id}-${selectedSize}-${selectedColor.code}`;
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: Math.min(product.stockQuantity, next[existingIndex].quantity + quantity),
        };
        return next;
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          selectedSize,
          selectedColor,
          quantity: Math.min(product.stockQuantity, Math.max(1, quantity)),
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const maxStock = item.product.stockQuantity || 99;
          return { ...item, quantity: Math.min(maxStock, newQuantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'STANDOUT10') {
      setAppliedPromo('STANDOUT10');
      setPromoError(null);
      return true;
    } else {
      setPromoError('Invalid coupon code. Try STANDOUT10 for 10% demo discount.');
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPKR = cart.reduce((sum, item) => sum + item.product.pricePKR * item.quantity, 0);

  const discountPKR = appliedPromo === 'STANDOUT10' ? Math.round(subtotalPKR * 0.1) : 0;
  const shippingFeePKR = subtotalPKR === 0 || subtotalPKR >= FREE_SHIPPING_THRESHOLD_PKR ? 0 : STANDARD_SHIPPING_PKR;
  const totalPKR = Math.max(0, subtotalPKR - discountPKR + shippingFeePKR);

  const remainingForFreeShippingPKR = Math.max(0, FREE_SHIPPING_THRESHOLD_PKR - subtotalPKR);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        currency,
        setCurrency,
        totalItems,
        subtotalPKR,
        discountPKR,
        shippingFeePKR,
        totalPKR,
        promoCode,
        setPromoCode,
        appliedPromo,
        promoError,
        applyPromoCode,
        removePromoCode,
        freeShippingThresholdPKR: FREE_SHIPPING_THRESHOLD_PKR,
        remainingForFreeShippingPKR,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
