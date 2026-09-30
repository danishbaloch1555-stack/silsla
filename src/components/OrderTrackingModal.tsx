import React, { useState } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck, AlertCircle, X, ArrowRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { formatPKR } from '../utils/currency';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
  initialGuestToken?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber = '',
  initialGuestToken = '',
}) => {
  const { trackOrder } = useAdmin();
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [guestToken, setGuestToken] = useState(initialGuestToken);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await trackOrder(orderNumber.trim(), guestToken.trim());
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res.error || 'Order not found. Please verify the order number and tracking token.');
      }
    } catch (err: any) {
      setError(err.message || 'Error tracking order.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return { label: 'Delivered', color: 'bg-emerald-950 border-emerald-800 text-emerald-300' };
      case 'dispatched':
        return { label: 'Dispatched via Courier', color: 'bg-blue-950 border-blue-800 text-blue-300' };
      case 'packed':
        return { label: 'Packed & Staged', color: 'bg-amber-950 border-amber-800 text-amber-300' };
      default:
        return { label: 'Pending Verification', color: 'bg-zinc-800 border-zinc-700 text-zinc-300' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#121215] border border-[#26262E] rounded-2xl shadow-2xl p-6 text-[#F5F2EB] relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-[#8B8A94] hover:text-[#F5F2EB] rounded-lg hover:bg-[#1C1C22] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
            <Package className="w-4 h-4" />
            <span>RIVA Logistics Tracking</span>
          </div>
          <h3 className="text-xl font-bold font-display uppercase tracking-wide">
            Track Your Order
          </h3>
          <p className="text-xs text-[#8B8A94]">
            Enter your RIVA order number and optional private guest tracking token to inspect live dispatch status.
          </p>
        </div>

        <form onSubmit={handleTrack} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#8B8A94] uppercase tracking-wider mb-1">
              Order Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. RIVA-94821"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full bg-[#18181D] border border-[#2D2D35] rounded-lg py-2.5 px-3 text-xs text-[#F5F2EB] placeholder:text-[#8B8A94]/50 focus:outline-none focus:border-[#F5F2EB]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8B8A94] uppercase tracking-wider mb-1">
              Guest Tracking Token (Optional)
            </label>
            <input
              type="text"
              placeholder="From your order confirmation screen"
              value={guestToken}
              onChange={(e) => setGuestToken(e.target.value)}
              className="w-full bg-[#18181D] border border-[#2D2D35] rounded-lg py-2.5 px-3 text-xs text-[#F5F2EB] placeholder:text-[#8B8A94]/50 focus:outline-none focus:border-[#F5F2EB]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#F5F2EB] text-[#0A0A0C] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Verifying with Database...' : 'Track Package'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-900 rounded-lg text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && result.order && (
          <div className="p-4 bg-[#18181D] border border-[#26262E] rounded-xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#26262E]">
              <div>
                <span className="text-[10px] text-[#8B8A94] font-mono block">ORDER NUMBER</span>
                <span className="text-sm font-bold font-mono text-[#F5F2EB]">
                  {result.order.order_number || result.order.orderNumber}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border font-semibold ${
                  getStatusBadge(result.order.status).color
                }`}
              >
                {getStatusBadge(result.order.status).label}
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
              <div className={`p-2 rounded border ${result.order.status ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-[#141418] border-[#222227] text-[#8B8A94]'}`}>
                <CheckCircle2 className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-400" />
                <span>Verified</span>
              </div>
              <div className={`p-2 rounded border ${['packed', 'dispatched', 'delivered'].includes(result.order.status) ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-[#141418] border-[#222227] text-[#8B8A94]'}`}>
                <Package className="w-3.5 h-3.5 mx-auto mb-1" />
                <span>Packed</span>
              </div>
              <div className={`p-2 rounded border ${['dispatched', 'delivered'].includes(result.order.status) ? 'bg-blue-950/40 border-blue-800 text-blue-300' : 'bg-[#141418] border-[#222227] text-[#8B8A94]'}`}>
                <Truck className="w-3.5 h-3.5 mx-auto mb-1" />
                <span>Dispatched</span>
              </div>
              <div className={`p-2 rounded border ${result.order.status === 'delivered' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-[#141418] border-[#222227] text-[#8B8A94]'}`}>
                <Clock className="w-3.5 h-3.5 mx-auto mb-1" />
                <span>Delivered</span>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#8B8A94]">
                <span>Destination:</span>
                <span className="text-[#F5F2EB] font-medium">
                  {result.order.customer_city || result.order.customer?.city || 'Pakistan'}
                </span>
              </div>
              <div className="flex justify-between text-[#8B8A94]">
                <span>Payment Method:</span>
                <span className="text-[#F5F2EB] font-mono uppercase">
                  {(result.order.payment_method || result.order.paymentMethod) === 'cod' ? 'Cash on Delivery (PKR)' : 'Verified'}
                </span>
              </div>
              <div className="flex justify-between text-[#8B8A94]">
                <span>Order Total:</span>
                <span className="text-[#F5F2EB] font-bold font-mono">
                  {formatPKR(Number(result.order.total_pkr || result.order.totalPKR || 0))}
                </span>
              </div>
            </div>

            {/* Items Summary */}
            {result.items && result.items.length > 0 && (
              <div className="pt-3 border-t border-[#26262E] space-y-1.5">
                <span className="text-[10px] text-[#8B8A94] uppercase tracking-wider block font-semibold">
                  Items ({result.items.length})
                </span>
                <div className="space-y-1">
                  {result.items.map((it: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-[11px] text-[#8B8A94]">
                      <span className="truncate pr-2">
                        {it.product_title || it.product?.title || 'Product'} ({it.selected_size || it.selectedSize}) × {it.quantity}
                      </span>
                      <span className="font-mono text-[#F5F2EB] shrink-0">
                        {formatPKR(Number(it.total_price_pkr || it.unit_price_pkr * it.quantity || 0))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
