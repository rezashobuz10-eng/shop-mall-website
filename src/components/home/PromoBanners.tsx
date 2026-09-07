import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const PromoBanners: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Banner 1: Bangladeshi Artisan & Handloom */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-800 via-orange-900 to-rose-950 p-6 sm:p-8 text-white flex flex-col justify-between min-h-[220px] shadow-lg">
          <div className="relative z-10 max-w-sm">
            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full mb-3 backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Local Heritage Craft
            </span>
            <h3 className="text-xl sm:text-2xl font-black leading-tight mb-2">
              Authentic Jamdani & Tangail Handlooms
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/90 mb-4">
              Direct from master weavers in Rupganj & Tangail. Support local artisans with genuine GI-tagged heritage weave.
            </p>
          </div>
          <div className="relative z-10">
            <Link
              to="/category/womens-fashion"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs rounded-xl transition-all shadow-md"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Banner 2: Electronics & Smart Gadgets */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-8 text-white flex flex-col justify-between min-h-[220px] shadow-lg">
          <div className="relative z-10 max-w-sm">
            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full mb-3 backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-sky-300" />
              Smart Living 2026
            </span>
            <h3 className="text-xl sm:text-2xl font-black leading-tight mb-2">
              Next-Gen Tech & Audio Accessories
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100/90 mb-4">
              ANC earbuds, smartwatches, 4K TVs and gaming gear with official Bangladesh distributor warranty.
            </p>
          </div>
          <div className="relative z-10">
            <Link
              to="/category/electronics"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-xl transition-all shadow-md"
            >
              <span>Upgrade Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
