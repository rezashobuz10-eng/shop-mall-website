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
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { products } = useStore();
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
