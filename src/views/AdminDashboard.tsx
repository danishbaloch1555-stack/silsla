import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Product, Order, OrderStatus, CollectionType, CategoryType } from '../types';
import { formatPrice } from '../utils/currency';
import { SUPABASE_SQL_SCHEMA, getSupabaseConfig, saveBrowserSupabaseKey, clearBrowserSupabaseKey } from '../lib/supabase';
import { 
  Shield, 
  Lock, 
  Package, 
  ShoppingBag, 
  Database, 
  Cloud, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Copy, 
  AlertCircle, 
  LogOut, 
  RefreshCcw,
  Sliders,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminDashboardProps {
  onReturnToStorefront?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onReturnToStorefront }) => {
  const { 
    isAdminLoggedIn, 
    adminRole,
    isSupabaseConnected,
    loginAdmin, 
    logoutAdmin, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    resetProductsToDefault,
    orders, 
    updateOrderStatus,
    clearDemoOrders,
    lockoutRemainingSeconds,
    resetAdminLockout,
    refreshData
  } = useAdmin();

  // Authentication State
  const [loginMode, setLoginMode] = useState<'supabase' | 'passphrase'>('supabase');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'supabase' | 'deployment'>('overview');

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form fields for product modal
  const [prodTitle, setProdTitle] = useState('');
  const [prodCollection, setProdCollection] = useState<CollectionType>('men');
  const [prodCategory, setProdCategory] = useState<CategoryType>('hoodies');
  const [prodCategoryLabel, setProdCategoryLabel] = useState('Hoodies');
  const [prodPrice, setProdPrice] = useState(8950);
  const [prodStock, setProdStock] = useState(15);
  const [prodGSM, setProdGSM] = useState(460);
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('');

  // Supabase copy feedback
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [customAnonKeyInput, setCustomAnonKeyInput] = useState('');
  const [showAnonKey, setShowAnonKey] = useState(false);
  const [keySavedFeedback, setKeySavedFeedback] = useState(false);

  const supabaseConfig = getSupabaseConfig();

  const handleSaveAnonKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAnonKeyInput.trim()) return;
    saveBrowserSupabaseKey(customAnonKeyInput.trim());
    setKeySavedFeedback(true);
    setCustomAnonKeyInput('');
    await refreshData();
    setTimeout(() => setKeySavedFeedback(false), 3000);
  };

  const handleClearAnonKey = async () => {
    clearBrowserSupabaseKey();
    await refreshData();
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemainingSeconds > 0) return;

    setIsVerifying(true);
    setAuthError(null);

    const res = loginMode === 'supabase'
      ? await loginAdmin(emailInput, passwordInput)
      : await loginAdmin(passwordInput);

    setIsVerifying(false);

    if (!res.success) {
      setAuthError(res.error || 'Authentication rejected.');
    } else {
      setPasswordInput('');
      setEmailInput('');
      setAuthError(null);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    logoutAdmin();
    if (onReturnToStorefront) {
      onReturnToStorefront();
    }
  };

  // Open modal for new product
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setProdTitle('');
    setProdCollection('men');
    setProdCategory('hoodies');
    setProdCategoryLabel('Hoodies');
    setProdPrice(6950);
    setProdStock(20);
    setProdGSM(400);
    setProdDescription('Heavyweight 100% Pakistani cotton streetwear staple.');
    setProdImage(products[0]?.images[0] || '');
    setIsProductModalOpen(true);
  };

  // Open modal for editing existing product
  const handleOpenEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setProdTitle(p.title);
    setProdCollection(p.collection);
    setProdCategory(p.category);
    setProdCategoryLabel(p.categoryLabel);
    setProdPrice(p.pricePKR);
    setProdStock(p.stockQuantity);
    setProdGSM(p.fabricDetails.gsm);
    setProdDescription(p.description);
    setProdImage(p.images[0] || '');
    setIsProductModalOpen(true);
  };

  // Save product (Add or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim()) return;

    if (editingProductId) {
      updateProduct(editingProductId, {
        title: prodTitle,
        collection: prodCollection,
        category: prodCategory,
        categoryLabel: prodCategoryLabel,
        pricePKR: Number(prodPrice),
        stockQuantity: Number(prodStock),
        fabricDetails: {
          gsm: Number(prodGSM),
          composition: '100% Combed Pakistani Cotton',
          weave: 'Heavy Cotton Weave',
          origin: 'Lahore, Pakistan',
        },
        description: prodDescription,
        images: prodImage ? [prodImage, products[0]?.images[1] || ''] : products[0]?.images || [],
      });
    } else {
      addProduct({
        slug: prodTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: prodTitle,
        collection: prodCollection,
        category: prodCategory,
        categoryLabel: prodCategoryLabel,
        pricePKR: Number(prodPrice),
        stockQuantity: Number(prodStock),
        fabricDetails: {
          gsm: Number(prodGSM),
          composition: '100% Combed Pakistani Cotton',
          weave: 'Heavy Cotton Weave',
          origin: 'Lahore, Pakistan',
        },
        features: [
          'Pre-shrunk cotton fabric',
          'Double-needle reinforced collar and seams',
          'Cut & sewn in Lahore, Pakistan',
        ],
        careInstructions: [
          'Machine wash cold (30°C) inside out',
          'Lay flat to dry',
        ],
        sizes: prodCollection === 'kids' ? ['4-5Y', '6-7Y', '8-9Y', '10-11Y'] : ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Onyx Black', hex: '#0B0B0D', code: 'black' },
          { name: 'Bone Beige', hex: '#E4DFD3', code: 'beige' },
        ],
        images: prodImage ? [prodImage] : [products[0]?.images[0] || ''],
        description: prodDescription,
        featured: false,
        isNewArrival: true,
      });
    }

    setIsProductModalOpen(false);
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2500);
  };

  // Metrics
  const totalRevenuePKR = orders.reduce((sum, o) => sum + o.totalPKR, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending_verification').length;
  const lowStockProducts = products.filter((p) => p.stockQuantity < 10);

  // ================= SECURE AUTHENTICATION GATE (NOT LOGGED IN) =================
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#121214] border border-[#222227] rounded-xl p-8 text-[#F5F2EB] shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-[#18181D] border border-[#2D2D35] rounded-xl text-[#F5F2EB]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-display uppercase tracking-widest text-[#F5F2EB]">
              Administrative Portal
            </h2>
            <p className="text-xs text-[#8B8A94]">
              Restricted area for authorized RIVA operations personnel & website owner.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 bg-[#18181D] border border-[#26262E] rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setLoginMode('supabase');
                setAuthError(null);
                resetAdminLockout();
              }}
              className={`flex-1 py-1.5 rounded transition-colors text-center ${
                loginMode === 'supabase'
                  ? 'bg-[#2A2A35] text-[#F5F2EB]'
                  : 'text-[#8B8A94] hover:text-[#F5F2EB]'
              }`}
            >
              Supabase Auth
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('passphrase'); setAuthError(null); }}
              className={`flex-1 py-1.5 rounded transition-colors text-center ${
                loginMode === 'passphrase'
                  ? 'bg-[#2A2A35] text-[#F5F2EB]'
                  : 'text-[#8B8A94] hover:text-[#F5F2EB]'
              }`}
            >
              Owner Passphrase
            </button>
          </div>

          {/* Quick Publishable Key helper if not configured */}
          {!supabaseConfig.isConfigured && loginMode === 'supabase' && (
            <div className="p-3.5 bg-amber-950/40 border border-amber-800/80 rounded-lg space-y-2.5 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
                <KeyRound className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Supabase Publishable Key Required</span>
              </div>
              <p className="text-[11px] text-[#8B8A94] leading-relaxed">
                To connect to <code className="text-[#F5F2EB] font-mono">nohmukmrxobjiveipfay.supabase.co</code>, enter your Supabase Publishable / Anon key below:
              </p>
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Paste VITE_SUPABASE_ANON_KEY (anon public)..."
                  value={customAnonKeyInput}
                  onChange={(e) => setCustomAnonKeyInput(e.target.value)}
                  className="w-full bg-[#111114] border border-[#2D2D35] rounded-md py-2 px-3 text-xs font-mono text-[#F5F2EB] focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleSaveAnonKey}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer"
                >
                  Save Key & Connect
                </button>
              </div>
            </div>
          )}

          {/* Lockout Notice (Passphrase mode only) */}
          {loginMode === 'passphrase' && lockoutRemainingSeconds > 0 && (
            <div className="p-3.5 bg-rose-950/50 border border-rose-900 rounded-lg text-rose-300 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>
                  Account locked. Retry in <strong>{lockoutRemainingSeconds}s</strong>.
                </span>
              </div>
              <button
                type="button"
                onClick={resetAdminLockout}
                className="px-2 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-[10px] font-mono rounded transition-colors uppercase tracking-wider shrink-0"
              >
                Reset Lockout
              </button>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {loginMode === 'supabase' ? (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-[#8B8A94] uppercase tracking-wider mb-1.5">
                    Staff Email
                  </label>
                  <input
                    type="email"
                    required
                    disabled={isVerifying}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@rivastreetwear.com"
                    className="w-full bg-[#18181D] border border-[#2D2D35] rounded-lg py-2.5 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB] disabled:opacity-50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#8B8A94] uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      disabled={isVerifying}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#18181D] border border-[#2D2D35] rounded-lg py-2.5 pl-3 pr-10 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB] disabled:opacity-50 transition-colors"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-[#8B8A94] hover:text-[#F5F2EB] p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-[11px] font-semibold text-[#8B8A94] uppercase tracking-wider mb-1.5">
                  Owner Passphrase
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={lockoutRemainingSeconds > 0 || isVerifying}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter administrator passphrase"
                    className="w-full bg-[#18181D] border border-[#2D2D35] rounded-lg py-2.5 pl-3 pr-10 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB] disabled:opacity-50 transition-colors"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-[#8B8A94] hover:text-[#F5F2EB] p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {authError && (
              <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{authError}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={lockoutRemainingSeconds > 0 || isVerifying}
              className="w-full py-2.5 px-4 bg-[#F5F2EB] text-[#0A0A0C] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white active:scale-[0.99] transition-all disabled:opacity-40 cursor-pointer shadow-md"
            >
              {isVerifying ? 'Verifying Authorization...' : 'Verify Access'}
            </button>
          </form>

          {onReturnToStorefront && (
            <div className="pt-2 text-center border-t border-[#1E1E24]">
              <button
                type="button"
                onClick={onReturnToStorefront}
                className="inline-flex items-center gap-1.5 text-xs text-[#8B8A94] hover:text-[#F5F2EB] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Storefront</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ================= LOGGED IN DASHBOARD =================
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 text-[#F5F2EB]">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#222227]">
        <div>
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#F5F2EB]" />
            <h1 className="text-2xl font-bold font-display uppercase tracking-wider">
              RIVA Administration & Ops
            </h1>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider font-semibold ${
              isSupabaseConnected
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-[#1C1C22] border-[#2D2D35] text-[#8B8A94]'
            }`}>
              {isSupabaseConnected ? 'Live Supabase' : 'Local Sandbox'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-[#18181D] border-[#26262E] text-amber-300 uppercase tracking-wider font-semibold">
              Role: {adminRole === 'warehouse_staff' ? 'Warehouse Staff' : adminRole === 'admin' ? 'Admin' : 'Owner'}
            </span>
          </div>
          <p className="text-xs text-[#8B8A94] mt-0.5">
            Storefront Operations · {isSupabaseConnected ? 'Connected to nohmukmrxobjiveipfay.supabase.co' : 'Awaiting publishable key in .env'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18181D] hover:bg-[#222227] border border-[#26262E] text-xs font-semibold text-[#F5F2EB] rounded-md transition-colors disabled:opacity-50"
            title="Fetch latest products and orders from database"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Database'}</span>
          </button>

          {onReturnToStorefront && (
            <button
              onClick={onReturnToStorefront}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18181D] hover:bg-[#222227] border border-[#26262E] text-xs font-semibold text-[#F5F2EB] rounded-md transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1F1F26] hover:bg-[#2A2A33] border border-[#2D2D35] text-xs font-semibold text-[#F5F2EB] rounded-md transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Strictly Zero-Pill) */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#222227] pb-2 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview', icon: Sliders },
          { id: 'products', label: `Products & Stock (${products.length})`, icon: Package },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'supabase', label: 'Supabase Architecture', icon: Database },
          { id: 'deployment', label: 'Free Hosting Guide', icon: Cloud },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[#222227] text-[#F5F2EB] font-bold border border-[#383844]'
                  : 'text-[#8B8A94] hover:text-[#F5F2EB] hover:bg-[#18181D]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[#151519] border border-[#222227] rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-[#8B8A94] uppercase tracking-wider">Demo Gross Revenue</span>
              <p className="text-2xl font-bold font-mono-nums text-[#F5F2EB]">{formatPrice(totalRevenuePKR, 'PKR')}</p>
              <span className="text-[11px] text-[#8B8A94]">Recorded across {orders.length} demo orders</span>
            </div>

            <div className="p-5 bg-[#151519] border border-[#222227] rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-[#8B8A94] uppercase tracking-wider">Pending COD Verification</span>
              <p className="text-2xl font-bold font-mono-nums text-amber-400">{pendingOrdersCount}</p>
              <span className="text-[11px] text-[#8B8A94]">Awaiting customer phone/WhatsApp confirm</span>
            </div>

            <div className="p-5 bg-[#151519] border border-[#222227] rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-[#8B8A94] uppercase tracking-wider">Active Catalog SKUs</span>
              <p className="text-2xl font-bold font-mono-nums text-[#F5F2EB]">{products.length}</p>
              <span className="text-[11px] text-[#8B8A94]">Men, Women & Kids Streetwear</span>
            </div>

            <div className="p-5 bg-[#151519] border border-[#222227] rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-[#8B8A94] uppercase tracking-wider">Low Stock SKUs</span>
              <p className="text-2xl font-bold font-mono-nums text-rose-400">{lowStockProducts.length}</p>
              <span className="text-[11px] text-[#8B8A94]">Items with &lt; 10 units in stock</span>
            </div>
          </div>

          {/* REAL VS DEMO MATRIX */}
          <div className="p-6 bg-[#151519] border border-[#222227] rounded-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222227]">
              <div>
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-[#F5F2EB]">
                  Operational Status Matrix: Real vs Demo Implementation
                </h3>
                <p className="text-xs text-[#8B8A94] mt-0.5">
                  Explicit audit of working functionality versus simulated demo interfaces.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#222227] text-[#8B8A94] uppercase text-[10px] font-mono tracking-wider">
                    <th className="py-2.5 px-3">Subsystem</th>
                    <th className="py-2.5 px-3">State</th>
                    <th className="py-2.5 px-3">Live Storage / Engine</th>
                    <th className="py-2.5 px-3">Next Step For Production</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F26] text-xs">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-[#F5F2EB]">Shopping Bag & Variants</td>
                    <td className="py-3 px-3 text-emerald-400 font-mono">REAL (Client State)</td>
                    <td className="py-3 px-3 text-[#8B8A94]">Browser localStorage (v1)</td>
                    <td className="py-3 px-3 text-[#8B8A94]">Already fully functional across pages</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-[#F5F2EB]">Catalog & Inventory</td>
                    <td className="py-3 px-3 text-emerald-400 font-mono">REAL (Editable)</td>
                    <td className="py-3 px-3 text-[#8B8A94]">AdminContext + localStorage</td>
                    <td className="py-3 px-3 text-[#8B8A94]">Connect to Supabase `products` table</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-[#F5F2EB]">Cash on Delivery (COD)</td>
                    <td className="py-3 px-3 text-amber-300 font-mono">DEMO LABELED</td>
                    <td className="py-3 px-3 text-[#8B8A94]">AdminContext Orders State</td>
                    <td className="py-3 px-3 text-[#8B8A94]">Connect Trax/TCS Courier API webhook</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-[#F5F2EB]">Card Payments</td>
                    <td className="py-3 px-3 text-amber-300 font-mono">DEMO SIMULATION</td>
                    <td className="py-3 px-3 text-[#8B8A94]">Simulated gateway feedback</td>
                    <td className="py-3 px-3 text-[#8B8A94]">Connect Stripe, PayFast, or Safepay PK</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-[#F5F2EB]">Supabase PostgreSQL & Auth</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono">ARCHITECTURE READY</td>
                    <td className="py-3 px-3 text-[#8B8A94]">Complete SQL Schema + RLS Script</td>
                    <td className="py-3 px-3 text-[#8B8A94]">Set VITE_SUPABASE_URL in `.env`</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PRODUCTS MANAGEMENT ================= */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-display uppercase tracking-wider text-[#F5F2EB]">
                Products & Inventory Control
              </h2>
              <p className="text-xs text-[#8B8A94]">
                Create, modify pricing in PKR, adjust inventory levels, or update sample descriptions.
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 py-2 px-3.5 bg-[#F5F2EB] text-[#0A0A0C] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          {/* Products List Table */}
          <div className="bg-[#151519] border border-[#222227] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#222227] text-[#8B8A94] uppercase text-[10px] font-mono tracking-wider bg-[#18181D]">
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Collection</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (PKR)</th>
                    <th className="py-3 px-4">Stock Qty</th>
                    <th className="py-3 px-4">Sample Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F26]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#18181D]/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            referrerPolicy="no-referrer"
                            className="w-10 h-12 object-cover rounded bg-[#1C1C22] border border-[#2D2D35] shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-[#F5F2EB] block">{p.title}</span>
                            <span className="text-[10px] font-mono text-[#8B8A94]">{p.fabricDetails.gsm} GSM Cotton</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize font-medium">{p.collection}</td>
                      <td className="py-3 px-4 text-[#8B8A94]">{p.categoryLabel}</td>
                      <td className="py-3 px-4 font-mono-nums font-semibold text-[#F5F2EB]">
                        {formatPrice(p.pricePKR, 'PKR')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateProduct(p.id, { stockQuantity: Math.max(0, p.stockQuantity - 1) })}
                            className="w-5 h-5 flex items-center justify-center bg-[#1C1C22] hover:bg-[#26262E] rounded border border-[#2D2D35] text-xs font-mono"
                          >
                            -
                          </button>
                          <span className={`font-mono-nums font-semibold ${p.stockQuantity < 5 ? 'text-rose-400' : 'text-[#F5F2EB]'}`}>
                            {p.stockQuantity}
                          </span>
                          <button
                            onClick={() => updateProduct(p.id, { stockQuantity: p.stockQuantity + 1 })}
                            className="w-5 h-5 flex items-center justify-center bg-[#1C1C22] hover:bg-[#26262E] rounded border border-[#2D2D35] text-xs font-mono"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-mono text-[#8B8A94] bg-[#121214] px-2 py-0.5 rounded border border-[#2D2D35]">
                          DRAFT SAMPLE
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 hover:bg-[#26262E] text-[#8B8A94] hover:text-[#F5F2EB] rounded transition-colors"
                            title="Edit product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${p.title}" from catalog?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 hover:bg-[#26262E] text-[#8B8A94] hover:text-red-400 rounded transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: ORDER MANAGEMENT ================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-display uppercase tracking-wider text-[#F5F2EB]">
                Customer Order Pipeline
              </h2>
              <p className="text-xs text-[#8B8A94]">
                Orders placed via Cash on Delivery or Card Demo in this session are listed below.
              </p>
            </div>
            {orders.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear demo order history?')) {
                    clearDemoOrders();
                  }
                }}
                className="text-xs text-[#8B8A94] hover:text-red-400 underline transition-colors"
              >
                Clear Demo Orders
              </button>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="py-16 text-center bg-[#151519] border border-[#222227] rounded-xl p-8 space-y-2">
              <ShoppingBag className="w-8 h-8 text-[#8B8A94] mx-auto opacity-50" />
              <p className="text-sm font-semibold text-[#F5F2EB]">No orders recorded yet</p>
              <p className="text-xs text-[#8B8A94]">
                Add products to your cart and complete checkout to test incoming orders.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 bg-[#151519] border border-[#222227] rounded-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#222227]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#F5F2EB]">{order.orderNumber}</span>
                      <span className="text-[10px] font-mono text-amber-300 bg-[#1C1A14] border border-[#473B1B] px-2 py-0.5 rounded">
                        DEMO COD
                      </span>
                      <span className="text-xs text-[#8B8A94]">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Status dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8B8A94]">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-semibold py-1 px-2.5 rounded border ${
                          order.status === 'pending_verification'
                            ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                            : order.status === 'dispatched'
                            ? 'bg-sky-950/60 border-sky-800 text-sky-300'
                            : order.status === 'delivered'
                            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                            : 'bg-[#18181D] border-[#2D2D35] text-[#F5F2EB]'
                        }`}
                      >
                        <option value="pending_verification">Pending Verification</option>
                        <option value="packed">Packed</option>
                        <option value="dispatched">Dispatched (TCS/Trax)</option>
                        <option value="delivered">Delivered & Collected</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer & Items breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    <div className="md:col-span-5 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-[#8B8A94] tracking-wider block">Customer Details</span>
                      <p className="text-sm font-semibold text-[#F5F2EB]">{order.customer.fullName}</p>
                      <p className="text-[#8B8A94]">Phone: <strong className="text-[#F5F2EB]">{order.customer.phone}</strong></p>
                      <p className="text-[#8B8A94]">Email: {order.customer.email}</p>
                      <p className="text-[#8B8A94] pt-1">
                        Address: <span className="text-[#F5F2EB]">{order.customer.address}, {order.customer.city}</span>
                      </p>
                      {order.customer.notes && (
                        <p className="text-[11px] text-amber-200/80 italic mt-1">Note: {order.customer.notes}</p>
                      )}
                    </div>

                    <div className="md:col-span-7 space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-[#8B8A94] tracking-wider block">Ordered Items</span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {order.items.map((it) => (
                          <div key={it.id} className="flex items-center justify-between p-2 bg-[#18181D] rounded border border-[#222227]">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[#F5F2EB] font-bold">{it.quantity}×</span>
                              <span className="text-[#F5F2EB] truncate max-w-xs">{it.product.title}</span>
                              <span className="text-[10px] text-[#8B8A94]">({it.selectedSize} · {it.selectedColor.name})</span>
                            </div>
                            <span className="font-mono-nums text-[#F5F2EB]">
                              {formatPrice(it.product.pricePKR * it.quantity, 'PKR')}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-[#222227] text-sm font-bold text-[#F5F2EB]">
                        <span>Total Payable (COD):</span>
                        <span className="font-mono-nums">{formatPrice(order.totalPKR, 'PKR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: SUPABASE ARCHITECTURE ================= */}
      {activeTab === 'supabase' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 bg-[#151519] border border-[#222227] rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold font-display uppercase tracking-wider text-[#F5F2EB]">
                  Supabase Live Integration
                </h3>
              </div>
              <span className={`text-xs font-mono px-2.5 py-1 rounded border self-start sm:self-auto font-semibold ${
                supabaseConfig.isConfigured 
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  : 'bg-[#1C1C22] border-[#2D2D35] text-amber-300'
              }`}>
                {supabaseConfig.isConfigured ? 'LIVE SUPABASE CONNECTED' : 'AWAITING VITE_SUPABASE_ANON_KEY IN .ENV'}
              </span>
            </div>
            <p className="text-xs text-[#8B8A94] leading-relaxed">
              Target Supabase Project: <code className="text-[#F5F2EB] font-mono bg-[#1C1C22] px-1.5 py-0.5 rounded">https://nohmukmrxobjiveipfay.supabase.co</code>
            </p>
          </div>

          {/* Secure Key Input Card */}
          <div className="p-6 bg-[#16161B] border border-[#2B2B36] rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#F5F2EB]">
                  Secure Key Input (Publishable / Anon Key)
                </h4>
                <p className="text-[11px] text-[#8B8A94]">
                  Enter your Supabase Publishable / Anon key here. It will be stored securely in your browser and used immediately to query your live database without editing files.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveAnonKey} className="space-y-3">
              <div className="relative">
                <input
                  type={showAnonKey ? 'text' : 'password'}
                  required
                  value={customAnonKeyInput}
                  onChange={(e) => setCustomAnonKeyInput(e.target.value)}
                  placeholder="Paste your Supabase Publishable Key (anon public)..."
                  className="w-full bg-[#111114] border border-[#2D2D35] rounded-lg py-2.5 pl-3 pr-10 text-xs font-mono text-[#F5F2EB] focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => setShowAnonKey(!showAnonKey)}
                  className="absolute right-2.5 top-2.5 text-[#8B8A94] hover:text-[#F5F2EB] p-0.5"
                >
                  {showAnonKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Save & Connect
                </button>

                <button
                  type="button"
                  onClick={handleClearAnonKey}
                  className="px-3 py-2 bg-[#1C1C22] hover:bg-[#25252D] border border-[#2D2D35] text-xs text-[#8B8A94] hover:text-rose-300 rounded-lg transition-colors cursor-pointer"
                >
                  Clear Saved Key
                </button>

                {keySavedFeedback && (
                  <span className="text-xs text-emerald-400 font-medium animate-in fade-in">
                    ✓ Key saved! Database connection refreshed.
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Quick Setup Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#18181D] rounded-lg border border-[#222227] space-y-2">
              <span className="font-mono text-emerald-400 font-bold block">STEP 1: .ENV KEY</span>
              <h4 className="font-semibold text-[#F5F2EB]">Add Publishable Key</h4>
              <p className="text-[#8B8A94] leading-relaxed">
                Open <code className="text-[#F5F2EB]">.env</code> in your project files and paste your Supabase Publishable Key into <code className="text-emerald-300">VITE_SUPABASE_ANON_KEY</code>.
              </p>
            </div>

            <div className="p-4 bg-[#18181D] rounded-lg border border-[#222227] space-y-2">
              <span className="font-mono text-emerald-400 font-bold block">STEP 2: RUN SCHEMA</span>
              <h4 className="font-semibold text-[#F5F2EB]">Execute SQL Migration</h4>
              <p className="text-[#8B8A94] leading-relaxed">
                Paste the hardened schema from <code className="text-[#F5F2EB]">supabase-schema.sql</code> into your Supabase SQL Editor and click <strong>Run</strong>.
              </p>
            </div>

            <div className="p-4 bg-[#18181D] rounded-lg border border-[#222227] space-y-2">
              <span className="font-mono text-emerald-400 font-bold block">STEP 3: ASSIGN ROLES</span>
              <h4 className="font-semibold text-[#F5F2EB]">Assign Staff & Admin</h4>
              <p className="text-[#8B8A94] leading-relaxed">
                Run: <code className="text-[#F5F2EB] text-[10px] block mt-1 bg-[#101013] p-1 rounded font-mono">UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';</code>
              </p>
            </div>
          </div>

          {/* SQL Schema Viewer */}
          <div className="bg-[#121214] border border-[#222227] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-3.5 bg-[#18181D] border-b border-[#222227]">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#8B8A94]" />
                <span className="text-xs font-mono text-[#F5F2EB] font-bold">
                  supabase-schema.sql (Production PostgreSQL Schema + RLS)
                </span>
              </div>
              <button
                onClick={handleCopySQL}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#222227] hover:bg-[#2D2D35] border border-[#32323D] text-xs font-mono rounded text-[#F5F2EB] transition-colors"
              >
                {copiedSQL ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied SQL</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL Schema</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono text-[#8B8A94] overflow-x-auto max-h-96 leading-relaxed selection:bg-[#26262E]">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>
      )}

      {/* ================= TAB 5: FREE DEPLOYMENT GUIDE ================= */}
      {activeTab === 'deployment' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 bg-[#151519] border border-[#222227] rounded-xl space-y-2">
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-[#F5F2EB]">
              Free Deployment & Hosting Instructions
            </h3>
            <p className="text-xs text-[#8B8A94]">
              RIVA is designed to build into a static bundle with zero server friction. Deploy it for free on any modern hosting provider in less than 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#8B8A94] leading-relaxed">
            {/* Vercel */}
            <div className="p-5 bg-[#18181D] border border-[#222227] rounded-xl space-y-3">
              <h4 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
                Option 1: Deploy on Vercel (Recommended)
              </h4>
              <ol className="list-decimal pl-4 space-y-1.5">
                <li>Push this repository to GitHub or GitLab.</li>
                <li>Go to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-[#F5F2EB] underline">vercel.com</a> and click <strong>Add New Project</strong>.</li>
                <li>Import your RIVA repository. Vercel automatically detects Vite.</li>
                <li>Build Command: <code className="bg-[#121214] px-1.5 py-0.5 rounded text-[#F5F2EB] font-mono">npm run build</code></li>
                <li>Output Directory: <code className="bg-[#121214] px-1.5 py-0.5 rounded text-[#F5F2EB] font-mono">dist</code></li>
                <li>Click <strong>Deploy</strong>. Free global edge CDN with automatic SSL certificate!</li>
              </ol>
            </div>

            {/* Netlify */}
            <div className="p-5 bg-[#18181D] border border-[#222227] rounded-xl space-y-3">
              <h4 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
                Option 2: Deploy on Netlify
              </h4>
              <ol className="list-decimal pl-4 space-y-1.5">
                <li>Log in to <a href="https://netlify.com" target="_blank" rel="noreferrer" className="text-[#F5F2EB] underline">netlify.com</a>.</li>
                <li>Click <strong>Add new site</strong> &gt; <strong>Import an existing project</strong>.</li>
                <li>Select your Git repository.</li>
                <li>Build Command: <code className="bg-[#121214] px-1.5 py-0.5 rounded text-[#F5F2EB] font-mono">npm run build</code></li>
                <li>Publish directory: <code className="bg-[#121214] px-1.5 py-0.5 rounded text-[#F5F2EB] font-mono">dist</code></li>
                <li>Deploy site. Instant HTTPS and custom domain support.</li>
              </ol>
            </div>

            {/* Cloudflare Pages */}
            <div className="p-5 bg-[#18181D] border border-[#222227] rounded-xl space-y-3">
              <h4 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
                Option 3: Cloudflare Pages
              </h4>
              <ol className="list-decimal pl-4 space-y-1.5">
                <li>Open Cloudflare Dashboard &gt; <strong>Compute (Workers & Pages)</strong>.</li>
                <li>Connect your Git repository.</li>
                <li>Framework preset: <strong>Vite</strong>.</li>
                <li>Build output: <code className="bg-[#121214] px-1.5 py-0.5 rounded text-[#F5F2EB] font-mono">dist</code>.</li>
                <li>Enjoy unlimited free requests on Cloudflare's global edge network.</li>
              </ol>
            </div>

            {/* Environment Variables */}
            <div className="p-5 bg-[#18181D] border border-[#222227] rounded-xl space-y-3">
              <h4 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
                Production Environment Variables
              </h4>
              <p>Configure these optional variables in your hosting provider's dashboard:</p>
              <ul className="space-y-1 font-mono text-[11px] text-[#F5F2EB]">
                <li>• VITE_SUPABASE_URL=https://your-id.supabase.co</li>
                <li>• VITE_SUPABASE_ANON_KEY=your-anon-key</li>
                <li>• VITE_ADMIN_PASSWORD=your-secure-admin-passphrase</li>
              </ul>
              <p className="text-[11px] text-[#8B8A94] mt-1">
                Never commit secret service keys to client repositories.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#18181D] border border-[#2D2D35] rounded-xl p-6 text-[#F5F2EB] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold font-display uppercase tracking-wider pb-3 border-b border-[#2D2D35]">
              {editingProductId ? 'Edit Streetwear Product' : 'Add New Streetwear Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8B8A94] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  placeholder="e.g. Heavyweight Minimalist Zip Hoodie"
                  className="w-full bg-[#121214] border border-[#2D2D35] rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8B8A94] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Collection *
                  </label>
                  <select
                    value={prodCollection}
                    onChange={(e) => setProdCollection(e.target.value as CollectionType)}
                    className="w-full bg-[#121214] border border-[#2D2D35] rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB]"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8B8A94] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Category *
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => {
                      const val = e.target.value as CategoryType;
                      setProdCategory(val);
                      setProdCategoryLabel(val.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '));
                    }}
                    className="w-full bg-[#121214] border border-[#2D2D35] rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB]"
                  >
                    <option value="hoodies">Hoodies</option>
                    <option value="oversized-t-shirts">Oversized T-Shirts</option>
                    <option value="relaxed-t-shirts">Relaxed T-Shirts</option>
                    <option value="contemporary-tops">Contemporary Tops</option>
                    <option value="sweatshirts">Sweatshirts</option>
                    <option value="joggers">Joggers</option>
                    <option value="bottoms">Bottoms</option>
                    <option value="matching-sets">Matching Sets</option>
                    <option value="modest-streetwear">Modest Streetwear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#8B8A94] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-[#121214] border border-[#2D2D35] rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB] font-mono-nums"
                  />
                </div>

                <div>
                  <label className="block text-[#8B8A94] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-[#121214] border border-[#2D2D35] rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB] font-mono-nums"
                  />
                </div>

                <div>
                  <label className="block text-[#8B8A94] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                    Fabric GSM *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodGSM}
                    onChange={(e) => setProdGSM(Number(e.target.value))}
                    className="w-full bg-[#121214] border border-[#2D2D35] rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB] font-mono-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8B8A94] uppercase tracking-wider text-[10px] mb-1 font-semibold">
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full bg-[#121214] border border-[#2D2D35] rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2D2D35]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-[#222227] hover:bg-[#2B2B33] text-xs font-semibold rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F5F2EB] text-[#0A0A0C] text-xs font-bold rounded-md hover:bg-white transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
