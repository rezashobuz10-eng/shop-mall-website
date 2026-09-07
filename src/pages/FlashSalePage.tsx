import React, { useState, useEffect } from 'react';
import { Flame, Clock, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';

export const FlashSalePage: React.FC = () => {
  const { products } = useStore();
  const flashProducts = products.filter((p) => p.isFlashSale);

  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 pt-6 pb-24 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-semibold">Flash Sale Deals</span>
        </div>

        {/* Flash Sale Header Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold mb-3">
                <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>LIMITED TIME MEGA DEALS</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
                Flash Sale Crazy Discounts
              </h1>
              <p className="text-white/90 text-xs sm:text-sm max-w-lg">
                Exclusive high-demand products at wholesale discount rates. Limited stocks available per customer.
              </p>
            </div>

            {/* Countdown timer */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
              <span className="text-xs font-bold uppercase tracking-wider block mb-2 text-amber-200">
                Sale Ends In
              </span>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-black/40 rounded-xl flex flex-col items-center justify-center font-mono">
                  <span className="text-lg font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[9px] text-slate-300">HOURS</span>
                </div>
                <span className="text-xl font-bold">:</span>
                <div className="w-12 h-12 bg-black/40 rounded-xl flex flex-col items-center justify-center font-mono">
                  <span className="text-lg font-black">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-slate-300">MINS</span>
                </div>
                <span className="text-xl font-bold">:</span>
                <div className="w-12 h-12 bg-black/40 rounded-xl flex flex-col items-center justify-center font-mono">
                  <span className="text-lg font-black text-amber-300">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-slate-300">SECS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {flashProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
