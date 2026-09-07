import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Store, Truck, Gift, Package, Sparkles, Check } from 'lucide-react';
import { soundEngine } from '../../utils/audioFeedback';
import { useStore } from '../../context/StoreContext';

export const MobileQuickActions: React.FC = () => {
  const { applyCoupon, addToast } = useStore();
  const [claimedVoucher, setClaimedVoucher] = useState(false);

  const handleClaimVoucher = () => {
    soundEngine.playPop();
    applyCoupon('WELCOME200');
    setClaimedVoucher(true);
    addToast({
      type: 'success',
      title: '৳200 কুপন যোগ হয়েছে! (WELCOME200)',
      message: 'Checkout-এ সরাসরি ৳২০০ ডিসকাউন্ট প্রযোজ্য।'
    });
    setTimeout(() => setClaimedVoucher(false), 3000);
  };

  const quickLinks = [
    {
      id: 'flash',
      label: 'Flash Deals',
      sublabel: 'ফ্ল্যাশ সেল',
      to: '/flash-sale',
      icon: Zap,
      iconColor: 'text-amber-500 fill-amber-500',
      bgGradient: 'from-amber-500/15 to-orange-500/15 border-amber-200/60',
      badge: 'HOT'
    },
    {
      id: 'mall',
      label: 'Official Mall',
      sublabel: 'অফিসিয়াল মল',
      to: '/mall',
      icon: Store,
      iconColor: 'text-blue-600',
      bgGradient: 'from-blue-500/15 to-indigo-500/15 border-blue-200/60',
      badge: '100% Brand'
    },
    {
      id: 'freeship',
      label: 'Free Delivery',
      sublabel: 'ফ্রি ডেলিভারি',
      to: '/products?filter=free-delivery',
      icon: Truck,
      iconColor: 'text-emerald-600',
      bgGradient: 'from-emerald-500/15 to-teal-500/15 border-emerald-200/60',
      badge: '0৳ Ship'
    },
    {
      id: 'track',
      label: 'Track Order',
      sublabel: 'ট্র্যাক করুন',
      to: '/orders',
      icon: Package,
      iconColor: 'text-purple-600',
      bgGradient: 'from-purple-500/15 to-violet-500/15 border-purple-200/60'
    },
    {
      id: 'top',
      label: 'Bestsellers',
      sublabel: 'জনপ্রিয় পণ্য',
      to: '/products?filter=bestseller',
      icon: Sparkles,
      iconColor: 'text-rose-600',
      bgGradient: 'from-rose-500/15 to-pink-500/15 border-rose-200/60'
    }
  ];

  return (
    <section className="sm:hidden px-4 pt-3 pb-2">
      <div className="bg-white rounded-3xl p-3.5 border border-slate-200/80 shadow-xs">
        {/* Quick Voucher Banner Pill */}
        <div
          onClick={handleClaimVoucher}
          role="button"
          tabIndex={0}
          className="mb-3.5 p-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between shadow-sm cursor-pointer active:scale-98 transition-transform"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-black leading-tight">
                Claim ৳200 Off Voucher!
              </p>
              <p className="text-[9px] text-white/90">
                কুপন কোড: <span className="font-bold underline">WELCOME200</span>
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-white text-orange-600 text-[10px] font-black uppercase shadow-xs flex items-center gap-1 shrink-0">
            {claimedVoucher ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Claimed!</span>
              </>
            ) : (
              <span>Tap to Claim</span>
            )}
          </span>
        </div>

        {/* 5-Column Quick Circular Touch Nav */}
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.to}
                onClick={() => soundEngine.playPop()}
                className="flex flex-col items-center group py-1 active:scale-95 transition-transform"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.bgGradient} border flex items-center justify-center shadow-2xs relative group-hover:scale-105 transition-transform`}
                >
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded-full bg-rose-500 text-white text-[8px] font-black scale-90 shadow-2xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-800 line-clamp-1 mt-1.5 leading-tight">
                  {item.label}
                </span>
                <span className="text-[8px] font-medium text-slate-400 line-clamp-1">
                  {item.sublabel}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
