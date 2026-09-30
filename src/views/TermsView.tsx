import React from 'react';

export const TermsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-16 space-y-10 text-[#F5F2EB]">
      <div className="space-y-2 border-b border-[#222227] pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#E8E4DB]">
          Legal & Operational Framework
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold font-display uppercase tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs md:text-sm text-[#8B8A94]">
          Last updated: March 2026 · Operational guidelines for RIVA Streetwear.
        </p>
      </div>

      {/* Notice Banner */}
      <div className="p-4 bg-[#1C1A14] border border-[#473B1B] rounded-lg text-amber-300 text-xs">
        <strong className="block uppercase tracking-wider text-[11px] mb-1">
          Editable Legal Policy Placeholder
        </strong>
        <p className="text-amber-200/80">
          This document provides a template framework for customer purchasing terms, cash on delivery rights, intellectual property ownership, and liability disclaimers. Customize company registry details as applicable.
        </p>
      </div>

      <div className="space-y-6 text-xs text-[#8B8A94] leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            1. Brand Identity & Intellectual Property
          </h3>
          <p>
            The RIVA wordmark, slogan "MADE TO STAND OUT", architectural photography, editorial lookbooks, typography selections, and custom product designs are the exclusive intellectual property of RIVA Streetwear. Any unauthorized reproduction, resale, or imitation is prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            2. Orders, Pricing & Sample Status
          </h3>
          <p>
            All listed prices are denominated in Pakistani Rupees (PKR) by default, with illustrative conversions provided for USD, GBP, and AED. In this prototype deployment, items are designated as DRAFT SAMPLES and checkout interactions simulate live processing until connected to an authorized payment acquirer or production backend.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            3. Cash on Delivery (COD) Terms
          </h3>
          <p>
            By placing an order via Cash on Delivery, you commit to accepting delivery and tendering full cash payment to the courier agent upon arrival. Intentional non-receipt or refusal of verified COD shipments may result in future order restrictions.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            4. Limitation of Liability & Inquiries
          </h3>
          <p>
            RIVA is not liable for indirect or consequential damages resulting from third-party courier transit delays. For legal or business inquiries, contact: <span className="font-mono text-[#F5F2EB]">legal@riva-streetwear.com [EDITABLE]</span>.
          </p>
        </section>
      </div>
    </div>
  );
};
