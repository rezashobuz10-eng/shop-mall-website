import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Zap,
  ShieldCheck,
  Flame,
  Sparkles,
  Store,
  ShieldAlert,
  User,
  Heart,
  Package,
  LogOut,
  ChevronRight,
  Truck,
  HelpCircle,
  PhoneCall,
  Grid
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useStore } from '../../context/StoreContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { categories, currentUser, logout } = useStore();

  // Prevent background scroll and listen to ESC key
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <Logo size="sm" />
          <button
            onClick={onClose}
            id="mobile-drawer-close-btn"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Quick Info */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-orange-500/20"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold bg-orange-100 text-orange-700 uppercase">
                  {currentUser.role} Account
                </span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Welcome to ShopNexa! Sign in for the best deals.
              </p>
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-orange-600 text-white shadow-xs hover:bg-orange-500 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="flex-1 py-2 text-center text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Links Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Quick Features & Highlights */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Featured Services
            </h4>
            <div className="space-y-1">
              <Link
                to="/products"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Grid className="w-4 h-4 text-orange-600" />
                  <span>All Products Catalog</span>
                </div>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-orange-100 text-orange-700 rounded-sm">
                  BROWSE
                </span>
              </Link>

              <Link
                to="/flash-sale"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Flash Sale Deals</span>
                </div>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-rose-500 text-white rounded-sm">
                  UP TO 70% OFF
                </span>
              </Link>

              <Link
                to="/mall"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>ShopNexa Official Mall</span>
                </div>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-900 text-amber-300 rounded-sm">
                  100% GENUINE
                </span>
              </Link>

              <Link
                to="/orders"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>Track Your Order</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                to="/products?filter=bestseller"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>Best Sellers</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                to="/products?filter=new"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>New Arrivals</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                to="/admin"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50/70 hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  <span>Admin Control Portal</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
              </Link>
            </div>
          </div>

          {/* Categories List */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Browse Categories
            </h4>
            <div className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* User Specific Links */}
          {currentUser && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                My Account
              </h4>
              <div className="space-y-1">
                <Link
                  to="/account"
                  onClick={onClose}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Account Dashboard</span>
                </Link>
                <Link
                  to="/orders"
                  onClick={onClose}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Package className="w-4 h-4 text-slate-400" />
                  <span>My Orders</span>
                </Link>
                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Heart className="w-4 h-4 text-slate-400" />
                  <span>My Wishlist</span>
                </Link>

                {currentUser.role === 'seller' && (
                  <Link
                    to="/seller-dashboard"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-orange-600 bg-orange-50/70"
                  >
                    <Store className="w-4 h-4 text-orange-600" />
                    <span>Seller Dashboard</span>
                  </Link>
                )}

                {currentUser.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-purple-600 bg-purple-50/70"
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-600" />
                    <span>Admin Control Panel</span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Help & Customer Support */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Help & Support
            </h4>
            <div className="space-y-1">
              <Link
                to="/help"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-blue-500" />
                  <span>Help Center & FAQ</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/50">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                  <span>24/7 Hotline Support</span>
                </div>
                <p className="text-[11px] text-amber-800 font-semibold">09612-SHOPNEXA (746763)</p>
                <p className="text-[10px] text-amber-600">Free call from any BD number</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer in Drawer */}
        {currentUser && (
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-2 transition-colors bg-white shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
