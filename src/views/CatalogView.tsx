import React, { useState, useMemo } from 'react';
import { ActivePage, Product, CategoryType } from '../types';
import { useAdmin } from '../context/AdminContext';
import { ProductCard } from '../components/ProductCard';
import { Filter, X, ChevronDown, SlidersHorizontal, RefreshCcw } from 'lucide-react';

interface CatalogViewProps {
  page: ActivePage;
  onSelectProduct: (product: Product) => void;
}

const CATEGORY_OPTIONS: { id: CategoryType; label: string }[] = [
  { id: 'oversized-t-shirts', label: 'Oversized T-Shirts' },
  { id: 'relaxed-t-shirts', label: 'Relaxed T-Shirts' },
  { id: 'contemporary-tops', label: 'Contemporary Tops' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'sweatshirts', label: 'Sweatshirts' },
  { id: 'joggers', label: 'Joggers' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'matching-sets', label: 'Matching Sets' },
  { id: 'modest-streetwear', label: 'Modest Streetwear' },
  { id: 'accessories', label: 'Accessories' },
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '26', '28', '30', '32', '34', '36', '4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-14Y', 'One Size'];

const COLOR_OPTIONS = [
  { name: 'Onyx Black', hex: '#0B0B0D' },
  { name: 'Bone Beige', hex: '#E4DFD3' },
  { name: 'Washed Charcoal', hex: '#24242A' },
  { name: 'Raw Ecru', hex: '#F0ECE4' },
  { name: 'Slate Gray', hex: '#3B3B42' },
];

export const CatalogView: React.FC<CatalogViewProps> = ({ page, onSelectProduct }) => {
  const { products } = useAdmin();

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<'all' | 'under5k' | '5k-8k' | 'over8k'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Determine collection title & subtitle
  const pageMeta = useMemo(() => {
    switch (page) {
      case 'men':
        return {
          title: "Men's Streetwear",
          subtitle: 'Architectural heavyweight hoodies, oversized tees, raw seam bottoms & matching fleece sets.',
          collection: 'men',
        };
      case 'women':
        return {
          title: "Women's Collection",
          subtitle: 'Boxy cropped tees, contemporary tops, cocoon hoodies, modest dusters & tailored joggers.',
          collection: 'women',
        };
      case 'kids':
        return {
          title: "Kids Streetwear",
          subtitle: 'Scaled-down architectural staples with international child safety standards and reinforced knees.',
          collection: 'kids',
        };
      case 'new-arrivals':
        return {
          title: 'New Arrivals',
          subtitle: 'The latest limited heavyweight batch drops cut and tailored in Lahore, Pakistan.',
          collection: 'new-arrivals',
        };
      case 'shop-all':
      default:
        return {
          title: 'All Streetwear Silhouettes',
          subtitle: 'The complete RIVA catalogue. 100% Pakistani combed cotton, 300–460 GSM.',
          collection: 'all',
        };
    }
  }, [page]);

  // Filtering pipeline
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Collection match
        if (page === 'men' && p.collection !== 'men') return false;
        if (page === 'women' && p.collection !== 'women') return false;
        if (page === 'kids' && p.collection !== 'kids') return false;
        if (page === 'new-arrivals' && !p.isNewArrival) return false;

        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
          return false;
        }

        // Size filter
        if (selectedSizes.length > 0 && !p.sizes.some((sz) => selectedSizes.includes(sz))) {
          return false;
        }

        // Color filter
        if (selectedColors.length > 0 && !p.colors.some((col) => selectedColors.includes(col.name))) {
          return false;
        }

        // Price range filter
        if (priceRange === 'under5k' && p.pricePKR >= 5000) return false;
        if (priceRange === '5k-8k' && (p.pricePKR < 5000 || p.pricePKR > 8000)) return false;
        if (priceRange === 'over8k' && p.pricePKR <= 8000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.pricePKR - b.pricePKR;
        if (sortBy === 'price-high') return b.pricePKR - a.pricePKR;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, page, selectedCategories, selectedSizes, selectedColors, priceRange, sortBy]);

  const toggleCategory = (cat: CategoryType) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSize = (sz: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange('all');
    setSortBy('featured');
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedSizes.length +
    selectedColors.length +
    (priceRange !== 'all' ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      {/* Header Banner */}
      <div className="pb-6 border-b border-[#222227] space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8B8A94]">
          <span>Collection</span>
          <span aria-hidden="true">/</span>
          <span className="text-[#E8E4DB]">{pageMeta.title}</span>
          <span aria-hidden="true">/</span>
          <span>DRAFT SAMPLES ({filteredProducts.length})</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold font-display uppercase tracking-tight text-[#F5F2EB]">
          {pageMeta.title}
        </h1>
        <p className="text-xs md:text-sm text-[#8B8A94] max-w-2xl leading-relaxed">
          {pageMeta.subtitle}
        </p>
      </div>

      {/* Control Bar: Filter Toggle & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 bg-[#151519] px-4 rounded-lg border border-[#222227]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#1F1F26] hover:bg-[#282833] border border-[#2D2D35] rounded-md text-xs font-semibold text-[#F5F2EB] transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#F5F2EB] text-[#0A0A0C] text-[10px] font-bold flex items-center justify-center font-mono">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#8B8A94] hover:text-[#F5F2EB] transition-colors underline underline-offset-4"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#8B8A94] font-medium hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#1F1F26] border border-[#2D2D35] rounded-md py-1.5 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB]"
          >
            <option value="featured">Featured Silhouettes</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Active Filter Tags (Zero-Pill: Clean unboxed buttons) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[#8B8A94] text-[11px] uppercase tracking-wider mr-1">Active:</span>
          {selectedCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1C1C22] hover:bg-[#25252D] border border-[#2D2D35] text-[#F5F2EB] rounded text-xs transition-colors"
            >
              <span>{cat}</span>
              <X className="w-3 h-3 text-[#8B8A94]" />
            </button>
          ))}
          {selectedSizes.map((sz) => (
            <button
              key={sz}
              onClick={() => toggleSize(sz)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1C1C22] hover:bg-[#25252D] border border-[#2D2D35] text-[#F5F2EB] rounded text-xs transition-colors"
            >
              <span>Size: {sz}</span>
              <X className="w-3 h-3 text-[#8B8A94]" />
            </button>
          ))}
          {selectedColors.map((col) => (
            <button
              key={col}
              onClick={() => toggleColor(col)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1C1C22] hover:bg-[#25252D] border border-[#2D2D35] text-[#F5F2EB] rounded text-xs transition-colors"
            >
              <span>Color: {col}</span>
              <X className="w-3 h-3 text-[#8B8A94]" />
            </button>
          ))}
          {priceRange !== 'all' && (
            <button
              onClick={() => setPriceRange('all')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1C1C22] hover:bg-[#25252D] border border-[#2D2D35] text-[#F5F2EB] rounded text-xs transition-colors"
            >
              <span>
                {priceRange === 'under5k' ? '< PKR 5,000' : priceRange === '5k-8k' ? 'PKR 5k-8k' : '> PKR 8,000'}
              </span>
              <X className="w-3 h-3 text-[#8B8A94]" />
            </button>
          )}
        </div>
      )}

      {/* Main Catalog Layout (Sidebar Filter + Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* DESKTOP SIDEBAR FILTER / COLLAPSIBLE DRAWER */}
        {isFilterDrawerOpen && (
          <aside className="lg:col-span-3 bg-[#151519] border border-[#222227] rounded-xl p-5 space-y-6 text-xs animate-in fade-in duration-200">
            {/* Category Filter */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-[#F5F2EB] uppercase tracking-wider text-[11px] pb-1 border-b border-[#222227]">
                Product Category
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {CATEGORY_OPTIONS.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 cursor-pointer text-[#8B8A94] hover:text-[#F5F2EB] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      className="rounded border-[#2D2D35] text-[#F5F2EB] focus:ring-0"
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Bracket */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-[#F5F2EB] uppercase tracking-wider text-[11px] pb-1 border-b border-[#222227]">
                Price (PKR)
              </h4>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under5k', label: 'Under PKR 5,000' },
                  { id: '5k-8k', label: 'PKR 5,000 – PKR 8,000' },
                  { id: 'over8k', label: 'Over PKR 8,000' },
                ].map((pr) => (
                  <label
                    key={pr.id}
                    className="flex items-center gap-2 cursor-pointer text-[#8B8A94] hover:text-[#F5F2EB] transition-colors"
                  >
                    <input
                      type="radio"
                      name="price-bracket"
                      checked={priceRange === pr.id}
                      onChange={() => setPriceRange(pr.id as any)}
                      className="text-[#F5F2EB] focus:ring-0"
                    />
                    <span>{pr.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-[#F5F2EB] uppercase tracking-wider text-[11px] pb-1 border-b border-[#222227]">
                Size
              </h4>
              <div className="grid grid-cols-4 gap-1.5">
                {SIZE_OPTIONS.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => toggleSize(sz)}
                    className={`py-1.5 text-center text-xs font-mono rounded border transition-colors ${
                      selectedSizes.includes(sz)
                        ? 'bg-[#F5F2EB] text-[#0A0A0C] border-[#F5F2EB] font-bold'
                        : 'bg-[#18181D] text-[#8B8A94] border-[#26262E] hover:border-[#383844] hover:text-[#F5F2EB]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour Filter */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-[#F5F2EB] uppercase tracking-wider text-[11px] pb-1 border-b border-[#222227]">
                Colour
              </h4>
              <div className="space-y-1.5">
                {COLOR_OPTIONS.map((col) => (
                  <label
                    key={col.name}
                    className="flex items-center gap-2 cursor-pointer text-[#8B8A94] hover:text-[#F5F2EB] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(col.name)}
                      onChange={() => toggleColor(col.name)}
                      className="rounded border-[#2D2D35] text-[#F5F2EB] focus:ring-0"
                    />
                    <span
                      style={{ backgroundColor: col.hex }}
                      className="w-3 h-3 rounded-full border border-[#2D2D35]"
                    />
                    <span>{col.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* PRODUCTS GRID */}
        <main
          className={`${
            isFilterDrawerOpen ? 'lg:col-span-9' : 'lg:col-span-12'
          }`}
        >
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-[#151519] border border-[#222227] rounded-xl p-8 space-y-4">
              <p className="text-base font-semibold text-[#F5F2EB]">
                No matching silhouettes found
              </p>
              <p className="text-xs text-[#8B8A94] max-w-sm mx-auto">
                No draft samples matched the selected filters. Clear your filters or explore other categories.
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5F2EB] text-[#0A0A0C] text-xs font-bold rounded-lg hover:bg-white transition-colors"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
