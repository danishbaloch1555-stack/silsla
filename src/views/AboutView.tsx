import React from 'react';
import { ActivePage } from '../types';
import { 
  heroCampaignImg, 
  menLookbookImg, 
  womenLookbookImg 
} from '../data/products';
import { ArrowRight, Sparkles, ShieldCheck, Compass, HeartHandshake } from 'lucide-react';

interface AboutViewProps {
  setActivePage: (page: ActivePage) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setActivePage }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 space-y-16">
      {/* Editorial Title Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#E8E4DB]">
          Manifesto & Heritage
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-display uppercase tracking-tight text-[#F5F2EB] leading-none">
          Made To Stand Out. Engineered in Pakistan.
        </h1>
        <p className="text-sm md:text-base text-[#8B8A94] leading-relaxed pt-2">
          RIVA was founded with a singular conviction: Pakistan possesses the finest cotton, weaving traditions, and garment artisans on earth. It is time for a homegrown brand to lead international streetwear.
        </p>
      </div>

      {/* Hero Visual Asset */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-[#18181D] border border-[#222227]">
        <img
          src={heroCampaignImg}
          alt="RIVA Architectural Streetwear Atelier"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-[#E8E4DB]">
          <span>CAMPAIGN 01 // BRUTALIST ROOTS</span>
          <span>LAHORE · KARACHI · GLOBAL</span>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <div className="p-6 bg-[#151519] rounded-xl border border-[#222227] space-y-3">
          <Sparkles className="w-6 h-6 text-[#F5F2EB]" />
          <h3 className="text-lg font-bold font-display uppercase tracking-tight text-[#F5F2EB]">
            01. Heavyweight Fiber
          </h3>
          <p className="text-xs text-[#8B8A94] leading-relaxed">
            While generic streetwear uses lightweight 180–220 GSM fabrics, RIVA establishes an uncompromising 300 to 460 GSM standard. Spun from Pakistani long-staple cotton, our textiles possess natural weight, structural drape, and thermal resilience.
          </p>
        </div>

        <div className="p-6 bg-[#151519] rounded-xl border border-[#222227] space-y-3">
          <Compass className="w-6 h-6 text-[#F5F2EB]" />
          <h3 className="text-lg font-bold font-display uppercase tracking-tight text-[#F5F2EB]">
            02. Brutalist Geometry
          </h3>
          <p className="text-xs text-[#8B8A94] leading-relaxed">
            Our patterns eliminate gratuitous decoration in favor of structural lines: exaggerated drop shoulders, double-needle clean collars, raw edge coverstitching, and boxy proportions that sit perfectly over sneakers.
          </p>
        </div>

        <div className="p-6 bg-[#151519] rounded-xl border border-[#222227] space-y-3">
          <HeartHandshake className="w-6 h-6 text-[#F5F2EB]" />
          <h3 className="text-lg font-bold font-display uppercase tracking-tight text-[#F5F2EB]">
            03. Ethical Cut & Sew
          </h3>
          <p className="text-xs text-[#8B8A94] leading-relaxed">
            Every garment is tailored in our partner ateliers in Lahore and Faisalabad. We ensure living wages, clean safe working conditions, pre-wash shrinkage testing, and strict zero-child-labor policies.
          </p>
        </div>
      </div>

      {/* Split Section: Fabric Craft */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E8E4DB]">
            Textile Innovation
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-tight text-[#F5F2EB]">
            Custom Loopback French Terry
          </h2>
          <p className="text-xs md:text-sm text-[#8B8A94] leading-relaxed">
            Unlike cheap polyester-fleece blends that pill after two washes, RIVA mills 100% natural organic cotton terry. The interior loop structure breathes in warm climates while trapping heat in cold seasons.
          </p>
          <ul className="space-y-2 text-xs text-[#8B8A94] pt-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5F2EB]" />
              <span>460 GSM Heavyweight Hoodies & Crewnecks</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5F2EB]" />
              <span>300 GSM Dense Single Jersey Oversized Tees</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5F2EB]" />
              <span>Custom Reactive Dyeing in Monochromatic Earth Pigments</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5F2EB]" />
              <span>Pre-washed to eliminate post-purchase shrinkage</span>
            </li>
          </ul>

          <div className="pt-4">
            <button
              onClick={() => {
                setActivePage('shop-all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 py-3 px-6 bg-[#F5F2EB] text-[#0A0A0C] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white transition-colors"
            >
              <span>Explore The Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#18181D] border border-[#222227]">
            <img
              src={menLookbookImg}
              alt="Heavyweight drop shoulder craftsmanship"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#18181D] border border-[#222227]">
            <img
              src={womenLookbookImg}
              alt="Contemporary modest streetwear silhouette"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
