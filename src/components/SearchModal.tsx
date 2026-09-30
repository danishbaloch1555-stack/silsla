import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { Product } from '../types';
import { formatPrice } from '../utils/currency';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  onSelectProduct: (product: Product) => void;
}

const QUICK_TAGS = ['Hoodies', 'Oversized Tees', 'Matching Sets', 'Joggers', 'Kids', 'Charcoal', 'Bone Beige'];

export const SearchModal: React.FC<SearchModalProps> = ({ onSelectProduct }) => {
  const { isSearchOpen, setIsSearchOpen, currency } = useCart();
  const { products } = useAdmin();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.colors.some((c) => c.name.toLowerCase().includes(q)) ||
        `${p.fabricDetails.gsm} gsm`.toLowerCase().includes(q)
      );
    });
  }, [query, products]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-2xl mx-auto mt-16 md:mt-24 px-4 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#18181D] border border-[#2D2D35] rounded-xl overflow-hidden shadow-2xl text-[#F5F2EB]">
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-[#2D2D35]">
            <Search className="w-5 h-5 text-[#8B8A94] shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search heavyweight hoodies, oversized tees, matching sets..."
              className="w-full bg-transparent text-sm text-[#F5F2EB] placeholder:text-[#8B8A94]/60 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs text-[#8B8A94] hover:text-[#F5F2EB] mr-2"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 rounded-md text-[#8B8A94] hover:text-[#F5F2EB] hover:bg-[#222227] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filter Tags */}
          <div className="p-3 bg-[#121214] border-b border-[#222227] flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[11px] text-[#8B8A94] uppercase tracking-wider shrink-0 mr-1">Trending:</span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 bg-[#1C1C22] hover:bg-[#282830] text-[#8B8A94] hover:text-[#F5F2EB] rounded text-xs font-mono whitespace-nowrap transition-colors border border-[#26262E]"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="max-h-96 overflow-y-auto p-4 space-y-2">
            {query.trim() === '' ? (
              <div className="py-8 text-center text-xs text-[#8B8A94]">
                <p>Type keywords to discover RIVA essentials.</p>
                <p className="text-[11px] text-[#8B8A94]/70 mt-1">
                  Try searching "hoodie", "460 gsm", "charcoal", or "modest"
                </p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#8B8A94]">
                <p>No products found matching "{query}".</p>
                <p className="text-[11px] text-[#8B8A94]/70 mt-1">Try another keyword or browse our collections above.</p>
              </div>
            ) : (
              searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center gap-4 p-2.5 rounded-lg bg-[#121214] border border-[#222227] hover:border-[#383844] cursor-pointer transition-colors group"
                >
                  <div className="w-12 h-14 bg-[#18181D] rounded overflow-hidden shrink-0 border border-[#2D2D35]">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] text-[#8B8A94] uppercase tracking-wider">
                      <span className="capitalize">{product.collection}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.fabricDetails.gsm} GSM</span>
                    </div>
                    <h4 className="text-xs font-semibold text-[#F5F2EB] group-hover:text-white truncate">
                      {product.title}
                    </h4>
                    <span className="text-xs font-mono-nums font-semibold text-[#F5F2EB]">
                      {formatPrice(product.pricePKR, currency)}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8B8A94] group-hover:text-[#F5F2EB] group-hover:translate-x-1 transition-all mr-2" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
