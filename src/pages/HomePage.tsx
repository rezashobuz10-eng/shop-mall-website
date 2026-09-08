import React, { useState } from 'react';
import { HeroSlider } from '../components/home/HeroSlider';
import { MobileQuickActions } from '../components/home/MobileQuickActions';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FlashSaleSection } from '../components/home/FlashSaleSection';
import { OfficialMallSection } from '../components/home/OfficialMallSection';
import { PromoBanners } from '../components/home/PromoBanners';
import { RecentlyViewedSection } from '../components/home/RecentlyViewedSection';
import { ProductCard } from '../components/common/ProductCard';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowRight, CheckCircle2, Gift, Star, ShieldCheck, Trophy, Truck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { products, setIsLuckyWheelOpen, setIsTrustScorecardOpen } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'new' | 'discount'>('all');
  const [displayCount, setDisplayCount] = useState(10);

  // Filter recommendations
  const getFilteredProducts = () => {
    let list = [...products];
    if (activeTab === 'popular') {
      list.sort((a, b) => b.soldCount - a.soldCount);
    } else if (activeTab === 'new') {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (activeTab === 'discount') {
      list.sort((a, b) => b.discount - a.discount);
    }
    return list;
  };

  const filteredProducts = getFilteredProducts();
  const visibleProducts = filteredProducts.slice(0, displayCount);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 sm:pb-16">
      {/* 1. Hero Carousel Slider with Touch Gestures */}
      <HeroSlider />

      {/* 2. Mobile App-like Quick Action Bar */}
      <MobileQuickActions />

      {/* 3. Top 12 Categories */}
      <CategoryGrid />

      {/* 3. Flash Sale with 1s Countdown Timer */}
      <FlashSaleSection />

      {/* 4. ShopNexa Official Mall (Walton, Apex, Xiaomi, Aarong) */}
      <OfficialMallSection />

      {/* 5. Promotional Heritage & Tech Banners */}
      <PromoBanners />

      {/* 5.5 Interactive 10/10 Rating & Lucky Spin Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: 10/10 Rating Scorecard Highlight Box */}
          <div
            onClick={() => setIsTrustScorecardOpen(true)}
            className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800 flex flex-col justify-between cursor-pointer hover:border-amber-400/40 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>১০ এ ১০ রেটিং প্ল্যাটফর্ম (10/10 Rating)</span>
                </div>
                <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  পূর্ণাঙ্গ স্কোরকার্ড দেখুন <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                গ্রাহক সন্তুষ্টি ও সেবায় বাংলাদেশের বিশ্বস্ত ১০/১০ প্ল্যাটফর্ম
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-lg leading-relaxed">
                ১২,৫০০+ ভেরিফাইড অর্ডার, ১০০% আসল পণ্যের দ্বিগুণ মানি-ব্যাক গ্যারান্টি এবং সহজ বিকাশ ও ক্যাশ অন ডেলিভারি।
              </p>
            </div>

            {/* Quick Micro-Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-white/10 text-center">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-base sm:text-lg font-black text-amber-400">10 / 10</div>
                <div className="text-[10px] text-slate-300 font-semibold">আসল ব্র্যান্ড গ্যারান্টি</div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-base sm:text-lg font-black text-emerald-400">9.9 / 10</div>
                <div className="text-[10px] text-slate-300 font-semibold">২৪-৪৮ ঘণ্টা ডেলিভারি</div>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-base sm:text-lg font-black text-pink-400">10 / 10</div>
                <div className="text-[10px] text-slate-300 font-semibold">বিকাশ ও পেমেন্ট নিরাপত্তা</div>
              </div>
            </div>
          </div>

          {/* Right: Gamified Lucky Wheel Spin Trigger Banner */}
          <div
            onClick={() => setIsLuckyWheelOpen(true)}
            className="lg:col-span-5 bg-gradient-to-br from-orange-600 via-amber-500 to-rose-600 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between cursor-pointer hover:shadow-orange-500/20 transition-all group relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-black uppercase mb-3">
                <Gift className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
                <span>Spin & Win Instant Discount</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                আজকের লাকি হুইল ঘুরিয়ে জিতে নিন ৳৫০০ ভাউচার!
              </h3>
              <p className="text-xs text-white/90 mt-1.5 leading-relaxed">
                প্রতিদিন পান বিনামূল্যে ২ বার স্পিন করার সুযোগ। ফ্ল্যাট ক্যাশব্যাক, ফ্রি ডেলিভারি ও আকর্ষণীয় কুপন কোড জিতুন।
              </p>
            </div>

            <div className="relative z-10 pt-4 flex items-center justify-between">
              <span className="text-xs font-black bg-white text-orange-600 px-4 py-2 rounded-xl shadow-md group-hover:scale-105 transition-transform flex items-center gap-1.5">
                <Gift className="w-4 h-4" />
                <span>এখনই স্পিন করুন</span>
              </span>
              <span className="text-[11px] font-bold text-white/80">
                ফ্রি স্পিন অবশিষ্ট: ২ বার
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Just For You / Personalized Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Just For You
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Curated daily recommendations tailored to popular trends in Bangladesh
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'All Picks' },
              { id: 'popular', label: 'Most Popular' },
              { id: 'new', label: 'New Arrivals' },
              { id: 'discount', label: 'Biggest Savings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        {displayCount < filteredProducts.length && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setDisplayCount((prev) => prev + 10)}
              className="px-8 py-3 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/40 text-slate-800 hover:text-orange-600 text-xs sm:text-sm font-bold shadow-xs transition-all"
            >
              Load More Products ({filteredProducts.length - displayCount} remaining)
            </button>
          </div>
        )}
      </section>

      {/* 7. Recently Viewed Products (if any) */}
      <RecentlyViewedSection />
    </div>
  );
};
