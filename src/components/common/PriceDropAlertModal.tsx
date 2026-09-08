import React, { useState } from 'react';
import {
  X,
  Bell,
  BellRing,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { sanitizeImageUrl, handleImageError } from '../../utils/imageUtils';

export const PriceDropAlertModal: React.FC = () => {
  const {
    priceDropModalProduct,
    setPriceDropModalProduct,
    addToast
  } = useStore();

  const [targetDiscount, setTargetDiscount] = useState(10);
  const [phoneOrEmail, setPhoneOrEmail] = useState('01712345678');
  const [isSaved, setIsSaved] = useState(false);

  if (!priceDropModalProduct) return null;

  const currentPrice = priceDropModalProduct.price;
  const targetPrice = Math.round(currentPrice * (1 - targetDiscount / 100));

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) return;

    setIsSaved(true);
    addToast({
      type: 'success',
      title: 'Price Drop Alert Activated! 🔔',
      message: `We will notify you at ${phoneOrEmail} when the price reaches ৳${targetPrice.toLocaleString()}!`
    });

    setTimeout(() => {
      setIsSaved(false);
      setPriceDropModalProduct(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-black text-base">প্রাইস ড্রপ অ্যালার্ট (Price Drop Alert)</h3>
              <p className="text-xs text-blue-100">দাম কমলেই সাথে সাথে এসএমএস ও নোটিফিকেশন পান</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPriceDropModalProduct(null)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product mini info */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
          <img
            src={sanitizeImageUrl(priceDropModalProduct.images[0], priceDropModalProduct.category)}
            alt={priceDropModalProduct.title}
            onError={(e) => handleImageError(e, priceDropModalProduct.category)}
            className="w-14 h-14 rounded-xl object-cover bg-white border border-slate-200"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-blue-600 uppercase">
              {priceDropModalProduct.brand}
            </span>
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {priceDropModalProduct.title}
            </h4>
            <div className="text-sm font-black text-slate-900 mt-0.5">
              বর্তমান মূল্য: ৳{currentPrice.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSetAlert} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              কত টাকা বা কত শতাংশ দাম কমলে অ্যালার্ট চান?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20].map((percent) => (
                <button
                  type="button"
                  key={percent}
                  onClick={() => setTargetDiscount(percent)}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    targetDiscount === percent
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {percent}% কমে গেলে
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-between">
            <div className="text-xs text-blue-900">
              <span className="block font-bold">টার্গেট নোটিফিকেশন প্রাইস:</span>
              <span className="text-[11px] text-blue-700">
                (৳{(currentPrice - targetPrice).toLocaleString()} সাশ্রয়)
              </span>
            </div>
            <div className="text-base font-black text-blue-700">
              ৳{targetPrice.toLocaleString()}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              মোবাইল নম্বর অথবা ইমেইল:
            </label>
            <input
              type="text"
              required
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              placeholder="01XXXXXXXXX / your@email.com"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 outline-hidden focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={isSaved}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-emerald-600"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>অ্যালার্ট সক্রিয় করা হয়েছে!</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span>Set Price Drop Alert Now</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
