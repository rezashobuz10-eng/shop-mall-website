import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight, Store, Star } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';

export const OfficialMallSection: React.FC = () => {
  const { sellers, products } = useStore();
  const mallProducts = products.filter((p) => p.isMall).slice(0, 5);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-amber-300 flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                ShopNexa Mall
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-900 text-amber-300 uppercase">
                100% Genuine
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Direct from flagship brand outlets with official manufacturer warranty
            </p>
          </div>
        </div>

        <Link
          to="/products?filter=mall"
          className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
        >
          <span>Explore All Mall Brands</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Flagship Stores Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {sellers.slice(0, 4).map((seller) => (
          <Link
            key={seller.id}
            to={`/store/${seller.id}`}
            className="group bg-white rounded-2xl border border-slate-200/80 p-4 hover:border-orange-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={seller.logo}
                alt={seller.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-100 p-0.5 shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {seller.name}
                  </h3>
                  {seller.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate">{seller.location}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {seller.rating} Rating
              </span>
              <span className="text-orange-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Visit Store &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured Mall Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {mallProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
