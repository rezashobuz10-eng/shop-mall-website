import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ArrowRight } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { categories } = useStore();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Top Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Explore genuine products across Bangladesh's most popular departments
          </p>
        </div>
        <Link
          to="/products"
          className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
        >
          <span>All Departments</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid: 2 cols on mobile, 3-4 on tablet, 6 on desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {categories.slice(0, 12).map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="group bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 flex flex-col items-center text-center hover:shadow-xl hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Image Circle Container */}
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-orange-50/50 mb-3 relative flex items-center justify-center p-1 group-hover:bg-orange-100/60 transition-colors">
              <img
                src={category.image}
                alt={category.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80';
                }}
                className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>

            {/* Category Name & Count */}
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-orange-600 line-clamp-1 transition-colors">
              {category.name}
            </h3>
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">
              {category.productCount}+ items
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
