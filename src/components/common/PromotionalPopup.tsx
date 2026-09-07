import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Truck,
  ArrowRight,
  Gift,
  Clock
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { soundEngine } from '../../utils/audioFeedback';

const STORAGE_KEY = 'shopnexa_promo_popup_closed_until';

export const PromotionalPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);
  const { applyCoupon, addToast } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has dismissed the popup today
    const closedUntil = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (closedUntil && parseInt(closedUntil, 10) > now) {
      return;
    }

    // Trigger popup smoothly after 1.5 seconds on initial entry
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (dontShowToday) {
      // Store 24 hour expiry timestamp
      const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, tomorrow.toString());
    }
    setIsOpen(false);
  };

  const handleCopyCode = () => {
    soundEngine.playPop();
    const code = 'WELCOME200';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopied(true);
    applyCoupon(code);
    addToast({
      type: 'success',
      title: '৳200 Voucher Applied! (কুপন যোগ হয়েছে)',
      message: 'Code WELCOME200 applied to your checkout cart.'
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShopNow = () => {
    handleCopyCode();
    handleClose();
    navigate('/products?filter=flash');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-popup-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-xs"
          aria-label="Close promotion popup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Visual Banner with Authentic Gradient */}
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 text-white p-6 pt-7 overflow-hidden text-center">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Exclusive Welcome Deal • প্রথম অর্ডারে ছাড়</span>
          </div>

          <h2 id="promo-popup-title" className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Get Flat <span className="text-amber-400">৳200 OFF</span> Today!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
            শপনেক্সা-তে প্রথম কেনাকাটায় পাচ্ছেন ফ্ল্যাট ২০০ টাকা ছাড়
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Voucher Code Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-dashed border-orange-300 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider block">
                Promo Code (কুপন কোড)
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-wider">
                WELCOME200
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Min. order ৳999 • All categories included
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-orange-600 hover:bg-orange-500 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Authentic Trust Pillars */}
          <div className="grid grid-cols-3 gap-2.5 py-1">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">100% Genuine</p>
              <p className="text-[9px] text-slate-400">অরিজিনাল পণ্য</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <Truck className="w-4 h-4 text-orange-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">Cash on Delivery</p>
              <p className="text-[9px] text-slate-400">সারা বাংলাদেশে</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <Gift className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">Extra Gifts</p>
              <p className="text-[9px] text-slate-400">ফ্ল্যাশ ডিলস</p>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleShopNow}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm shadow-xl shadow-orange-600/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Shop Now with ৳200 OFF (অর্ডার করুন)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Footer Controls: Don't show again today */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowToday}
                onChange={(e) => setDontShowToday(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
              />
              <span className="text-[11px]">Don't show this again today (আজকে আর দেখাবেন না)</span>
            </label>

            <button
              type="button"
              onClick={handleClose}
              className="text-[11px] text-slate-400 hover:text-slate-700 font-medium underline cursor-pointer"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
