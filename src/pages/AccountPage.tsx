import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Edit2,
  Store,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { GoogleLogo, FacebookLogo, SocialLoginModal } from '../components/auth/SocialLoginModal';

export const AccountPage: React.FC = () => {
  const { currentUser, logout, orders, wishlist, switchUserRole } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'addresses'>('profile');
  const [socialModalProvider, setSocialModalProvider] = useState<'google' | 'facebook' | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Sign In to Your Account</h2>
        <p className="text-slate-500 text-xs mb-6 max-w-xs mx-auto">
          Sign in directly with your Gmail or Facebook account to view your orders, addresses and profile.
        </p>

        {/* 1-Click Social Sign In Buttons */}
        <div className="space-y-2.5 mb-6">
          <button
            onClick={() => setSocialModalProvider('google')}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-2xl border border-slate-300 hover:border-blue-400 flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
          >
            <GoogleLogo className="w-4 h-4 shrink-0" />
            <span>Continue with Google (Gmail)</span>
          </button>

          <button
            onClick={() => setSocialModalProvider('facebook')}
            className="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
          >
            <FacebookLogo className="w-4 h-4 shrink-0 fill-white" />
            <span>Continue with Facebook</span>
          </button>
        </div>

        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            or traditional login
          </span>
          <div className="border-t border-slate-200 w-full"></div>
        </div>

        <Link
          to="/login"
          className="inline-flex px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-600/20"
        >
          Go to Sign In Page
        </Link>

        {/* Social Login Modal */}
        <SocialLoginModal
          provider={socialModalProvider}
          onClose={() => setSocialModalProvider(null)}
          onSuccess={() => setSocialModalProvider(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-24 sm:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-semibold">My Account</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Menu (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            {/* User Profile Card */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-orange-500/10"
              />
              <div className="min-w-0">
                <h2 className="font-extrabold text-base text-slate-900 truncate">
                  {currentUser.name}
                </h2>
                <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-orange-100 text-orange-700">
                    {currentUser.role} Account
                  </span>
                  {currentUser.authProvider === 'google' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      <GoogleLogo className="w-3 h-3" />
                      <span>Google (Gmail)</span>
                    </span>
                  )}
                  {currentUser.authProvider === 'facebook' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20">
                      <FacebookLogo className="w-3 h-3 fill-[#1877F2]" />
                      <span>Facebook</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Persona Switcher Buttons for Live Testing */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
              <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                Switch Active Demo Persona:
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => switchUserRole('customer')}
                  className={`flex-1 py-1 px-2 rounded-lg font-bold text-[11px] transition-colors ${
                    currentUser.role === 'customer'
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Buyer
                </button>
                <button
                  onClick={() => switchUserRole('seller')}
                  className={`flex-1 py-1 px-2 rounded-lg font-bold text-[11px] transition-colors ${
                    currentUser.role === 'seller'
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Seller
                </button>
                <button
                  onClick={() => switchUserRole('admin')}
                  className={`flex-1 py-1 px-2 rounded-lg font-bold text-[11px] transition-colors ${
                    currentUser.role === 'admin'
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Nav links */}
            <div className="space-y-1 text-xs font-semibold text-slate-700">
              <button
                onClick={() => setActiveSubTab('profile')}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors text-left ${
                  activeSubTab === 'profile' ? 'bg-orange-50 text-orange-600 font-bold' : 'hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Personal Profile</span>
              </button>

              <button
                onClick={() => setActiveSubTab('addresses')}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors text-left ${
                  activeSubTab === 'addresses' ? 'bg-orange-50 text-orange-600 font-bold' : 'hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Delivery Address Book</span>
              </button>

              <Link
                to="/orders"
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-slate-400" />
                  <span>My Orders</span>
                </div>
                <span className="text-[11px] text-slate-400 font-normal">{orders.length}</span>
              </Link>

              <Link
                to="/wishlist"
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-slate-400" />
                  <span>My Saved Wishlist</span>
                </div>
                <span className="text-[11px] text-slate-400 font-normal">{wishlist.length}</span>
              </Link>

              {currentUser.role === 'seller' && (
                <Link
                  to="/seller-dashboard"
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-orange-50 text-orange-600 font-bold hover:bg-orange-100 transition-colors"
                >
                  <Store className="w-4 h-4" />
                  <span>Seller Control Center</span>
                </Link>
              )}

              {currentUser.role === 'admin' && (
                <Link
                  to="/admin"
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-purple-50 text-purple-700 font-bold hover:bg-purple-100 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  <span>Admin Management Portal</span>
                </Link>
              )}

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-left pt-3"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Right Main Info (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {activeSubTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Verified User
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="text-slate-400 block mb-1">Full Name</span>
                    <span className="font-bold text-slate-900 text-sm">{currentUser.name}</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="text-slate-400 block mb-1">Email Address</span>
                    <span className="font-bold text-slate-900 text-sm">{currentUser.email}</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="text-slate-400 block mb-1">Phone Number</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {currentUser.phone || '+880 1712-345678'}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="text-slate-400 block mb-1">Account Role</span>
                    <span className="font-bold text-orange-600 text-sm capitalize">
                      {currentUser.role} Account
                    </span>
                  </div>
                </div>

                {/* Quick Orders Snippet */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Recent Orders
                    </h3>
                    <Link to="/orders" className="text-xs font-bold text-orange-600 hover:underline">
                      View All &rarr;
                    </Link>
                  </div>

                  {orders.slice(0, 2).map((o) => (
                    <div
                      key={o.id}
                      className="p-3 rounded-2xl border border-slate-200 mb-2 flex items-center justify-between text-xs bg-slate-50/50"
                    >
                      <div>
                        <span className="font-bold text-slate-900">Order #{o.id}</span>
                        <p className="text-slate-500 text-[11px]">
                          {o.items.length} item(s) • Total: ৳{o.total.toLocaleString()}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-100 text-orange-800">
                        {o.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === 'addresses' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-slate-900 mb-2">Saved Delivery Addresses</h2>
                <div className="p-4 rounded-2xl border-2 border-orange-500 bg-orange-50/30 text-xs space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white">
                      Primary Delivery Address
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{currentUser.name}</p>
                  <p className="text-slate-600">House 42, Road 11, Block D, Banani, Dhaka-1213</p>
                  <p className="text-slate-600">Phone: {currentUser.phone || '+880 1712-345678'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SocialLoginModal
        provider={socialModalProvider}
        onClose={() => setSocialModalProvider(null)}
        onSuccess={() => setSocialModalProvider(null)}
      />
    </div>
  );
};
