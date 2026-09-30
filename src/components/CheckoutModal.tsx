import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { formatPrice } from '../utils/currency';
import { Order } from '../types';
import { X, CheckCircle, AlertTriangle, ShieldCheck, ArrowRight, Copy, Check } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Other / International',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose,
}) => {
  const { cart, subtotalPKR, discountPKR, shippingFeePKR, totalPKR, currency, clearCart } = useCart();
  const { createOrder } = useAdmin();

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card_demo'>('cod');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedOrderNumber, setCopiedOrderNumber] = useState(false);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = 'Full Name is required (minimum 3 characters)';
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    if (!cleanPhone) {
      errs.phone = 'Phone number is required for dispatch notification';
    } else if (!/^((\+92)|(0092)|(03))?[0-9]{9,10}$/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid phone number (e.g. 0300 1234567 or +92 300 1234567)';
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'A valid email address is required for order receipts';
    }

    if (!address.trim() || address.trim().length < 8) {
      errs.address = 'Street address & House/Apartment number is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        items: [...cart],
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          city,
          address: address.trim(),
          postalCode: postalCode.trim() || undefined,
          notes: notes.trim() || undefined,
        },
        subtotalPKR,
        shippingFeePKR,
        discountPKR,
        totalPKR,
        paymentMethod,
      });

      setCompletedOrder(order);
      clearCart();
    } catch (err) {
      console.error('Order creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderNumber = () => {
    if (completedOrder) {
      navigator.clipboard.writeText(completedOrder.orderNumber);
      setCopiedOrderNumber(true);
      setTimeout(() => setCopiedOrderNumber(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#121214] border border-[#26262E] rounded-xl text-[#F5F2EB] shadow-2xl overflow-hidden my-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#26262E] bg-[#18181D]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-wider">RIVA</span>
              <span className="text-xs font-mono text-[#8B8A94]">/ CHECKOUT PORTAL</span>
            </div>
            <p className="text-[11px] text-[#8B8A94] mt-0.5">
              Premium Streetwear Logistics · Lahore, Pakistan
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8B8A94] hover:text-[#F5F2EB] hover:bg-[#222227] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DEMO NOTICE BANNER (Strictly complying with prompt requirement) */}
        <div className="px-5 py-3 bg-[#1C1A14] border-b border-[#473B1B] text-amber-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold block uppercase tracking-wide text-[11px]">
              DEMO CASH ON DELIVERY CHECKOUT
            </span>
            <p className="text-[11px] text-amber-200/80">
              Orders placed here are recorded in demo state and synced directly to your browser's persistent storage and the included Admin Dashboard until a live Supabase backend is configured. No real charges or payment will occur.
            </p>
          </div>
        </div>

        {/* Content Body */}
        {completedOrder ? (
          /* ================= ORDER SUCCESS VIEW ================= */
          <div className="p-6 md:p-8 space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 rounded-full">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-[#F5F2EB]">
                Order Confirmed (Demo)
              </h2>
              <p className="text-xs text-[#8B8A94] max-w-md mx-auto">
                Thank you, <strong className="text-[#F5F2EB]">{completedOrder.customer.fullName}</strong>. Your order has been placed via <strong className="text-[#F5F2EB]">Cash on Delivery (Demo)</strong> and recorded in the database.
              </p>
            </div>

            {/* Order receipt box */}
            <div className="p-5 bg-[#18181D] border border-[#26262E] rounded-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#26262E]">
                <div>
                  <span className="text-[10px] text-[#8B8A94] uppercase tracking-wider block">Order Reference</span>
                  <span className="font-mono text-base font-bold text-[#F5F2EB]">
                    {completedOrder.orderNumber}
                  </span>
                  {completedOrder.guestToken && (
                    <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">
                      Tracking Token: {completedOrder.guestToken.slice(0, 18)}...
                    </span>
                  )}
                </div>
                <button
                  onClick={handleCopyOrderNumber}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#222227] hover:bg-[#2D2D35] border border-[#32323D] text-xs font-mono rounded text-[#F5F2EB] transition-colors"
                >
                  {copiedOrderNumber ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Ref</span>
                    </>
                  )}
                </button>
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#8B8A94] block text-[11px] mb-1">Delivery Address:</span>
                  <p className="text-[#F5F2EB] font-medium leading-relaxed">
                    {completedOrder.customer.address}, {completedOrder.customer.city}
                    {completedOrder.customer.postalCode ? ` - ${completedOrder.customer.postalCode}` : ''}
                  </p>
                  <p className="text-[#8B8A94] text-[11px] mt-1">Phone: {completedOrder.customer.phone}</p>
                </div>
                <div>
                  <span className="text-[#8B8A94] block text-[11px] mb-1">Payment Method:</span>
                  <p className="text-[#F5F2EB] font-medium">Cash on Delivery (Pay upon delivery)</p>
                  <p className="text-[#8B8A94] text-[11px] mt-1">
                    Delivery Estimate: 2-4 business days (TCS / Trax Express)
                  </p>
                </div>
              </div>

              {/* Items summary */}
              <div className="pt-3 border-t border-[#26262E] space-y-2">
                <span className="text-[11px] text-[#8B8A94] uppercase tracking-wider block">Ordered Items:</span>
                {completedOrder.items.map((it) => (
                  <div key={it.id} className="flex justify-between text-xs">
                    <span className="text-[#F5F2EB]">
                      {it.quantity}× {it.product.title} ({it.selectedSize} · {it.selectedColor.name})
                    </span>
                    <span className="font-mono-nums text-[#8B8A94]">
                      {formatPrice(it.product.pricePKR * it.quantity, currency)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold text-[#F5F2EB] pt-2 border-t border-[#26262E]">
                  <span>Total Payable:</span>
                  <span className="font-mono-nums">{formatPrice(completedOrder.totalPKR, currency)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-[#F5F2EB] text-[#0A0A0C] text-xs font-bold rounded-lg hover:bg-white transition-colors"
              >
                Continue Browsing RIVA
              </button>
            </div>
          </div>
        ) : (
          /* ================= CHECKOUT FORM ================= */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Customer Form */}
              <div className="md:col-span-7 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B8A94]">
                  1. Shipping Information (Pakistan)
                </h3>

                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-[#F5F2EB] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Danish Baloch"
                    className={`w-full bg-[#18181D] border rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none transition-colors ${
                      errors.fullName ? 'border-red-500' : 'border-[#2D2D35] focus:border-[#F5F2EB]'
                    }`}
                  />
                  {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#F5F2EB] mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300 1234567"
                      className={`w-full bg-[#18181D] border rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-[#2D2D35] focus:border-[#F5F2EB]'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#F5F2EB] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className={`w-full bg-[#18181D] border rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none transition-colors ${
                        errors.email ? 'border-red-500' : 'border-[#2D2D35] focus:border-[#F5F2EB]'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* City & Postal Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#F5F2EB] mb-1">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#18181D] border border-[#2D2D35] rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB]"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c} className="bg-[#18181D] text-[#F5F2EB]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#F5F2EB] mb-1">
                      Postal Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 54000"
                      className="w-full bg-[#18181D] border border-[#2D2D35] rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB]"
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-medium text-[#F5F2EB] mb-1">
                    Complete Street Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Apartment #, Street, Sector/Phase, Nearest Landmark"
                    className={`w-full bg-[#18181D] border rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none transition-colors ${
                      errors.address ? 'border-red-500' : 'border-[#2D2D35] focus:border-[#F5F2EB]'
                    }`}
                  />
                  {errors.address && <p className="text-[11px] text-red-400 mt-1">{errors.address}</p>}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-[#8B8A94] mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call before arrival, leave with security guard"
                    className="w-full bg-[#18181D] border border-[#2D2D35] rounded-md py-2 px-3 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#F5F2EB]"
                  />
                </div>

                {/* Payment Method Selector */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B8A94] mb-2">
                    2. Payment Method
                  </h3>
                  <div className="space-y-2">
                    <label
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        paymentMethod === 'cod'
                          ? 'border-[#F5F2EB] bg-[#1C1C22]'
                          : 'border-[#2D2D35] bg-[#18181D]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="text-[#F5F2EB] focus:ring-0"
                        />
                        <div>
                          <span className="text-xs font-semibold text-[#F5F2EB] block">
                            Cash on Delivery (Pakistan Standard)
                          </span>
                          <span className="text-[11px] text-[#8B8A94]">
                            Pay cash to the courier agent when your parcel arrives.
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                        RECOMMENDED
                      </span>
                    </label>

                    <label
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        paymentMethod === 'card_demo'
                          ? 'border-[#F5F2EB] bg-[#1C1C22]'
                          : 'border-[#2D2D35] bg-[#18181D]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'card_demo'}
                          onChange={() => setPaymentMethod('card_demo')}
                          className="text-[#F5F2EB] focus:ring-0"
                        />
                        <div>
                          <span className="text-xs font-semibold text-[#F5F2EB] block">
                            Credit / Debit Card (Online Demo Mode)
                          </span>
                          <span className="text-[11px] text-[#8B8A94]">
                            Pre-configured gateway simulation (no charge).
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-[#8B8A94] bg-[#222227] px-2 py-0.5 rounded border border-[#2D2D35]">
                        DEMO GATEWAY
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="md:col-span-5 bg-[#18181D] p-5 rounded-lg border border-[#26262E] flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8B8A94] pb-2 border-b border-[#26262E]">
                    Order Summary ({cart.length} items)
                  </h3>

                  <div className="max-h-56 overflow-y-auto divide-y divide-[#222227] my-3">
                    {cart.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="pr-2 min-w-0">
                          <p className="font-medium text-[#F5F2EB] truncate">{item.product.title}</p>
                          <p className="text-[10px] text-[#8B8A94]">
                            {item.quantity}× · {item.selectedSize} · {item.selectedColor.name}
                          </p>
                        </div>
                        <span className="font-mono-nums text-[#F5F2EB] shrink-0">
                          {formatPrice(item.product.pricePKR * item.quantity, currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-1.5 pt-3 border-t border-[#26262E] text-xs text-[#8B8A94]">
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
                      <span>Shipping (Pakistan)</span>
                      <span className="font-mono-nums text-[#F5F2EB]">
                        {shippingFeePKR === 0 ? 'FREE' : formatPrice(shippingFeePKR, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#F5F2EB] pt-2 border-t border-[#26262E]">
                      <span>Total Amount:</span>
                      <span className="font-mono-nums text-base">{formatPrice(totalPKR, currency)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#26262E]">
                  <button
                    type="submit"
                    disabled={isSubmitting || cart.length === 0}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#F5F2EB] text-[#0A0A0C] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-white active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer shadow-lg"
                  >
                    <span>{isSubmitting ? 'Confirming Demo Order...' : 'Confirm Demo Order'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-[#8B8A94]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Demo mode enabled · Order recorded in local storage & admin</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
