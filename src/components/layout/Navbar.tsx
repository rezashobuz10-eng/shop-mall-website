import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Zap,
  ShieldCheck,
  Flame,
  Sparkles,
  Tag,
  Grid,
  ChevronDown,
  Tv,
  Smartphone,
  Laptop,
  Shirt,
  Smile,
  Home,
  ShoppingBasket,
  Dumbbell,
  ShieldAlert,
  Calculator
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Navbar: React.FC = () => {
  const { categories, currentUser } = useStore();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const location = useLocation();
  const catRef = useRef<HTMLDivElement>(null);

  // Close categories on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Category Icon Resolver
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'electronics':
        return <Tv className="w-4 h-4 text-orange-500" />;
      case 'mobile-phones':
        return <Smartphone className="w-4 h-4 text-blue-500" />;
      case 'computers':
        return <Laptop className="w-4 h-4 text-indigo-500" />;
      case 'mens-fashion':
      case 'womens-fashion':
        return <Shirt className="w-4 h-4 text-pink-500" />;
      case 'beauty':
        return <Smile className="w-4 h-4 text-rose-500" />;
      case 'home-living':
        return <Home className="w-4 h-4 text-amber-500" />;
      case 'grocery':
        return <ShoppingBasket className="w-4 h-4 text-emerald-500" />;
      case 'sports':
        return <Dumbbell className="w-4 h-4 text-teal-500" />;
      default:
        return <Grid className="w-4 h-4 text-slate-400" />;
    }
  };

  const navItems = [
    { label: 'Flash Sale', path: '/products?filter=flash', icon: <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />, badge: 'LIVE' },
    { label: 'Mall', path: '/products?filter=mall', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />, badge: 'GENUINE' },
    { label: 'Best Sellers', path: '/products?filter=bestseller', icon: <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> },
    { label: 'New Arrivals', path: '/products?filter=new', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> },
    { label: 'Deals', path: '/products?filter=deals', icon: <Tag className="w-3.5 h-3.5 text-orange-500" /> },
    { label: 'Electronics', path: '/category/electronics' },
    { label: "Men's Fashion", path: '/category/mens-fashion' },
    { label: "Women's Fashion", path: '/category/womens-fashion' },
    { label: 'Beauty', path: '/category/beauty' },
    { label: 'Home & Living', path: '/category/home-living' },
    { label: 'Grocery', path: '/category/grocery' },
    { label: 'Sports', path: '/category/sports' }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: All Categories Dropdown trigger */}
          <div ref={catRef} className="relative py-2.5">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Grid className="w-4 h-4" />
              <span>All Categories</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  categoriesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Categories Flyout Menu */}
            {categoriesOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="max-h-[380px] overflow-y-auto space-y-0.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        {getCategoryIcon(cat.slug)}
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 group-hover:text-orange-500 font-normal">
                        {cat.productCount}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Center Links List */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 text-xs font-semibold text-slate-600">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname + location.search === item.path ||
                    location.pathname === item.path;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-orange-600 bg-orange-50 font-bold'
                      : 'hover:text-orange-600 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-orange-500 text-white uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Super Admin Control Panel Entry (Only visible to authenticated Admin) */}
            {currentUser?.role === 'admin' && (
              <Link
                to="/admin"
                id="navbar-admin-private-link"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg whitespace-nowrap transition-all font-bold text-xs bg-slate-900 text-amber-400 hover:bg-slate-800 border border-slate-800 ml-1 shadow-2xs"
                title="Admin Control Panel & Management"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
