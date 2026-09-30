import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, currency } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0];
    addToCart(product, defaultSize, defaultColor, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1500);
  };

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-1"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#18181D] rounded-lg border border-[#26262E] transition-colors group-hover:border-[#383844]">
        {!imageError && primaryImage ? (
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#1C1C22] to-[#121214]">
            <span className="font-display text-2xl font-bold tracking-widest text-[#E8E4DB]/40">RIVA</span>
            <span className="mt-2 text-xs text-[#8B8A94] uppercase tracking-wider">{product.categoryLabel}</span>
          </div>
        )}

        {/* Quiet Draft Sample Marker (Clean subtle tag, never gaudy) */}
        <div className="absolute top-3 left-3">
          <span className="text-[10px] tracking-widest font-mono uppercase text-[#8B8A94] bg-[#0A0A0C]/80 px-2 py-0.5 rounded border border-[#2D2D35] backdrop-blur-xs">
            DRAFT SAMPLE
          </span>
        </div>

        {/* Stock status indicator */}
        {product.stockQuantity < 5 && product.stockQuantity > 0 && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-mono text-[#E4DFD3] bg-[#0A0A0C]/80 px-2 py-0.5 rounded border border-[#2D2D35]">
              Only {product.stockQuantity} left
            </span>
          </div>
        )}

        {/* Quick Add Overlay on Desktop */}
        <div className="absolute inset-x-3 bottom-3 hidden md:flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAdd}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#F5F2EB] text-[#0A0A0C] text-xs font-semibold rounded-md shadow-lg hover:bg-white active:scale-95 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{addedNotice ? 'Added to Bag' : `Quick Add (${product.sizes[0]})`}</span>
          </button>
        </div>
      </div>

      {/* Product Metadata & Info (Strict Zero-Pill Discipline) */}
      <div className="mt-3.5 flex flex-col space-y-1">
        {/* Unboxed metadata kicker */}
        <div className="flex items-center gap-1.5 text-xs text-[#8B8A94] uppercase tracking-wider">
          <span>{product.categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{product.fabricDetails.gsm} GSM</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{product.collection}</span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-semibold text-[#F5F2EB] group-hover:text-white transition-colors line-clamp-1">
          {product.title}
        </h3>

        {/* Price & Swatches Row */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold font-mono-nums text-[#F5F2EB]">
              {formatPrice(product.pricePKR, currency)}
            </span>
            {product.compareAtPricePKR && (
              <span className="text-xs font-mono-nums text-[#8B8A94] line-through">
                {formatPrice(product.compareAtPricePKR, currency)}
              </span>
            )}
          </div>

          {/* Color swatches */}
          <div className="flex items-center gap-1">
            {product.colors.map((c) => (
              <span
                key={c.code}
                title={c.name}
                style={{ backgroundColor: c.hex }}
                className="w-2.5 h-2.5 rounded-full border border-[#2D2D35] shrink-0"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
