import React from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotalPKR,
    discountPKR,
    shippingFeePKR,
    totalPKR,
    currency,
    promoCode,
    setPromoCode,
    appliedPromo,
    promoError,
    applyPromoCode,
    removePromoCode,
    freeShippingThresholdPKR,
    remainingForFreeShippingPKR,
  } = useCart();

  if (!isCartOpen) return null;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    applyPromoCode(promoCode);
  };

  const progressPercent = Math.min(100, Math.round(((freeShippingThresholdPKR - remainingForFreeShippingPKR) / freeShippingThresholdPKR) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6">
        <div className="w-screen max-w-md bg-[#121214] border-l border-[#26262E] text-[#F5F2EB] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#26262E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#F5F2EB]" />
              <h2 className="text-base font-bold font-display uppercase tracking-wider">Your Shopping Bag</h2>
              <span className="text-xs font-mono text-[#8B8A94]">({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-[#8B8A94] hover:text-[#F5F2EB] hover:bg-[#222227] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="p-3.5 bg-[#18181D] border-b border-[#26262E]">
            <div className="flex items-center gap-2 text-xs text-[#8B8A94] mb-1.5">
              <Truck className="w-3.5 h-3.5 text-[#F5F2EB]" />
              {remainingForFreeShippingPKR === 0 ? (
                <span className="text-[#F5F2EB] font-semibold">You've unlocked FREE Shipping across Pakistan!</span>
              ) : (
                <span>
                  Add <strong className="text-[#F5F2EB]">{formatPrice(remainingForFreeShippingPKR, currency)}</strong> more for FREE shipping
                </span>
              )}
            </div>
            <div className="w-full h-1.5 bg-[#26262E] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F5F2EB] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#2D2D35]" />
                <p className="text-sm font-semibold text-[#F5F2EB]">Your bag is empty</p>
                <p className="text-xs text-[#8B8A94] max-w-xs">
                  Discover heavyweight hoodies, oversized tees, and contemporary streetwear essentials.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 py-2 px-5 bg-[#F5F2EB] text-[#0A0A0C] text-xs font-bold rounded-lg hover:bg-white transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-[#18181D] rounded-lg border border-[#26262E]"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-[#121214] rounded overflow-hidden shrink-0 border border-[#2D2D35]">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#F5F2EB] truncate">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#8B8A94] hover:text-red-400 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#8B8A94]">
                        <span>Size: <strong className="text-[#F5F2EB]">{item.selectedSize}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <span
                            style={{ backgroundColor: item.selectedColor.hex }}
                            className="w-2 h-2 rounded-full border border-[#2D2D35]"
                          />
                          {item.selectedColor.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#2D2D35] bg-[#121214] rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#8B8A94] hover:text-[#F5F2EB]"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono-nums font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#8B8A94] hover:text-[#F5F2EB]"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-semibold font-mono-nums text-[#F5F2EB]">
                        {formatPrice(item.product.pricePKR * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#26262E] bg-[#18181D] space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyCode} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#8B8A94]" />
                    <input
                      type="text"
                      placeholder="Discount code (try STANDOUT10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full bg-[#121214] border border-[#2D2D35] rounded-md py-1.5 pl-8 pr-2 text-xs text-[#F5F2EB] placeholder:text-[#8B8A94]/60 focus:outline-none focus:border-[#F5F2EB]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#26262E] text-xs font-semibold rounded-md hover:bg-[#32323D] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 pt-1">
                    <span>Applied code: {appliedPromo} (-10%)</span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-xs underline text-[#8B8A94] hover:text-[#F5F2EB]"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-[11px] text-red-400 pt-1">{promoError}</p>
                )}
              </form>

              {/* Subtotal Breakdowns */}
              <div className="space-y-1.5 text-xs text-[#8B8A94] pt-2 border-t border-[#26262E]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono-nums text-[#F5F2EB]">{formatPrice(subtotalPKR, currency)}</span>
                </div>
                {discountPKR > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono-nums">-{formatPrice(discountPKR, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping in Pakistan</span>
                  <span className="font-mono-nums text-[#F5F2EB]">
                    {shippingFeePKR === 0 ? 'FREE' : formatPrice(shippingFeePKR, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#F5F2EB] pt-2 border-t border-[#26262E]">
                  <span>Total Due</span>
                  <span className="font-mono-nums text-base">{formatPrice(totalPKR, currency)}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#F5F2EB] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-white active:scale-[0.99] transition-all cursor-pointer shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-[#8B8A94] font-mono">
                Cash on Delivery (Pakistan) · Orders recorded in demo state
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
