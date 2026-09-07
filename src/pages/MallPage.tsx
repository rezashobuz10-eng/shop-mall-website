import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, RotateCcw, Truck, CheckCircle2, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';

export const MallPage: React.FC = () => {
  const { products, sellers } = useStore();
  const mallProducts = products.filter((p) => p.isMall);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 sm:pb-16">
      {/* Mall Hero Banner */}
      <div className="bg-gradient-to-r from-red-900 via-slate-900 to-red-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold mb-3">
              <Award className="w-4 h-4 text-red-400" />
              <span>100% Authentic Brand Guarantee</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
              ShopNexa <span className="text-red-500">MALL</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Discover official flagship stores, direct manufacturer warranties, and hassle-free 14-day returns on premium products across Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <ShieldCheck className="w-6 h-6 text-red-400 mx-auto mb-1.5" />
              <h4 className="font-bold text-xs">100% Genuine</h4>
              <p className="text-[10px] text-slate-400">Or 2x money back</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <RotateCcw className="w-6 h-6 text-red-400 mx-auto mb-1.5" />
              <h4 className="font-bold text-xs">14 Days Return</h4>
              <p className="text-[10px] text-slate-400">Hassle-free doorstep</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Truck className="w-6 h-6 text-red-400 mx-auto mb-1.5" />
              <h4 className="font-bold text-xs">Express Delivery</h4>
              <p className="text-[10px] text-slate-400">Dhaka & Ctg fast</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Flagship Brand Cards */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Official Flagship Partners
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {sellers.map((s) => (
              <Link
                key={s.id}
                to={`/seller/${s.id}`}
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:border-red-200 hover:shadow-xs text-center transition-all group"
              >
                <img
                  src={s.logo}
                  alt={s.name}
                  className="w-12 h-12 rounded-xl object-cover mx-auto mb-2 border border-slate-200"
                />
                <h4 className="font-bold text-xs text-slate-800 group-hover:text-red-600 truncate">
                  {s.name}
                </h4>
                <span className="text-[10px] text-emerald-600 font-semibold block">● Flagship</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mall Products Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Official Mall Collections</h2>
              <p className="text-xs text-slate-500">Curated certified original inventory</p>
            </div>
            <span className="text-xs font-bold text-slate-400">{mallProducts.length} items</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {mallProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
