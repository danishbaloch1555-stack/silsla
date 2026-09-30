import React from 'react';
import { Truck, Globe, Clock, ShieldCheck, CheckCircle } from 'lucide-react';

export const ShippingView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-16 space-y-10 text-[#F5F2EB]">
      {/* Title */}
      <div className="space-y-2 border-b border-[#222227] pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#E8E4DB]">
          Logistics & Fulfillment
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold font-display uppercase tracking-tight">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs md:text-sm text-[#8B8A94]">
          Comprehensive guide on domestic Pakistan Cash on Delivery and international express air freight.
        </p>
      </div>

      {/* Editable Placeholder Notice */}
      <div className="p-4 bg-[#1C1A14] border border-[#473B1B] rounded-lg text-amber-300 text-xs">
        <strong className="block uppercase tracking-wider text-[11px] mb-1">
          Editable Business Policy Placeholder
        </strong>
        <p className="text-amber-200/80">
          The rates, transit days, and courier partner names below represent standard Pakistan e-commerce operating baselines. Customize brackets and policies to match your specific logistics contracts upon go-live.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-[#151519] border border-[#222227] rounded-xl space-y-3">
          <Truck className="w-6 h-6 text-[#F5F2EB]" />
          <h3 className="text-base font-bold font-display uppercase tracking-wider">
            Pakistan Domestic Delivery
          </h3>
          <ul className="text-xs text-[#8B8A94] space-y-2">
            <li>• <strong>Major Cities (Karachi, Lahore, Islamabad, Rawalpindi):</strong> 2–3 business days</li>
            <li>• <strong>Other Cities & Regional Towns:</strong> 3–4 business days</li>
            <li>• <strong>Courier Partners:</strong> TCS, Trax Logistics, Call Courier</li>
            <li>• <strong>Shipping Fee:</strong> PKR 250 flat rate; <span className="text-[#F5F2EB] font-bold">FREE on all orders above PKR 7,500</span></li>
            <li>• <strong>Cash on Delivery:</strong> Available nationwide without upfront deposit</li>
          </ul>
        </div>

        <div className="p-6 bg-[#151519] border border-[#222227] rounded-xl space-y-3">
          <Globe className="w-6 h-6 text-[#F5F2EB]" />
          <h3 className="text-base font-bold font-display uppercase tracking-wider">
            International Express Delivery
          </h3>
          <ul className="text-xs text-[#8B8A94] space-y-2">
            <li>• <strong>GCC & Middle East (UAE, Saudi Arabia, Qatar):</strong> 3–5 business days</li>
            <li>• <strong>United Kingdom, Europe, North America:</strong> 4–7 business days</li>
            <li>• <strong>Courier Partners:</strong> DHL Express Worldwide & FedEx International</li>
            <li>• <strong>International Payment:</strong> Credit/Debit card (Visa, Mastercard, Amex)</li>
            <li>• <strong>Customs & Duties:</strong> Subject to local import regulations of destination country</li>
          </ul>
        </div>
      </div>

      {/* Detailed FAQs on Shipping */}
      <div className="space-y-6 pt-4 text-xs text-[#8B8A94] leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            1. Order Verification & Dispatch Protocol
          </h3>
          <p>
            For Cash on Delivery orders, our concierge team may send a brief automated confirmation via WhatsApp or phone call prior to releasing your parcel from our Lahore logistics warehouse. Once confirmed, a tracking number is dispatched to your provided mobile number.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            2. Cash on Delivery (COD) Rules
          </h3>
          <p>
            Please ensure exact cash is kept ready at the delivery address. Courier representatives are unable to open sealed parcels prior to payment collection under Pakistan standard courier operating procedures. If you wish to inspect or exchange after receiving, our 14-day exchange service takes effect immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            3. Parcel Tracking & Inquiries
          </h3>
          <p>
            To track your shipment, enter your tracking consignment number on the TCS or Trax portal, or reach out to our WhatsApp support at <span className="font-mono text-[#F5F2EB]">+92 300 0000000 [EDITABLE]</span> with your RIVA Order ID.
          </p>
        </section>
      </div>
    </div>
  );
};
