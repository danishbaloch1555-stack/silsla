import React, { useState } from 'react';
import { Product, ProductColor } from '../types';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import { SizeGuideModal } from './SizeGuideModal';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  RotateCcw
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onOpenCheckoutDirect?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
  product, 
  onBack,
  onOpenCheckoutDirect 
}) => {
  const { addToCart, currency } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Accordion states
  const [openSection, setOpenSection] = useState<'fabric' | 'shipping' | 'care' | null>('fabric');

  const toggleSection = (section: 'fabric' | 'shipping' | 'care') => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNowCOD = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    if (onOpenCheckoutDirect) {
      onOpenCheckoutDirect();
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#121214] text-[#F5F2EB] py-8 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#8B8A94] hover:text-[#F5F2EB] transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Collection</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT COLUMN: Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 shrink-0 overflow-x-auto md:overflow-visible">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-20 md:w-20 md:h-24 rounded-md overflow-hidden border transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#F5F2EB] ring-1 ring-[#F5F2EB]'
                      : 'border-[#2D2D35] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Stage Image */}
          <div className="relative flex-1 aspect-[3/4] bg-[#18181D] rounded-xl overflow-hidden border border-[#26262E]">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Sample Badge */}
            <div className="absolute top-4 left-4">
              <span className="text-[11px] font-mono tracking-widest text-[#8B8A94] bg-[#0A0A0C]/90 px-2.5 py-1 rounded border border-[#2D2D35] backdrop-blur-sm">
                DRAFT SAMPLE
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Contiguous Purchase Module */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
          {/* Top metadata */}
          <div>
            <div className="flex items-center gap-2 text-xs text-[#8B8A94] uppercase tracking-wider mb-2">
              <span className="capitalize">{product.collection}</span>
              <span aria-hidden="true">/</span>
              <span>{product.categoryLabel}</span>
              <span aria-hidden="true">/</span>
              <span className="text-[#E8E4DB]">{product.fabricDetails.gsm} GSM</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-[#F5F2EB]">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl font-bold font-mono-nums text-[#F5F2EB]">
                {formatPrice(product.pricePKR, currency)}
              </span>
              {product.compareAtPricePKR && (
                <span className="text-base font-mono-nums text-[#8B8A94] line-through">
                  {formatPrice(product.compareAtPricePKR, currency)}
                </span>
              )}
              <span className="text-xs font-mono text-[#8B8A94]">
                (Tax included · Free delivery &gt; PKR 7,500)
              </span>
            </div>
          </div>

          {/* Short description */}
          <p className="text-sm text-[#8B8A94] leading-relaxed">
            {product.description}
          </p>

          <div className="h-px w-full bg-[#26262E]" />

          {/* Color Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#8B8A94] uppercase tracking-wider">
                Colour: <span className="text-[#F5F2EB]">{selectedColor.name}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedColor(c)}
                  className={`group relative flex items-center justify-center p-1 rounded-full transition-all ${
                    selectedColor.code === c.code
                      ? 'ring-2 ring-[#F5F2EB] ring-offset-2 ring-offset-[#121214]'
                      : 'hover:scale-105'
                  }`}
                  title={c.name}
                >
                  <span
                    style={{ backgroundColor: c.hex }}
                    className="w-7 h-7 rounded-full border border-[#2D2D35] flex items-center justify-center shadow-inner"
                  >
                    {selectedColor.code === c.code && (
                      <Check className={`w-3.5 h-3.5 ${c.hex === '#F0ECE4' || c.hex === '#E4DFD3' ? 'text-black' : 'text-white'}`} />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#8B8A94] uppercase tracking-wider">
                Select Size: <span className="text-[#F5F2EB]">{selectedSize}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="underline underline-offset-4 text-[#8B8A94] hover:text-[#F5F2EB] transition-colors"
              >
                Size & Fit Guide
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2.5 text-xs font-semibold rounded-md border transition-all ${
                    selectedSize === sz
                      ? 'bg-[#F5F2EB] text-[#0A0A0C] border-[#F5F2EB] font-bold shadow-md'
                      : 'bg-[#18181D] text-[#F5F2EB] border-[#2D2D35] hover:border-[#40404C]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Stock Availability */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center border border-[#2D2D35] bg-[#18181D] rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-sm text-[#8B8A94] hover:text-[#F5F2EB] transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-3 text-sm font-mono-nums font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="px-3 py-2 text-sm text-[#8B8A94] hover:text-[#F5F2EB] transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <div className="text-right">
              {product.stockQuantity > 0 ? (
                <span className="text-xs font-mono text-[#8B8A94]">
                  In Stock ({product.stockQuantity} units available)
                </span>
              ) : (
                <span className="text-xs font-mono text-red-400">Sold Out</span>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stockQuantity <= 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#F5F2EB] text-[#0A0A0C] font-semibold text-sm rounded-lg hover:bg-white active:scale-[0.99] transition-all disabled:opacity-50 shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addedNotice ? 'Added to Bag ✓' : 'Add to Bag'}</span>
            </button>

            <button
              onClick={handleBuyNowCOD}
              disabled={product.stockQuantity <= 0}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#18181D] border border-[#2D2D35] text-[#F5F2EB] font-semibold text-xs rounded-lg hover:bg-[#222227] hover:border-[#40404C] transition-all cursor-pointer"
            >
              <span>Order via Cash on Delivery (Demo COD)</span>
            </button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#26262E] text-xs text-[#8B8A94]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#F5F2EB]" />
              <span>Pakistan COD (2-4 Days)</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#F5F2EB]" />
              <span>14-Day Hassle-Free Exchange</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F5F2EB]" />
              <span>100% Combed Pakistani Cotton</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5F2EB]" />
              <span>Pre-Shrunk Heavy Weave</span>
            </div>
          </div>

          {/* Accordion Panels */}
          <div className="border-t border-[#26262E] divide-y divide-[#26262E] pt-2">
            {/* Section 1: Fabric & Craftsmanship */}
            <div className="py-3">
              <button
                onClick={() => toggleSection('fabric')}
                className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#F5F2EB] hover:text-white transition-colors"
              >
                <span>Fabric & Engineering Specifications</span>
                {openSection === 'fabric' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'fabric' && (
                <div className="mt-3 text-xs text-[#8B8A94] space-y-2 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-2 p-3 bg-[#18181D] rounded-lg border border-[#26262E]">
                    <div>
                      <span className="text-[#8B8A94] block text-[10px]">Fabric Weight</span>
                      <span className="font-mono text-[#F5F2EB] font-bold">{product.fabricDetails.gsm} GSM</span>
                    </div>
                    <div>
                      <span className="text-[#8B8A94] block text-[10px]">Composition</span>
                      <span className="text-[#F5F2EB] font-medium">{product.fabricDetails.composition}</span>
                    </div>
                    <div>
                      <span className="text-[#8B8A94] block text-[10px]">Weave Style</span>
                      <span className="text-[#F5F2EB] font-medium">{product.fabricDetails.weave}</span>
                    </div>
                    <div>
                      <span className="text-[#8B8A94] block text-[10px]">Manufacturing</span>
                      <span className="text-[#F5F2EB] font-medium">{product.fabricDetails.origin}</span>
                    </div>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    {product.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Section 2: Shipping */}
            <div className="py-3">
              <button
                onClick={() => toggleSection('shipping')}
                className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#F5F2EB] hover:text-white transition-colors"
              >
                <span>Domestic & Global Delivery</span>
                {openSection === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'shipping' && (
                <div className="mt-3 text-xs text-[#8B8A94] space-y-2 animate-in fade-in duration-200">
                  <p>
                    • <strong className="text-[#F5F2EB]">Pakistan Domestic Shipping:</strong> Orders are dispatched from our Lahore logistics hub via TCS or Trax. Typical delivery: 2-3 business days to Karachi, Lahore, Islamabad/Rawalpindi; 3-4 days to other cities.
                  </p>
                  <p>
                    • <strong className="text-[#F5F2EB]">Cash on Delivery (COD):</strong> Supported for all cities across Pakistan with zero advance deposit required.
                  </p>
                  <p>
                    • <strong className="text-[#F5F2EB]">International Shipping:</strong> Express worldwide courier via DHL/FedEx in 4-6 business days with live doorstep tracking.
                  </p>
                </div>
              )}
            </div>

            {/* Section 3: Care Instructions */}
            <div className="py-3">
              <button
                onClick={() => toggleSection('care')}
                className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#F5F2EB] hover:text-white transition-colors"
              >
                <span>Garment Longevity & Care</span>
                {openSection === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'care' && (
                <div className="mt-3 text-xs text-[#8B8A94] space-y-1.5 animate-in fade-in duration-200">
                  {product.careInstructions.map((instruction, idx) => (
                    <p key={idx}>• {instruction}</p>
                  ))}
                  <p className="pt-1 text-[11px] italic text-[#8B8A94]">
                    Our heavyweight cotton is pre-washed to minimize shrinkage to less than 2% when washed as instructed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sizing Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        collection={product.collection}
      />
    </div>
  );
};
