import React, { useState } from 'react';
import { ActivePage, Currency } from '../types';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

const CURRENCIES: Currency[] = ['PKR', 'USD', 'GBP', 'AED'];

export const Header: React.FC<HeaderProps> = ({ activePage, setActivePage }) => {
  const { totalItems, setIsCartOpen, setIsSearchOpen, currency, setCurrency } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const navItems: { label: string; page: ActivePage }[] = [
    { label: 'Men', page: 'men' },
    { label: 'Women', page: 'women' },
    { label: 'Kids', page: 'kids' },
    { label: 'New Arrivals', page: 'new-arrivals' },
    { label: 'Shop All', page: 'shop-all' },
    { label: 'About', page: 'about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0C]/95 backdrop-blur-md border-b border-[#222227] text-[#F5F2EB]">
      {/* Slim Top Announcement Bar */}
      <div className="w-full bg-[#141418] border-b border-[#1E1E24] px-4 py-1.5 text-center text-[11px] font-mono tracking-wide text-[#8B8A94] flex items-center justify-center gap-3">
        <span>FREE SHIPPING IN PAKISTAN OVER PKR 7,500</span>
        <span aria-hidden="true" className="text-[#3E3E48]">·</span>
        <span className="hidden sm:inline">WORLDWIDE EXPRESS COURIER AVAILABLE</span>
        <span aria-hidden="true" className="hidden sm:inline text-[#3E3E48]">·</span>
        <span className="text-[#E8E4DB] font-semibold">SLOGAN: MADE TO STAND OUT</span>
      </div>

      {/* Main Top Bar (3-Zone Contract) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* ZONE 1: Original RIVA Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-[#8B8A94] hover:text-[#F5F2EB] hover:bg-[#18181D] transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col text-left group"
          >
            <span className="text-2xl font-extrabold tracking-[0.22em] font-display text-[#F5F2EB] group-hover:text-white transition-colors">
              RIVA
            </span>
          </button>
        </div>

        {/* ZONE 2: Primary Clean Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#8B8A94]">
          {navItems.map((item) => {
            const isActive = activePage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => {
                  setActivePage(item.page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative py-1 transition-colors hover:text-[#F5F2EB] ${
                  isActive ? 'text-[#F5F2EB] font-bold' : ''
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5F2EB] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* ZONE 3: Primary Actions (Currency, Search, Admin, Bag) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Selector */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-mono text-[#8B8A94] hover:text-[#F5F2EB] hover:bg-[#18181D] transition-colors border border-[#222227]"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-1 w-24 bg-[#18181D] border border-[#2D2D35] rounded-lg shadow-xl py-1 z-50">
                {CURRENCIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrency(c);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors ${
                      currency === c
                        ? 'bg-[#26262E] text-[#F5F2EB] font-bold'
                        : 'text-[#8B8A94] hover:text-[#F5F2EB] hover:bg-[#222227]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-md text-[#8B8A94] hover:text-[#F5F2EB] hover:bg-[#18181D] transition-colors"
            title="Search products"
            aria-label="Search catalog"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Shopping Bag Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center p-2 rounded-md text-[#F5F2EB] hover:bg-[#18181D] transition-colors"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-mono-nums font-bold text-[#0A0A0C] bg-[#F5F2EB] rounded-full shadow">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-3/4 max-w-xs bg-[#121214] border-r border-[#26262E] p-6 text-[#F5F2EB] flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#26262E]">
                <span className="text-2xl font-extrabold tracking-[0.2em] font-display">RIVA</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-[#8B8A94] hover:text-[#F5F2EB]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col space-y-4 pt-6 text-sm font-semibold uppercase tracking-wider text-[#8B8A94]">
                {navItems.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => {
                      setActivePage(item.page);
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-left transition-colors ${
                      activePage === item.page ? 'text-[#F5F2EB] font-bold' : 'hover:text-[#F5F2EB]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#26262E] text-xs text-[#8B8A94] space-y-2">
              <p className="font-mono text-[11px]">MADE TO STAND OUT</p>
              <p className="text-[10px]">Lahore · Karachi · International</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
