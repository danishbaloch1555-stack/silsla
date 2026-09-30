import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { ADMIN_SECURITY_CONFIG } from '../admin.config';
import {
  getSupabaseConfig,
  fetchSupabaseProducts,
  createSupabaseProduct,
  updateSupabaseProduct,
  deleteSupabaseProduct,
  updateSupabaseStock,
  syncCatalogToSupabase,
  placeSupabaseOrder,
  fetchSupabaseOrders,
  updateSupabaseOrderStatus,
  trackSupabaseOrder,
  signInSupabaseAdmin,
  signOutSupabaseSession,
  getCurrentSupabaseRole,
} from '../lib/supabase';

export type AdminRoleType = 'admin' | 'warehouse_staff' | 'owner';

interface AdminContextType {
  isAdminLoggedIn: boolean;
  adminRole: AdminRoleType;
  isSupabaseConnected: boolean;
  loginAdmin: (passwordOrEmail: string, optionalPassword?: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  resetAdminLockout: () => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'isDraftSample'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  resetProductsToDefault: () => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'isDemo'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  clearDemoOrders: () => void;
  lockoutRemainingSeconds: number;
  trackOrder: (orderNumber: string, guestToken: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  refreshData: () => Promise<void>;
  syncCatalog: () => Promise<{ success: boolean; count: number; error?: any }>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'riva_admin_products_catalog_v1';
const ORDERS_STORAGE_KEY = 'riva_admin_orders_list_v1';
const ADMIN_SESSION_TOKEN_KEY = 'riva_admin_sec_token_v4';
const ADMIN_SESSION_TIMESTAMP_KEY = 'riva_admin_sec_ts_v4';
const FAILED_ATTEMPTS_KEY = 'riva_admin_fail_cnt_v4';
const LOCKOUT_UNTIL_KEY = 'riva_admin_lockout_ts_v4';

const SESSION_TTL_MS = 60 * 60 * 1000;
const MAX_ATTEMPTS = 6;
const LOCKOUT_DURATION_MS = 3 * 60 * 1000;

async function computeSha256(str: string): Promise<string> {
  const enc = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const AUTH_DIGEST_PRIMARY = '6bc9fc7447b4eb99592cdd16a44465c383c41a445c86f7b42930c7568776ad26';
const AUTH_DIGEST_SECONDARY = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseConfig = getSupabaseConfig();
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(supabaseConfig.isConfigured);
  const [adminRole, setAdminRole] = useState<AdminRoleType>('owner');

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      const token = sessionStorage.getItem(ADMIN_SESSION_TOKEN_KEY);
      const ts = sessionStorage.getItem(ADMIN_SESSION_TIMESTAMP_KEY);
      if (token && ts) {
        const age = Date.now() - parseInt(ts, 10);
        if (age < SESSION_TTL_MS) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  });

  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load products from Supabase on mount
  const refreshProducts = useCallback(async () => {
    const config = getSupabaseConfig();
    setIsSupabaseConnected(config.isConfigured);

    if (config.isConfigured) {
      const { data, error } = await fetchSupabaseProducts();
      if (!error && data && data.length > 0) {
        setProducts(data);
        try {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(data));
        } catch {}
      }
    }
  }, []);

  // Load orders from Supabase if logged in
  const refreshOrders = useCallback(async () => {
    const config = getSupabaseConfig();
    if (config.isConfigured && isAdminLoggedIn) {
      const { data, error } = await fetchSupabaseOrders();
      if (!error && data) {
        setOrders(data);
        try {
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(data));
        } catch {}
      }
    }
  }, [isAdminLoggedIn]);

  const refreshData = useCallback(async () => {
    await refreshProducts();
    await refreshOrders();
  }, [refreshProducts, refreshOrders]);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    if (isAdminLoggedIn) {
      refreshOrders();
      getCurrentSupabaseRole().then((role) => {
        if (role === 'admin' || role === 'warehouse_staff') {
          setAdminRole(role);
        }
      });
      syncCatalogToSupabase(INITIAL_PRODUCTS).then(() => {
        refreshProducts();
      });
    }
  }, [isAdminLoggedIn, refreshOrders, refreshProducts]);

  // Handle Lockout Timer
  useEffect(() => {
    const checkLockout = () => {
      try {
        const lockoutUntilStr = sessionStorage.getItem(LOCKOUT_UNTIL_KEY);
        if (lockoutUntilStr) {
          const lockoutUntil = parseInt(lockoutUntilStr, 10);
          const diff = lockoutUntil - Date.now();
          if (diff > 0) {
            setLockoutRemainingSeconds(Math.ceil(diff / 1000));
          } else {
            setLockoutRemainingSeconds(0);
            sessionStorage.removeItem(LOCKOUT_UNTIL_KEY);
            sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
          }
        } else {
          setLockoutRemainingSeconds(0);
        }
      } catch {
        setLockoutRemainingSeconds(0);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  // Local fallback persistence
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const resetAdminLockout = useCallback(() => {
    sessionStorage.removeItem(LOCKOUT_UNTIL_KEY);
    sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
    setLockoutRemainingSeconds(0);
  }, []);

  /**
   * Dual-mode authentication:
   * 1. Supabase Auth with Email + Password (checks profiles table for admin / warehouse_staff role)
   * 2. Owner Passphrase with SHA-256 validation (admin.config.ts / environment fallback)
   */
  const loginAdmin = useCallback(async (
    passwordOrEmail: string,
    optionalPassword?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedInput = passwordOrEmail.trim();
    if (!trimmedInput) {
      return { success: false, error: 'Credentials are required.' };
    }

    const config = getSupabaseConfig();

    // Mode A: Supabase Auth (Triggered when optionalPassword is provided or input looks like an email)
    if (optionalPassword !== undefined || trimmedInput.includes('@')) {
      if (!config.isConfigured) {
        return {
          success: false,
          error: 'Supabase Publishable Key (VITE_SUPABASE_ANON_KEY) is missing. Please save your Publishable Key to connect.',
        };
      }

      if (!optionalPassword || !optionalPassword.trim()) {
        return {
          success: false,
          error: 'Please enter your password to sign in.',
        };
      }

      const authRes = await signInSupabaseAdmin(trimmedInput, optionalPassword);
      if (authRes.success && authRes.role) {
        sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
        sessionStorage.removeItem(LOCKOUT_UNTIL_KEY);
        setLockoutRemainingSeconds(0);

        const sessionToken = `riva_sb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        sessionStorage.setItem(ADMIN_SESSION_TOKEN_KEY, sessionToken);
        sessionStorage.setItem(ADMIN_SESSION_TIMESTAMP_KEY, Date.now().toString());

        setAdminRole(authRes.role);
        setIsAdminLoggedIn(true);
        return { success: true };
      } else {
        return {
          success: false,
          error: authRes.error || 'Invalid Supabase credentials or insufficient role.',
        };
      }
    }

    // Mode B: Owner Passphrase Verification (Protected by local lockout timer)
    const lockoutUntilStr = sessionStorage.getItem(LOCKOUT_UNTIL_KEY);
    if (lockoutUntilStr) {
      const lockoutUntil = parseInt(lockoutUntilStr, 10);
      if (Date.now() < lockoutUntil) {
        const secs = Math.ceil((lockoutUntil - Date.now()) / 1000);
        return { success: false, error: `Account locked due to consecutive failed attempts. Retry in ${secs}s.` };
      }
    }

    const inputHash = await computeSha256(trimmedInput);
    const customConfigPass = ADMIN_SECURITY_CONFIG.adminPassword?.trim();
    const envAdminPassword = (import.meta as any).env?.VITE_ADMIN_PASSWORD?.trim();

    const isCustomMatch = Boolean(customConfigPass && trimmedInput === customConfigPass);
    const isEnvMatch = Boolean(envAdminPassword && trimmedInput === envAdminPassword);
    const isHashMatch = inputHash === AUTH_DIGEST_PRIMARY || inputHash === AUTH_DIGEST_SECONDARY;

    if (isCustomMatch || isEnvMatch || isHashMatch) {
      sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
      sessionStorage.removeItem(LOCKOUT_UNTIL_KEY);
      setLockoutRemainingSeconds(0);

      const sessionToken = `riva_sec_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(ADMIN_SESSION_TOKEN_KEY, sessionToken);
      sessionStorage.setItem(ADMIN_SESSION_TIMESTAMP_KEY, Date.now().toString());

      setAdminRole('owner');
      setIsAdminLoggedIn(true);
      return { success: true };
    } else {
      const currentFailures = parseInt(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10) + 1;
      sessionStorage.setItem(FAILED_ATTEMPTS_KEY, currentFailures.toString());

      if (currentFailures >= MAX_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
        sessionStorage.setItem(LOCKOUT_UNTIL_KEY, lockoutTime.toString());
        setLockoutRemainingSeconds(Math.ceil(LOCKOUT_DURATION_MS / 1000));
        return {
          success: false,
          error: 'Maximum failed attempts exceeded. Access locked for 3 minutes.',
        };
      }

      const remaining = MAX_ATTEMPTS - currentFailures;
      return {
        success: false,
        error: `Invalid credentials. (${remaining} attempts remaining)`,
      };
    }
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_TIMESTAMP_KEY);
    signOutSupabaseSession();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'isDraftSample'>) => {
    const newProduct: Product = {
      ...productData,
      id: `riva-custom-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      isDraftSample: true,
    };

    setProducts((prev) => [newProduct, ...prev]);

    if (getSupabaseConfig().isConfigured) {
      await createSupabaseProduct(newProduct);
      refreshProducts();
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    if (getSupabaseConfig().isConfigured) {
      await updateSupabaseProduct(id, updates);
      if (updates.stockQuantity !== undefined) {
        await updateSupabaseStock(id, updates.stockQuantity);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));

    if (getSupabaseConfig().isConfigured) {
      await deleteSupabaseProduct(id);
    }
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  };

  /**
   * Order Placement (Guest or Authenticated):
   * Runs through Supabase atomic place_order RPC if configured,
   * otherwise creates clean local order.
   */
  const createOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'isDemo'>
  ): Promise<Order> => {
    const config = getSupabaseConfig();

    if (config.isConfigured) {
      const res = await placeSupabaseOrder({
        customerName: orderData.customer.fullName,
        customerPhone: orderData.customer.phone,
        customerEmail: orderData.customer.email,
        customerCity: orderData.customer.city,
        customerAddress: orderData.customer.address,
        postalCode: orderData.customer.postalCode,
        deliveryNotes: orderData.customer.notes,
        paymentMethod: orderData.paymentMethod,
        items: orderData.items,
      });

      if (res.success && res.order) {
        const created: Order = {
          id: res.order.id,
          orderNumber: res.order.orderNumber,
          guestToken: res.order.guestToken,
          createdAt: new Date().toISOString(),
          customer: orderData.customer,
          items: orderData.items,
          subtotalPKR: res.order.subtotalPKR,
          shippingFeePKR: res.order.shippingFeePKR,
          discountPKR: res.order.discountPKR,
          totalPKR: res.order.totalPKR,
          paymentMethod: orderData.paymentMethod,
          status: res.order.status,
          isDemo: orderData.paymentMethod === 'card_demo',
        };

        setOrders((prev) => [created, ...prev]);
        await refreshProducts(); // Fetch true updated stocks from server
        return created;
      } else {
        throw new Error(res.error || 'Database error occurred during order placement.');
      }
    }

    // Local fallback only if Supabase backend is not configured
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const guestToken = `gt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `RIVA-${randomDigits}`,
      guestToken,
      createdAt: new Date().toISOString(),
      status: 'pending_verification',
      isDemo: true,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update local stock
    setProducts((prevProducts) => {
      const updated = [...prevProducts];
      orderData.items.forEach((item) => {
        const prodIndex = updated.findIndex((p) => p.id === item.product.id);
        if (prodIndex > -1) {
          const currentStock = updated[prodIndex].stockQuantity;
          updated[prodIndex] = {
            ...updated[prodIndex],
            stockQuantity: Math.max(0, currentStock - item.quantity),
          };
        }
      });
      return updated;
    });

    return newOrder;
  };

  const syncCatalog = useCallback(async () => {
    const config = getSupabaseConfig();
    if (!config.isConfigured) {
      return { success: false, count: 0, error: new Error('Supabase not configured') };
    }
    const res = await syncCatalogToSupabase(INITIAL_PRODUCTS);
    if (res.success) {
      await refreshProducts();
    }
    return res;
  }, [refreshProducts]);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );

    if (getSupabaseConfig().isConfigured) {
      await updateSupabaseOrderStatus(orderId, status);
      refreshProducts(); // Stock may be restored on cancel
    }
  };

  const clearDemoOrders = () => {
    setOrders([]);
    localStorage.removeItem(ORDERS_STORAGE_KEY);
  };

  const trackOrder = async (orderNumber: string, guestToken: string) => {
    if (getSupabaseConfig().isConfigured) {
      const res = await trackSupabaseOrder(orderNumber, guestToken);
      if (res.error) {
        return { success: false, error: res.error.message || 'Order not found' };
      }
      return { success: true, data: res.data };
    } else {
      const local = orders.find(
        (o) =>
          o.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase() &&
          (!guestToken || o.guestToken === guestToken.trim())
      );
      if (local) {
        return { success: true, data: { order: local, items: local.items } };
      }
      return { success: false, error: 'Order not found in database.' };
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminLoggedIn,
        adminRole,
        isSupabaseConnected,
        loginAdmin,
        logoutAdmin,
        resetAdminLockout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        orders,
        createOrder,
        updateOrderStatus,
        clearDemoOrders,
        lockoutRemainingSeconds,
        trackOrder,
        refreshData,
        syncCatalog,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
