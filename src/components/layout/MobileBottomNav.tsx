import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingCart, User, MoreHorizontal } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { soundEngine } from '../../utils/audioFeedback';

interface MobileBottomNavProps {
  onOpenMenu?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const location = useLocation();
  const { cartTotalCount, currentUser } = useStore();

  // Suppress generic bottom navigation on checkout, order success, and product detail pages
  if (
    location.pathname === '/checkout' ||
    location.pathname.startsWith('/order-success') ||
    location.pathname.startsWith('/product/') ||
    (location.pathname.startsWith('/products/') && location.pathname !== '/products/')
  ) {
    return null;
  }

  const isHome = location.pathname === '/';
  const isCatalog = location.pathname === '/products' || location.pathname.startsWith('/category/');
  const isCart = location.pathname === '/cart';
  const isAccount = location.pathname === '/account' || location.pathname === '/login' || location.pathname === '/orders';

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-40 py-1.5 px-2 safe-area-bottom shadow-2xl"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <Link
          to="/"
          id="mobile-bottom-home"
          onClick={() => soundEngine.playPop()}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative min-w-[56px] active:scale-95 ${
            isHome ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isHome && (
            <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-orange-600 shadow-xs animate-in fade-in zoom-in duration-200" />
          )}
          <Home className={`w-5 h-5 transition-transform ${isHome ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-1 leading-tight">Home</span>
        </Link>

        {/* Catalog */}
        <Link
          to="/products"
          id="mobile-bottom-catalog"
          onClick={() => soundEngine.playPop()}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative min-w-[56px] active:scale-95 ${
            isCatalog ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isCatalog && (
            <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-orange-600 shadow-xs animate-in fade-in zoom-in duration-200" />
          )}
          <Grid className={`w-5 h-5 transition-transform ${isCatalog ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-1 leading-tight">Catalog</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          id="mobile-bottom-cart"
          onClick={() => soundEngine.playPop()}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative min-w-[56px] active:scale-95 ${
            isCart ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isCart && (
            <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-orange-600 shadow-xs animate-in fade-in zoom-in duration-200" />
          )}
          <div className="relative">
            <ShoppingCart className={`w-5 h-5 transition-transform ${isCart ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'}`} />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-orange-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white animate-pulse">
                {cartTotalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 leading-tight">Cart</span>
        </Link>

        {/* Account */}
        <Link
          to={currentUser ? '/account' : '/login'}
          id="mobile-bottom-account"
          onClick={() => soundEngine.playPop()}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative min-w-[56px] active:scale-95 ${
            isAccount ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isAccount && (
            <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-orange-600 shadow-xs animate-in fade-in zoom-in duration-200" />
          )}
          <User className={`w-5 h-5 transition-transform ${isAccount ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] mt-1 leading-tight">{currentUser ? 'Account' : 'Login'}</span>
        </Link>

        {/* Menu (3 Dots / More) */}
        <button
          type="button"
          id="mobile-bottom-menu-3dot"
          onClick={() => {
            soundEngine.playPop();
            onOpenMenu?.();
          }}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-slate-500 hover:text-orange-600 active:text-orange-600 transition-colors relative min-w-[56px] active:scale-95"
          aria-label="Open 3-dot mobile menu"
        >
          <MoreHorizontal className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] mt-1 leading-tight font-medium">Menu</span>
        </button>
      </div>
    </nav>
  );
};
