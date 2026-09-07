import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  Truck,
  CreditCard,
  Headphones,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please enter a valid email address.'
      });
      return;
    }
    setSubscribed(true);
    addToast({
      type: 'success',
      title: 'Subscribed to ShopNexa!',
      message: 'Thank you! You will receive exclusive discounts and flash deal alerts.'
    });
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800">
      {/* Top Value Propositions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fast Nationwide Delivery</h4>
              <p className="text-xs text-slate-400">Coverage in all 64 districts</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cash on Delivery</h4>
              <p className="text-xs text-slate-400">Pay when you receive</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine Brands</h4>
              <p className="text-xs text-slate-400">7 Days replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dedicated Support</h4>
              <p className="text-xs text-slate-400">Daily 9:00 AM – 11:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="white" size="md" />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              ShopNexa is Bangladesh's premier online multi-vendor marketplace connecting verified merchants and direct consumers. Experience unmatched quality, authentic local handlooms, global technology, and ultra-reliable doorstep delivery.
            </p>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Level 7, Concord Tower, Gulshan 2, Dhaka-1212</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Hotline: +880 9612-SHOPNEXA (746763)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>support@shopnexa.com.bd</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Subscribe for exclusive offers and updates
              </h5>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-800 text-xs text-white placeholder-slate-500 border border-slate-700 focus:border-orange-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 h-10 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join</span>
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed successfully!
                </p>
              )}
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products" className="hover:text-orange-400 transition-colors">
                  Help Center & FAQ
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-orange-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-orange-400 transition-colors">
                  Returns & Refunds Policy
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-orange-400 transition-colors">
                  Shipping Rates & Times
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-orange-400 transition-colors">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-orange-400 transition-colors">
                  Warranty Claim Procedure
                </Link>
              </li>
            </ul>
          </div>

          {/* Shopping & Discovery */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Shopping
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products?filter=flash" className="hover:text-orange-400 transition-colors">
                  Flash Sale Deals
                </Link>
              </li>
              <li>
                <Link to="/products?filter=mall" className="hover:text-orange-400 transition-colors">
                  ShopNexa Official Mall
                </Link>
              </li>
              <li>
                <Link to="/products?filter=bestseller" className="hover:text-orange-400 transition-colors">
                  Best Selling Products
                </Link>
              </li>
              <li>
                <Link to="/products?filter=new" className="hover:text-orange-400 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/store/seller-1" className="hover:text-orange-400 transition-colors">
                  Apex Footwear Store
                </Link>
              </li>
              <li>
                <Link to="/store/seller-3" className="hover:text-orange-400 transition-colors">
                  Aarong Artisan Living
                </Link>
              </li>
            </ul>
          </div>

          {/* Seller & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Seller & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/seller-dashboard" className="text-orange-400 font-bold hover:underline">
                  Seller Center Login
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-purple-400 font-semibold hover:underline flex items-center gap-1">
                  <span>System Admin Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/seller-dashboard" className="hover:text-orange-400 transition-colors">
                  Become a Merchant
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-orange-400 transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-orange-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-orange-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-orange-400 transition-colors">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar & Payments */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p className="flex items-center gap-1.5">
          <span>&copy; {new Date().getFullYear()} ShopNexa Bangladesh Ltd. All rights reserved. Registered under Digital Commerce Act.</span>
          <Link
            to="/admin"
            className="text-slate-700 hover:text-slate-400 transition-colors p-0.5"
            title="System Portal"
            aria-label="System Portal"
          >
            <Lock className="w-2.5 h-2.5" />
          </Link>
        </p>

        {/* Payment Accepted Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Accepted Payments:</span>
          {['Cash on Delivery', 'bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard'].map((method) => (
            <span
              key={method}
              className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-semibold text-slate-300 border border-slate-700/60"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};
