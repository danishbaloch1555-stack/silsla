import React from 'react';
import { ActivePage, Product } from '../types';
import { useAdmin } from '../context/AdminContext';
import { ProductCard } from '../components/ProductCard';
import { 
  heroCampaignImg, 
  menLookbookImg, 
  womenLookbookImg, 
  kidsLookbookImg 
} from '../data/products';
import { ArrowRight, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface HomeViewProps {
  setActivePage: (page: ActivePage) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setActivePage, onSelectProduct }) => {
  const { products } = useAdmin();

  // Featured sample products
  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);

  return (
    <div className="w-full space-y-16 md:space-y-24">
      {/* ================= HERO CAMPAIGN SECTION ================= */}
      <section className="relative w-full min-h-[75vh] md:min-h-[85vh] flex items-end overflow-hidden bg-[#0A0A0C]">
        {/* Cinematic Backdrop Image */}
        <div className="absolute inset-0">
          <img
            src={heroCampaignImg}
            alt="RIVA Streetwear Campaign - Made To Stand Out"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08] transition-transform duration-1000 ease-out"
          />
          {/* Measured Contrast Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/50 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 w-full flex flex-col justify-end">
          <div className="max-w-2xl space-y-4">
            {/* Slogan Kicker */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#E8E4DB] uppercase">
              <span className="w-6 h-px bg-[#E8E4DB]" />
              <span>MADE TO STAND OUT</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-[#F5F2EB] uppercase leading-[0.95]">
              Heavyweight Streetwear. Engineered in Pakistan.
            </h1>

            {/* Editorial Subtext */}
            <p className="text-sm md:text-base text-[#D4D1C7] leading-relaxed max-w-xl">
              Custom-milled 380–460 GSM organic cotton essentials crafted for an international silhouette. Boxy drape, pre-shrunk resilience, and architectural precision.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => {
                  setActivePage('men');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-3 px-6 bg-[#F5F2EB] text-[#0A0A0C] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white active:scale-95 transition-all shadow-xl"
              >
                Shop Men
              </button>
              <button
                onClick={() => {
                  setActivePage('women');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-3 px-6 bg-[#18181D]/90 backdrop-blur-md border border-[#3A3A46] text-[#F5F2EB] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#25252E] hover:border-[#F5F2EB] active:scale-95 transition-all"
              >
                Shop Women
              </button>
              <button
                onClick={() => {
                  setActivePage('kids');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-3 px-6 bg-[#18181D]/90 backdrop-blur-md border border-[#3A3A46] text-[#F5F2EB] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#25252E] hover:border-[#F5F2EB] active:scale-95 transition-all"
              >
                Shop Kids
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3 CURATED COLLECTION GATEWAYS ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#222227]">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#8B8A94]">Collections</span>
            <h2 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-tight text-[#F5F2EB] mt-1">
              Curated Universes
            </h2>
          </div>
          <button
            onClick={() => setActivePage('shop-all')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#8B8A94] hover:text-[#F5F2EB] transition-colors group"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Men */}
          <div
            onClick={() => {
              setActivePage('men');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-[#18181D] border border-[#26262E] cursor-pointer"
          >
            <img
              src={menLookbookImg}
              alt="RIVA Men Collection"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 flex flex-col justify-end">
              <span className="text-xs font-mono text-[#8B8A94] uppercase tracking-wider">01. Collection</span>
              <h3 className="text-2xl font-bold font-display text-[#F5F2EB] uppercase tracking-tight mt-0.5">
                Men
              </h3>
              <p className="text-xs text-[#8B8A94] mt-1 line-clamp-2">
                Oversized heavyweight hoodies, 300 GSM tees, utility joggers & matching fleece sets.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#F5F2EB] group-hover:text-white">
                <span>Explore Men</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: Women */}
          <div
            onClick={() => {
              setActivePage('women');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-[#18181D] border border-[#26262E] cursor-pointer"
          >
            <img
              src={womenLookbookImg}
              alt="RIVA Women Collection"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 flex flex-col justify-end">
              <span className="text-xs font-mono text-[#8B8A94] uppercase tracking-wider">02. Collection</span>
              <h3 className="text-2xl font-bold font-display text-[#F5F2EB] uppercase tracking-tight mt-0.5">
                Women
              </h3>
              <p className="text-xs text-[#8B8A94] mt-1 line-clamp-2">
                Sculptural boxy tops, cocoon drop-shoulder hoodies, tailored cargos & modest dusters.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#F5F2EB] group-hover:text-white">
                <span>Explore Women</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 3: Kids */}
          <div
            onClick={() => {
              setActivePage('kids');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-[#18181D] border border-[#26262E] cursor-pointer"
          >
            <img
              src={kidsLookbookImg}
              alt="RIVA Kids Streetwear Collection"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 flex flex-col justify-end">
              <span className="text-xs font-mono text-[#8B8A94] uppercase tracking-wider">03. Collection</span>
              <h3 className="text-2xl font-bold font-display text-[#F5F2EB] uppercase tracking-tight mt-0.5">
                Kids
              </h3>
              <p className="text-xs text-[#8B8A94] mt-1 line-clamp-2">
                Scaled-down architectural streetwear essentials with age-appropriate cord safety & reinforced knees.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#F5F2EB] group-hover:text-white">
                <span>Discover Kids</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS GRID ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#222227]">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#8B8A94]">Sample Catalog</span>
            <h2 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-tight text-[#F5F2EB] mt-1">
              Featured Silhouettes
            </h2>
          </div>
          <button
            onClick={() => setActivePage('shop-all')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#8B8A94] hover:text-[#F5F2EB] transition-colors group"
          >
            <span>Shop All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3-column desktop grid with generous gap */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* ================= BRAND MANIFESTO & STORY ================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative rounded-2xl bg-[#151519] border border-[#222227] p-8 md:p-14 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#E8E4DB]">
                The RIVA Ethos · Designed in Pakistan
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-display uppercase tracking-tight text-[#F5F2EB]">
                Heavyweight Foundations. Made To Stand Out.
              </h2>
              <p className="text-sm text-[#8B8A94] leading-relaxed">
                Pakistan has long been the manufacturing backbone behind the world's most revered luxury labels. RIVA reclaims that heritage with an unapologetic homegrown brand designed for global runways.
              </p>
              <p className="text-sm text-[#8B8A94] leading-relaxed">
                Every hoodie, tee, and matching set begins with custom-spun Pakistani long-staple cotton, milled to heavy 300–460 GSM standards in Lahore and Faisalabad. No hollow synthetic blends, no fragile seams, and no fast-fashion shortcuts.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setActivePage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="py-3 px-6 bg-[#F5F2EB] text-[#0A0A0C] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white transition-all shadow-md"
                >
                  Read Our Full Story
                </button>
                <button
                  onClick={() => {
                    setActivePage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="py-3 px-6 bg-[#1F1F26] border border-[#2E2E38] text-[#F5F2EB] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#282833] transition-all"
                >
                  Visit Showroom
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#18181D] rounded-lg border border-[#26262E] space-y-1">
                <Layers className="w-5 h-5 text-[#F5F2EB]" />
                <h4 className="text-sm font-bold text-[#F5F2EB]">460 GSM Fleece</h4>
                <p className="text-[11px] text-[#8B8A94]">Signature organic loopback terry cotton for sculptural boxy shape.</p>
              </div>

              <div className="p-4 bg-[#18181D] rounded-lg border border-[#26262E] space-y-1">
                <Sparkles className="w-5 h-5 text-[#F5F2EB]" />
                <h4 className="text-sm font-bold text-[#F5F2EB]">Drop-Shoulder Cut</h4>
                <p className="text-[11px] text-[#8B8A94]">Engineered brutalist streetwear proportions for effortless posture.</p>
              </div>

              <div className="p-4 bg-[#18181D] rounded-lg border border-[#26262E] space-y-1">
                <ShieldCheck className="w-5 h-5 text-[#F5F2EB]" />
                <h4 className="text-sm font-bold text-[#F5F2EB]">Pre-Shrunk Cotton</h4>
                <p className="text-[11px] text-[#8B8A94]">Enzyme washed to ensure permanent shape wash after wash.</p>
              </div>

              <div className="p-4 bg-[#18181D] rounded-lg border border-[#26262E] space-y-1">
                <span className="text-xs font-mono font-bold text-[#F5F2EB] block">COD</span>
                <h4 className="text-sm font-bold text-[#F5F2EB]">Pakistan Delivery</h4>
                <p className="text-[11px] text-[#8B8A94]">Nationwide Cash on Delivery via TCS/Trax in 2-4 business days.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
