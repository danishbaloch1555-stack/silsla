import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Package } from 'lucide-react';

export const ReturnsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-16 space-y-10 text-[#F5F2EB]">
      {/* Title */}
      <div className="space-y-2 border-b border-[#222227] pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#E8E4DB]">
          Guarantee & Exchanges
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold font-display uppercase tracking-tight">
          Returns & Exchanges Policy
        </h1>
        <p className="text-xs md:text-sm text-[#8B8A94]">
          14-day hassle-free size exchange and doorstep replacement protocol across Pakistan.
        </p>
      </div>

      {/* Notice Banner */}
      <div className="p-4 bg-[#1C1A14] border border-[#473B1B] rounded-lg text-amber-300 text-xs">
        <strong className="block uppercase tracking-wider text-[11px] mb-1">
          Editable Business Policy Placeholder
        </strong>
        <p className="text-amber-200/80">
          The 14-day exchange timeframe and terms below represent a standard direct-to-consumer apparel policy template. Adjust exchange windows, reverse-pickup courier fees, or store credit terms as suited for your production model.
        </p>
      </div>

      {/* 3 Step Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#151519] border border-[#222227] rounded-xl space-y-2">
          <span className="font-mono text-xs text-[#E8E4DB] block">STEP 01</span>
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            Initiate via WhatsApp
          </h3>
          <p className="text-xs text-[#8B8A94] leading-relaxed">
            Message our concierge within 14 days of delivery. State your Order ID and the preferred size or replacement color.
          </p>
        </div>

        <div className="p-6 bg-[#151519] border border-[#222227] rounded-xl space-y-2">
          <span className="font-mono text-xs text-[#E8E4DB] block">STEP 02</span>
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            Doorstep Reverse Swap
          </h3>
          <p className="text-xs text-[#8B8A94] leading-relaxed">
            In major Pakistan cities, our courier delivers your replacement and collects the original package simultaneously at your doorstep.
          </p>
        </div>

        <div className="p-6 bg-[#151519] border border-[#222227] rounded-xl space-y-2">
          <span className="font-mono text-xs text-[#E8E4DB] block">STEP 03</span>
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            Quality Verification
          </h3>
          <p className="text-xs text-[#8B8A94] leading-relaxed">
            Items are checked at our Lahore hub to ensure tags and unworn condition remain intact.
          </p>
        </div>
      </div>

      {/* Conditions */}
      <div className="space-y-6 pt-4 text-xs text-[#8B8A94] leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            Eligibility Guidelines
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Garments must be entirely unworn, unwashed, and free of fragrance, stains, or deodorant marks.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Original RIVA woven tags, architectural security seals, and dust bags must remain attached.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Initiated within 14 calendar days from the recorded delivery timestamp.</span>
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            Defective or Mis-shipped Pieces
          </h3>
          <p>
            If a garment arrives with a textile flaw or manufacturing defect, RIVA will cover all reverse logistics costs and dispatch an expedited replacement immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            Customer Care Concierge
          </h3>
          <p>
            To begin an exchange, contact: <span className="font-mono text-[#F5F2EB]">returns@riva-streetwear.com [EDITABLE]</span> or WhatsApp <span className="font-mono text-[#F5F2EB]">+92 300 0000000 [EDITABLE]</span>.
          </p>
        </section>
      </div>
    </div>
  );
};
