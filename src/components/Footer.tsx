import React, { useState } from 'react';
import { ActivePage } from '../types';
import { Check, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  onOpenTracking?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, onOpenTracking }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0A0A0C] border-t border-[#1E1E24] text-[#8B8A94] text-xs pt-16 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Brand Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-[#1E1E24]">
          <div className="flex items-start gap-3 p-4 bg-[#121214] rounded-lg border border-[#1E1E24]">
            <Truck className="w-5 h-5 text-[#F5F2EB] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#F5F2EB] uppercase tracking-wider">
                Pakistan Domestic COD & Express Worldwide
              </h4>
              <p className="text-[11px] text-[#8B8A94] mt-1 leading-relaxed">
                Fast doorstep courier dispatch across Pakistan via TCS & Trax with zero-advance Cash on Delivery. Global express via DHL.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-[#121214] rounded-lg border border-[#1E1E24]">
            <ShieldCheck className="w-5 h-5 text-[#F5F2EB] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#F5F2EB] uppercase tracking-wider">
                Heavyweight Pakistani Cotton
              </h4>
              <p className="text-[11px] text-[#8B8A94] mt-1 leading-relaxed">
                Custom-milled 300–460 GSM organic long-staple cotton with architectural drape and pre-shrunk resilience.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-[#121214] rounded-lg border border-[#1E1E24]">
            <RefreshCw className="w-5 h-5 text-[#F5F2EB] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#F5F2EB] uppercase tracking-wider">
                14-Day Doorstep Exchanges
              </h4>
              <p className="text-[11px] text-[#8B8A94] mt-1 leading-relaxed">
                Simple size exchanges across all major cities with doorstep pickup and replacement dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Main 4-Column Navigation Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Manifesto */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-2xl font-extrabold tracking-[0.22em] font-display text-[#F5F2EB] block">
              RIVA
            </span>
            <p className="text-xs text-[#E8E4DB] font-mono tracking-widest uppercase">
              MADE TO STAND OUT
            </p>
            <p className="text-xs text-[#8B8A94] leading-relaxed max-w-sm">
              RIVA is a Pakistan-based streetwear label rooted in brutalist silhouettes, heavy architectural fabrics, and uncompromising cut-and-sew precision, designed for an international stage.
            </p>
            <p className="text-[11px] font-mono text-[#8B8A94]">
              Design Studio: Gulberg III, Lahore, Pakistan<br />
              Logistics Hub: Clifton, Karachi, Pakistan
            </p>
          </div>

          {/* Collections */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#F5F2EB] uppercase tracking-wider">
              Collections
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigateTo('men')} className="hover:text-[#F5F2EB] transition-colors">
                  Men's Streetwear
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('women')} className="hover:text-[#F5F2EB] transition-colors">
                  Women's & Modest
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('kids')} className="hover:text-[#F5F2EB] transition-colors">
                  Kids Streetwear
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('new-arrivals')} className="hover:text-[#F5F2EB] transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop-all')} className="hover:text-[#F5F2EB] transition-colors">
                  Shop All Products
                </button>
              </li>
            </ul>
          </div>

          {/* Client Care & Policies */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#F5F2EB] uppercase tracking-wider">
              Client Care & Policies
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-[#F5F2EB] transition-colors">
                  About Brand & Craft
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#F5F2EB] transition-colors">
                  Contact & Showrooms
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shipping')} className="hover:text-[#F5F2EB] transition-colors">
                  Shipping & COD Rates
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('returns')} className="hover:text-[#F5F2EB] transition-colors">
                  14-Day Exchanges & Returns
                </button>
              </li>
              {onOpenTracking && (
                <li>
                  <button onClick={onOpenTracking} className="hover:text-[#F5F2EB] transition-colors text-emerald-400/90 font-medium">
                    Track Your Order
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => navigateTo('privacy')} className="hover:text-[#F5F2EB] transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('terms')} className="hover:text-[#F5F2EB] transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter & Club */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#F5F2EB] uppercase tracking-wider">
              RIVA Archive Club
            </h4>
            <p className="text-[11px] text-[#8B8A94] leading-relaxed">
              Gain early access to limited heavyweight batch drops, private showroom events in Lahore & Karachi, and editorial lookbooks.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-[#141418] border border-[#26262E] rounded-md py-2 px-3 pr-9 text-xs text-[#F5F2EB] placeholder:text-[#8B8A94]/60 focus:outline-none focus:border-[#F5F2EB]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1 bg-[#26262E] hover:bg-[#34343F] text-[#F5F2EB] rounded transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {newsletterSubscribed && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Welcome to the RIVA Archive. Check your inbox.</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Realistic Disclaimer */}
        <div className="pt-8 border-t border-[#1E1E24] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} RIVA Streetwear. Slogan: MADE TO STAND OUT. Designed in Pakistan.</p>
          <div className="flex items-center gap-4 text-[#8B8A94] font-mono">
            <span>Cash on Delivery (Pakistan)</span>
            <span aria-hidden="true">·</span>
            <span>DHL Global</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400/80">Draft Sample Catalog & Demo COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
