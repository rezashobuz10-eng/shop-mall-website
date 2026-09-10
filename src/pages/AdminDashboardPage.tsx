import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Store,
  DollarSign,
  Package,
  Sparkles,
  Tag,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Calculator,
  TrendingUp,
  Lock,
  Key,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  Database
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductManager } from '../components/admin/ProductManager';
import { SalesCalculator } from '../components/admin/SalesCalculator';
import { CustomerDatabaseManager } from '../components/admin/CustomerDatabaseManager';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    sellers,
    orders,
    banners,
    toggleBannerStatus,
    coupons,
    addCoupon,
    deleteCoupon,
    addToast,
    currentUser,
    switchUserRole
  } = useStore();

  const navigate = useNavigate();
  const [adminPin, setAdminPin] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showPin, setShowPin] = useState(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'products' | 'calculator' | 'banners' | 'coupons' | 'sellers'>('overview');

  // New Coupon Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [newDiscountVal, setNewDiscountVal] = useState(15);
  const [newMinSpend, setNewMinSpend] = useState(1000);
  const [newDesc, setNewDesc] = useState('Special seasonal voucher');

  // Admin Metrics
  const grossMerchandiseValue = orders.reduce((sum, o) => sum + o.total, 0) + 4829000;
  const totalUsersCount = 14280;
  const activeSellersCount = sellers.length;
  const totalMarketplaceOrders = orders.length + 3840;

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountType: newDiscountType,
      discountValue: Number(newDiscountVal),
      minSpend: Number(newMinSpend),
      description: newDesc,
      validUntil: '2026-12-31'
    });

    addToast({
      type: 'success',
      title: 'Coupon Created',
      message: `Coupon ${newCouponCode.toUpperCase()} is now live.`
    });

    setNewCouponCode('');
  };

  const handleAdminAuth = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const pin = adminPin.trim().toLowerCase();
    if (
      pin === '2026' ||
      pin === 'admin123' ||
      pin === 'admin' ||
      pin === 'rezashobuz10@gmail.com' ||
      pin === 'admin@shopnexa.com' ||
      pin === 'shopnexa'
    ) {
      switchUserRole('admin');
      addToast({
        type: 'success',
        title: 'Admin Access Granted',
        message: 'Welcome to ShopNexa Management Portal'
      });
      setAdminError('');
    } else {
      setAdminError('Invalid authorization PIN or email. Access denied.');
    }
  };

  // If user is not authenticated as admin, show Restricted Security Gate
  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-slate-100">
        <div className="max-w-md w-full bg-slate-800/95 rounded-3xl border border-slate-700 p-8 shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <Lock className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Confidential Area (গোপনীয়)
            </span>
            <h2 className="text-xl font-black text-white mt-3">
              Admin Authorization Required
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              This management portal is restricted. Only authorized system administrators can access this page.
            </p>
          </div>

          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Passcode / Security Key
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={adminPin}
                  onChange={(e) => {
                    setAdminPin(e.target.value);
                    if (adminError) setAdminError('');
                  }}
                  placeholder="Enter passcode (e.g. 2026 or admin123)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-slate-500 pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {adminError && (
                <p className="text-rose-400 text-xs mt-1.5 font-medium">{adminError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>Unlock Admin Panel (প্রবেশ করুন)</span>
            </button>
          </form>

          {/* Quick Owner Verification Button */}
          <div className="mt-6 pt-5 border-t border-slate-700/80 text-center">
            <p className="text-[11px] text-slate-400 mb-2.5">
              Site Owner / Master Admin:
            </p>
            <button
              type="button"
              onClick={() => {
                switchUserRole('admin');
                addToast({
                  type: 'success',
                  title: 'Owner Verified',
                  message: 'Welcome Reza Shobuz (Super Admin)'
                });
              }}
              className="w-full py-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>1-Click Owner Sign In (rezashobuz10@gmail.com)</span>
            </button>
          </div>

          <div className="mt-5 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Customer Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black text-slate-900">ShopNexa Admin Control Panel</h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Super-admin governance, GMV metrics, campaigns, vouchers and merchant auditing
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            System Status: Healthy & Online
          </span>
        </div>

        {/* 4 Macro Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Gross Merch. Value (GMV)
            </span>
            <span className="text-2xl font-black text-slate-900">
              ৳{grossMerchandiseValue.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              +18.4% monthly growth
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Registered Customers
            </span>
            <span className="text-2xl font-black text-slate-900">
              {totalUsersCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              Across all 8 divisions
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Verified Merchants
            </span>
            <span className="text-2xl font-black text-slate-900">{activeSellersCount}</span>
            <span className="text-[11px] text-blue-600 font-medium block mt-1">
              100% KYC verified
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Fulfilled Orders
            </span>
            <span className="text-2xl font-black text-slate-900">
              {totalMarketplaceOrders.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              99.2% on-time delivery
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Platform Overview
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Customer Database & Gmails (কাস্টমার ডাটাবেস)</span>
            <span className="px-1.5 py-0.2 bg-emerald-400 text-emerald-950 text-[9px] font-black rounded-full">
              Firestore
            </span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Add & Manage Products ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Sales & Profit Calculator (হিসাব খাতা)</span>
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Promotional Hero Banners ({banners.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Coupon Vouchers ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'sellers'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Merchant Directory ({sellers.length})
          </button>
        </div>

        {/* Tab: Customer Database & Gmails */}
        {activeTab === 'customers' && <CustomerDatabaseManager />}

        {/* Tab 1: Overview and Recent Platform Orders */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900">Recent Marketplace Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase tracking-wider text-[10px] font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">#{o.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {o.shippingAddress.fullName}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{o.shippingAddress.city}</td>
                      <td className="py-3 px-4">{o.paymentMethod}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ৳{o.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Product Management & Add Product Form */}
        {activeTab === 'products' && <ProductManager />}

        {/* Tab 3: Sales Ledger & Profit Calculator */}
        {activeTab === 'calculator' && <SalesCalculator />}

        {/* Tab 2: Banner Manager */}
        {activeTab === 'banners' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4">
                Hero Carousel Promotion Banners
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Toggle active/inactive status to instantly update homepage banners.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl border border-slate-200 flex flex-col justify-between gap-4 bg-slate-50"
                  >
                    <div className="flex gap-4">
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700">
                          {b.badge}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 mt-1">{b.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{b.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                      <span className="font-semibold text-slate-600">
                        Status: <span className="uppercase font-bold">{b.status}</span>
                      </span>
                      <button
                        onClick={() => toggleBannerStatus(b.id)}
                        className={`px-3 py-1 rounded-xl font-bold text-xs transition-colors ${
                          b.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {b.status === 'active' ? 'Active' : 'Inactive (Click to Enable)'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Coupons Manager */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Create Coupon Form (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4">Create New Voucher Code</h2>
              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. POHELA2026"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl uppercase font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                    <select
                      value={newDiscountType}
                      onChange={(e) => setNewDiscountType(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (৳)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Discount Value</label>
                    <input
                      type="number"
                      required
                      value={newDiscountVal}
                      onChange={(e) => setNewDiscountVal(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Minimum Spend Required (৳)
                  </label>
                  <input
                    type="number"
                    required
                    value={newMinSpend}
                    onChange={(e) => setNewMinSpend(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Offer Description</label>
                  <input
                    type="text"
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Create & Activate Coupon
                </button>
              </form>
            </div>

            {/* Coupons List (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4">Active Market Vouchers</h2>
              <div className="space-y-3">
                {coupons.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between bg-slate-50 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-slate-900">{c.code}</span>
                        <span className="px-2 py-0.2 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                          {c.discountType === 'percentage'
                            ? `${c.discountValue}% OFF`
                            : `৳${c.discountValue} FLAT`}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-1">{c.description}</p>
                      <span className="text-[10px] text-slate-400">
                        Min spend: ৳{c.minSpend.toLocaleString()} | Valid until: {c.validUntil}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteCoupon(c.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Merchant Directory */}
        {activeTab === 'sellers' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">Approved Flagship Sellers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sellers.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl border border-slate-200 flex gap-4 bg-slate-50">
                  <img src={s.logo} alt={s.name} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                  <div className="min-w-0 flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">{s.name}</h4>
                      <span className="text-emerald-600 font-bold text-[10px]">Verified</span>
                    </div>
                    <p className="text-slate-500 truncate">{s.location}</p>
                    <div className="flex items-center gap-3 mt-2 font-medium text-slate-600">
                      <span>Rating: {s.rating}★</span>
                      <span>Followers: {s.followers.toLocaleString()}</span>
                      <span>Products: {s.productCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
