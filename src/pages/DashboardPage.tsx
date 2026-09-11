import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  ShieldCheck,
  LogOut,
  Mail,
  Phone,
  Store,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Edit2,
  KeyRound
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OWNER_ADMIN_EMAIL } from '../utils/adminSecurity';

export const DashboardPage: React.FC = () => {
  const { currentUser, logout, orders, wishlist, switchUserRole } = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'security'>('overview');

  if (!currentUser) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-50/60">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Sign In Required</h1>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            Please sign in to access your ShopNexa customer dashboard, view orders, and manage security settings.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-2xl shadow-md shadow-orange-600/20 text-center transition-all"
            >
              Sign In to Your Account
            </Link>
            <Link
              to="/signup"
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 text-center transition-all"
            >
              Create a New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwnerAdmin =
    currentUser.email.toLowerCase() === OWNER_ADMIN_EMAIL.toLowerCase() || currentUser.role === 'admin';

  const userOrders = orders.filter(
    (o) => o.customerEmail?.toLowerCase() === currentUser.email.toLowerCase() || o.userId === currentUser.id
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={
                currentUser.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
              }
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-orange-500/50 shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{currentUser.name}</h1>
                
                {/* Verification Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Account
                </span>

                {/* Role Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 capitalize">
                  {currentUser.role}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.email}
                </span>
                {currentUser.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {currentUser.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {currentUser.joinedDate || 'Recently'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isOwnerAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-xs shadow-md shadow-orange-600/30 flex items-center gap-1.5 transition-all"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
            )}

            {currentUser.role === 'seller' && (
              <Link
                to="/seller-dashboard"
                className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold text-xs shadow-md shadow-orange-600/30 flex items-center gap-1.5 transition-all"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Seller Dashboard</span>
              </Link>
            )}

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-rose-900/60 text-slate-200 hover:text-rose-200 border border-slate-700 hover:border-rose-700/50 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          to="/orders"
          className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">My Orders</p>
              <p className="text-xl font-black text-slate-900">{userOrders.length} Placed</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-orange-600 transition-colors" />
        </Link>

        <Link
          to="/wishlist"
          className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Saved Wishlist</p>
              <p className="text-xl font-black text-slate-900">{wishlist.length} Items</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-rose-600 transition-colors" />
        </Link>

        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Security Status</p>
              <p className="text-sm font-black text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 100% Verified
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Details & Security Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security & Authentication Health Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Security & Email Verification Status</span>
              </h2>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Active Session
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Verification</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified ({currentUser.email})</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Verified directly via Google / SMTP OTP confirmation.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Password Encryption</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Scrypt Salted Hashes</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Never stored in plain text. Compliant with NIST recommendations.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <Link
                to="/forgot-password"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>Change Password</span>
              </Link>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-600" />
                <span>Recent Orders</span>
              </h2>
              <Link to="/orders" className="text-xs font-bold text-orange-600 hover:underline">
                View All Orders →
              </Link>
            </div>

            {userOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No orders placed yet.</p>
                <Link
                  to="/products"
                  className="mt-3 inline-block px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-900">#{order.orderNumber}</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {order.items.length} items • ৳{order.total.toLocaleString()}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold capitalize bg-orange-100 text-orange-800">
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Links & Delivery Addresses */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-sm font-black text-slate-900 mb-3">Quick Navigation</h2>
            <div className="space-y-2 text-xs font-bold">
              <Link
                to="/orders"
                className="w-full p-2.5 bg-slate-50 hover:bg-orange-50 hover:text-orange-700 rounded-2xl flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-slate-400" />
                  <span>My Orders & Tracking</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/wishlist"
                className="w-full p-2.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 rounded-2xl flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-slate-400" />
                  <span>Saved Wishlist</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/account"
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Account & Addresses</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          <div className="bg-orange-50/70 rounded-3xl border border-orange-200/80 p-5 text-xs text-orange-900">
            <h3 className="font-black text-orange-950 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              Need Help with Your Account?
            </h3>
            <p className="text-[11px] text-orange-800/80 leading-relaxed mb-3">
              Our 24/7 Dhaka support desk is available to assist you with order delivery, verification, and seller merchant tools.
            </p>
            <Link
              to="/help"
              className="inline-flex px-3 py-1.5 bg-white border border-orange-200 font-bold rounded-xl text-orange-800 hover:bg-orange-100 transition-colors shadow-2xs"
            >
              Visit Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
