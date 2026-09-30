/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActivePage, Product } from './types';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { ShippingView } from './views/ShippingView';
import { ReturnsView } from './views/ReturnsView';
import { PrivacyView } from './views/PrivacyView';
import { TermsView } from './views/TermsView';
import { AdminDashboard } from './views/AdminDashboard';
import { OrderTrackingModal } from './components/OrderTrackingModal';

function checkIsAdminRoute(): boolean {
  try {
    return (
      window.location.pathname.startsWith('/admin') ||
      window.location.hash === '#admin' ||
      window.location.hash === '#/admin' ||
      new URLSearchParams(window.location.search).has('admin')
    );
  } catch {
    return false;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>(() => {
    return checkIsAdminRoute() ? 'admin' : 'home';
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Private routing sync for owner URL direct navigation & secret shortcut
  useEffect(() => {
    const handleUrlChange = () => {
      if (checkIsAdminRoute()) {
        setActivePage('admin');
      } else if (activePage === 'admin') {
        setActivePage('home');
      }
    };

    // Secret operator shortcut: Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setActivePage((prev) => {
          const next = prev === 'admin' ? 'home' : 'admin';
          if (next === 'admin') {
            window.location.hash = 'admin';
          } else {
            if (window.location.hash === '#admin' || window.location.hash === '#/admin') {
              history.pushState(null, '', window.location.pathname);
            }
          }
          return next;
        });
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePage]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    if (selectedProduct) {
      setActivePage(selectedProduct.collection);
    } else {
      setActivePage('shop-all');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToStorefront = () => {
    if (window.location.hash === '#admin' || window.location.hash === '#/admin') {
      history.pushState(null, '', window.location.pathname);
    } else if (window.location.pathname.startsWith('/admin')) {
      history.pushState(null, '', '/');
    }
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in private admin route: render isolated administrative console
  if (activePage === 'admin') {
    return (
      <AdminProvider>
        <div className="min-h-screen bg-[#0A0A0C] text-[#F5F2EB] flex flex-col font-sans selection:bg-[#F5F2EB] selection:text-[#0A0A0C]">
          <AdminDashboard onReturnToStorefront={handleReturnToStorefront} />
        </div>
      </AdminProvider>
    );
  }

  // Otherwise: Public customer-facing RIVA storefront (Completely unchanged)
  return (
    <AdminProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#0A0A0C] text-[#F5F2EB] flex flex-col font-sans selection:bg-[#F5F2EB] selection:text-[#0A0A0C]">
          {/* Public Top Bar Navigation - No Admin or Backend links */}
          <Header activePage={activePage} setActivePage={setActivePage} />

          {/* Main View Area */}
          <main className="flex-1 w-full">
            {activePage === 'home' && (
              <HomeView
                setActivePage={setActivePage}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {(activePage === 'men' ||
              activePage === 'women' ||
              activePage === 'kids' ||
              activePage === 'new-arrivals' ||
              activePage === 'shop-all') && (
              <CatalogView
                page={activePage}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {activePage === 'product-detail' && selectedProduct && (
              <ProductDetailPage
                product={selectedProduct}
                onBack={handleBackFromDetail}
                onOpenCheckoutDirect={() => setIsCheckoutOpen(true)}
              />
            )}

            {activePage === 'about' && (
              <AboutView setActivePage={setActivePage} />
            )}

            {activePage === 'contact' && <ContactView />}
            {activePage === 'shipping' && <ShippingView />}
            {activePage === 'returns' && <ReturnsView />}
            {activePage === 'privacy' && <PrivacyView />}
            {activePage === 'terms' && <TermsView />}
          </main>

          {/* Public Footer - No Admin or Backend links */}
          <Footer
            setActivePage={setActivePage}
            onOpenTracking={() => setIsTrackingOpen(true)}
          />

          {/* Persistent Customer Cart Drawer */}
          <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

          {/* Customer Cash on Delivery & Card Checkout Modal */}
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />

          {/* Customer Order Tracking Modal */}
          <OrderTrackingModal
            isOpen={isTrackingOpen}
            onClose={() => setIsTrackingOpen(false)}
          />

          {/* Live Search Modal */}
          <SearchModal onSelectProduct={handleSelectProduct} />
        </div>
      </CartProvider>
    </AdminProvider>
  );
}
