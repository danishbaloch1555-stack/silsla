import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-16 space-y-10 text-[#F5F2EB]">
      <div className="space-y-2 border-b border-[#222227] pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#E8E4DB]">
          Legal & Transparency
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold font-display uppercase tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs md:text-sm text-[#8B8A94]">
          Last revised: March 2026 · Standard e-commerce customer data protection terms.
        </p>
      </div>

      {/* Notice Banner */}
      <div className="p-4 bg-[#1C1A14] border border-[#473B1B] rounded-lg text-amber-300 text-xs">
        <strong className="block uppercase tracking-wider text-[11px] mb-1">
          Editable Legal Policy Placeholder
        </strong>
        <p className="text-amber-200/80">
          This document serves as an editable baseline privacy policy for RIVA e-commerce operations. Please review and tailor with your local legal counsel prior to commercial transactional launches.
        </p>
      </div>

      <div className="space-y-6 text-xs text-[#8B8A94] leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            1. Information We Collect
          </h3>
          <p>
            When you purchase apparel or sign up for our Archive Club at RIVA, we collect the necessary personal data to fulfill orders and provide logistics tracking. This includes your name, shipping address, telephone/WhatsApp number, email address, and order history.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            2. How We Utilize Your Data
          </h3>
          <p>
            Your details are used strictly to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process and dispatch your streetwear orders through domestic (TCS, Trax) or global (DHL) logistics partners.</li>
            <li>Send order confirmation notifications, delivery updates, and tracking details.</li>
            <li>Facilitate customer service queries, size exchanges, and returns.</li>
            <li>Send occasional early-access notifications for new collection releases (only if subscribed).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            3. Third-Party Sharing & Data Security
          </h3>
          <p>
            We never sell, rent, or trade your personal information to third parties. Data is shared exclusively with certified courier logistics partners and secure database infrastructure (e.g. Supabase PostgreSQL) to enable delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-[#F5F2EB] uppercase tracking-wider">
            4. Your Rights & Data Requests
          </h3>
          <p>
            You have the right to request access to the personal data we hold about you, request corrections, or request deletion of your account. For inquiries, email: <span className="font-mono text-[#F5F2EB]">privacy@riva-streetwear.com [EDITABLE]</span>.
          </p>
        </section>
      </div>
    </div>
  );
};
