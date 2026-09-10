import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  Store,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  MoreVertical,
  HelpCircle,
  Globe,
  Truck,
  ShieldCheck,
  Zap,
  Sun,
  Moon,
  Calculator,
  Gift,
  Star,
  Scale,
  Sparkles,
  CheckCircle2,
  Database
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { sanitizeImageUrl, handleImageError, FALLBACK_PRODUCT_IMAGE } from '../../utils/imageUtils';
import { GoogleLogo, FacebookLogo } from '../auth/SocialLoginModal';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    cartTotalCount,
    wishlist,
    currentUser,
    logout,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    products,
    cart,
    cartTotal,
    addToast,
    language,
    setLanguage,
    isDarkMode,
    toggleDarkMode,
    setIsLuckyWheelOpen,
    setIsTrustScorecardOpen,
    comparisonProducts,
    setIsComparisonOpen
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'EN' | 'BN'>('EN');

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Search suggestions calculation
  const searchSuggestions: Product[] = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchFocused(false);
    setIsMobileSearchFocused(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSelectSuggestion = (productId: string) => {
    setIsSearchFocused(false);
    setIsMobileSearchFocused(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setIsMobileSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCartPreview(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4 sm:gap-6">
          {/* Mobile Hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileMenu}
              className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Logo size="md" />
          </div>

          {/* Search Bar with live dynamic suggestions */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search for products, brands and categories..."
                className="w-full h-11 pl-4 pr-12 rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/15 transition-all outline-hidden"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 w-8 h-8 rounded-lg bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center transition-colors shadow-xs"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Suggestions Overlay Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                {searchQuery.trim() ? (
                  <div>
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Products Matching "{searchQuery}"</span>
                      <span>{searchSuggestions.length} found</span>
                    </div>

                    {searchSuggestions.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {searchSuggestions.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleSelectSuggestion(product.id)}
                            className="p-3 flex items-center gap-3 hover:bg-orange-50/60 cursor-pointer transition-colors"
                          >
                            <img
                              src={sanitizeImageUrl(product.images[0], product.category)}
                              alt={product.title}
                              referrerPolicy="no-referrer"
                              onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                              className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-slate-800 truncate">
                                {product.title}
                              </h4>
                              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                <span className="font-bold text-orange-600">
                                  ৳{product.price.toLocaleString()}
                                </span>
                                <span>in {product.category}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="w-full py-2.5 px-4 text-center text-xs font-bold text-orange-600 hover:bg-orange-50 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          View all search results <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-slate-500 text-xs">
                        No direct product matches for "{searchQuery}". Press Enter to see full catalog search.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2.5">
                      <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                      Popular Market Searches
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Redmi Note 13', 'Apex Shoes', 'Jamdani Saree', 'Soundcore Earbuds', 'Panjabi', 'Walton Laptop', 'Smart TV'].map(
                        (tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setSearchQuery(tag);
                              navigate(`/search?q=${encodeURIComponent(tag)}`);
                              setIsSearchFocused(false);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 text-xs font-medium transition-colors"
                          >
                            {tag}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 10/10 Trust & Rating Scorecard Button */}
            <button
              type="button"
              onClick={() => setIsTrustScorecardOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black transition-all cursor-pointer hover:scale-102 shadow-2xs"
              title="১০ এ ১০ কাস্টমার ট্রাস্ট স্কোরকার্ড দেখুন"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>10/10 Rating</span>
            </button>

            {/* Daily Lucky Spin & Win Button */}
            <button
              type="button"
              onClick={() => setIsLuckyWheelOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white text-xs font-black shadow-sm transition-all cursor-pointer hover:scale-102"
              title="লাকি ড্র ঘুরিয়ে ভাউচার জিতুন"
            >
              <Gift className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden sm:inline">Spin & Win</span>
            </button>

            {/* Product Comparison Button (If active items) */}
            {comparisonProducts.length > 0 && (
              <button
                type="button"
                onClick={() => setIsComparisonOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="প্রোডাক্ট পাশাপাশি তুলনা করুন"
              >
                <Scale className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">Compare</span>
                <span className="w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] font-black flex items-center justify-center">
                  {comparisonProducts.length}
                </span>
              </button>
            )}

            {/* Notification Bell */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                    <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                    <span className="text-[11px] font-semibold text-orange-600">
                      {unreadNotificationsCount} Unread
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.link) {
                              setShowNotifications(false);
                              navigate(n.link);
                            }
                          }}
                          className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                            !n.read ? 'bg-orange-50/60 font-semibold' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex justify-between text-xs text-slate-900 mb-0.5">
                            <span className="font-bold">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.date}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="p-4 text-center text-xs text-slate-400">No notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors flex items-center justify-center cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors hidden sm:flex items-center justify-center"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon & Flyout */}
            <div
              ref={cartRef}
              className="relative"
              onMouseEnter={() => setShowCartPreview(true)}
              onMouseLeave={() => setShowCartPreview(false)}
            >
              <Link
                to="/cart"
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors flex items-center justify-center"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartTotalCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                    {cartTotalCount}
                  </span>
                )}
              </Link>

              {/* Cart Preview Hover Dropdown on Desktop */}
              {showCartPreview && cart.length > 0 && (
                <div className="absolute right-0 mt-1 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 z-50 hidden md:block animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-900">
                      Cart Preview ({cartTotalCount} items)
                    </span>
                    <Link to="/cart" className="text-xs font-semibold text-orange-600 hover:underline">
                      View Cart
                    </Link>
                  </div>
                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 mb-3">
                    {cart.slice(0, 3).map((item) => (
                      <div key={item.product.id} className="py-2 flex items-center gap-3">
                        <img
                          src={sanitizeImageUrl(item.product.images[0], item.product.category)}
                          alt={item.product.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                          className="w-10 h-10 object-cover rounded-lg bg-slate-50 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {item.product.title}
                          </p>
                          <span className="text-[11px] text-slate-500">
                            {item.quantity} × ৳{item.product.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {cart.length > 3 && (
                      <p className="text-[11px] text-slate-400 text-center pt-2">
                        +{cart.length - 3} more items in cart
                      </p>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500">Total:</span>
                    <span className="text-sm font-black text-slate-900">
                      ৳{cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <Link
                    to="/checkout"
                    className="block w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl text-center shadow-md shadow-orange-600/20 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </div>

            {/* User Account Dropdown */}
            <div ref={userRef} className="relative">
              {currentUser ? (
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
                  aria-label="User profile menu"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-orange-500/20"
                  />
                  <div className="hidden lg:flex flex-col text-left leading-none">
                    <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-orange-600 font-semibold uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}

              {/* User Dropdown Menu */}
              {showUserDropdown && currentUser && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 uppercase">
                        {currentUser.role}
                      </span>
                      {currentUser.authProvider === 'google' && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <GoogleLogo className="w-2.5 h-2.5" />
                          <span>Gmail</span>
                        </span>
                      )}
                      {currentUser.authMethod === 'email_code' && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Code Verified</span>
                        </span>
                      )}
                      {currentUser.authProvider === 'facebook' && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20">
                          <FacebookLogo className="w-2.5 h-2.5 fill-[#1877F2]" />
                          <span>Facebook</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to="/account"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Profile
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Package className="w-4 h-4 text-slate-400" />
                    My Orders
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-slate-400" />
                    My Wishlist
                  </Link>

                  {currentUser.role === 'seller' && (
                    <Link
                      to="/seller-dashboard"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-orange-600 bg-orange-50/60 hover:bg-orange-50 transition-colors"
                    >
                      <Store className="w-4 h-4 text-orange-600" />
                      Seller Dashboard
                    </Link>
                  )}

                  {currentUser.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-600 bg-purple-50/60 hover:bg-purple-50 transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4 text-purple-600" />
                      Admin Control Panel
                    </Link>
                  )}

                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3-Dot More Options Dropdown Menu (Mobile & Desktop) */}
            <div ref={moreMenuRef} className="relative">
              <button
                id="header-3dot-options-button"
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`p-2 rounded-xl transition-all relative flex items-center justify-center ${
                  showMoreMenu
                    ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-500/20'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-label="3-dot more options menu"
                title="More Options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* 3-Dot Dropdown / Action Sheet */}
              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 px-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Quick Options
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">
                      ShopNexa BD 🇧🇩
                    </span>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        onOpenMobileMenu?.();
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-orange-600 bg-orange-50/80 hover:bg-orange-100 transition-colors text-left"
                    >
                      <Menu className="w-4 h-4 shrink-0" />
                      <span>All Categories & Full Menu</span>
                    </button>

                    <Link
                      to="/orders"
                      onClick={() => setShowMoreMenu(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Truck className="w-4 h-4 text-orange-500 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">Track Orders</p>
                        <p className="text-[10px] text-slate-400">Live courier & delivery status</p>
                      </div>
                    </Link>

                    <Link
                      to="/flash-sale"
                      onClick={() => setShowMoreMenu(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">Flash Sale Deals</p>
                        <p className="text-[10px] text-slate-400">Exclusive limited time discounts</p>
                      </div>
                    </Link>

                    <Link
                      to="/mall"
                      onClick={() => setShowMoreMenu(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">ShopNexa Mall</p>
                        <p className="text-[10px] text-slate-400">100% Genuine Brand Assurance</p>
                      </div>
                    </Link>

                    <Link
                      to="/seller-dashboard"
                      onClick={() => setShowMoreMenu(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Store className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">Sell on ShopNexa</p>
                        <p className="text-[10px] text-slate-400">Open your vendor store</p>
                      </div>
                    </Link>

                    <Link
                      to="/admin"
                      onClick={() => setShowMoreMenu(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50/70 hover:bg-purple-100 transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-purple-950">Admin Panel</p>
                        <p className="text-[10px] text-purple-600">Governance, Products & Sales</p>
                      </div>
                    </Link>

                    <Link
                      to="/help"
                      onClick={() => setShowMoreMenu(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">24/7 Help & Support</p>
                        <p className="text-[10px] text-slate-400">Helpline: 09612-SHOPNEXA</p>
                      </div>
                    </Link>
                  </div>

                  {/* Language Selector */}
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>Language / ভাষা:</span>
                    </div>
                    <div className="inline-flex rounded-lg p-0.5 bg-slate-100 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => {
                          setLanguage('en');
                          addToast({ title: 'Language set to English', type: 'info' });
                        }}
                        className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          language === 'en' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLanguage('bn');
                          addToast({ title: 'ভাষা বাংলায় পরিবর্তিত হয়েছে', type: 'info' });
                        }}
                        className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          language === 'bn' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        বাংলা
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Row (shown below on mobile) */}
        <div ref={mobileSearchRef} className="pb-3 sm:hidden relative">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsMobileSearchFocused(true)}
              placeholder="Search products, brands, categories..."
              className="w-full h-10 pl-3.5 pr-16 rounded-xl bg-slate-100 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 outline-hidden focus:border-orange-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-9 p-1 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute right-1 w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center transition-colors shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Mobile Search Suggestions Dropdown */}
          {isMobileSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              {searchQuery.trim() ? (
                <div>
                  <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Matches for "{searchQuery}"</span>
                    <span>{searchSuggestions.length} found</span>
                  </div>

                  {searchSuggestions.length > 0 ? (
                    <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                      {searchSuggestions.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleSelectSuggestion(product.id)}
                          className="p-2.5 flex items-center gap-2.5 hover:bg-orange-50/60 active:bg-orange-100 cursor-pointer transition-colors"
                        >
                          <img
                            src={sanitizeImageUrl(product.images[0], product.category)}
                            alt={product.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                            className="w-9 h-9 object-cover rounded-lg bg-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-slate-800 truncate">
                              {product.title}
                            </h4>
                            <div className="text-[10px] text-slate-500 flex items-center gap-2">
                              <span className="font-bold text-orange-600">
                                ৳{product.price.toLocaleString()}
                              </span>
                              <span>in {product.category}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full py-2 px-3 text-center text-xs font-bold text-orange-600 hover:bg-orange-50 flex items-center justify-center gap-1 transition-colors"
                      >
                        View all results <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-slate-500 text-xs">
                      No direct matches for "{searchQuery}". Tap search to view full catalog.
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                    Popular Searches
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Redmi Note 13', 'Apex Shoes', 'Jamdani Saree', 'Soundcore Earbuds', 'Smart TV'].map(
                      (tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setSearchQuery(tag);
                            navigate(`/search?q=${encodeURIComponent(tag)}`);
                            setIsMobileSearchFocused(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
