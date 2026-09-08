import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  Gift,
  CheckCircle2,
  Copy,
  ArrowRight,
  RotateCw,
  Trophy,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface WheelSegment {
  label: string;
  sub: string;
  code: string;
  color: string;
  textColor: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
}

const SEGMENTS: WheelSegment[] = [
  {
    label: '৳100 OFF',
    sub: 'Min ৳999',
    code: 'LUCKY100',
    color: '#FF6B00',
    textColor: '#FFFFFF',
    discountType: 'fixed',
    value: 100,
    minSpend: 999
  },
  {
    label: '10% OFF',
    sub: 'Sitewide',
    code: 'SPIN10',
    color: '#1E293B',
    textColor: '#FFFFFF',
    discountType: 'percentage',
    value: 10,
    minSpend: 1200
  },
  {
    label: 'FREE SHIP',
    sub: 'Zero Delivery',
    code: 'FREESHIP',
    color: '#10B981',
    textColor: '#FFFFFF',
    discountType: 'fixed',
    value: 60,
    minSpend: 500
  },
  {
    label: '৳250 OFF',
    sub: 'Mega Deal',
    code: 'MEGA250',
    color: '#8B5CF6',
    textColor: '#FFFFFF',
    discountType: 'fixed',
    value: 250,
    minSpend: 2500
  },
  {
    label: '৳50 OFF',
    sub: 'Quick Saver',
    code: 'SAVER50',
    color: '#F59E0B',
    textColor: '#FFFFFF',
    discountType: 'fixed',
    value: 50,
    minSpend: 500
  },
  {
    label: '15% VIP',
    sub: 'Max ৳600',
    code: 'VIP15',
    color: '#EC4899',
    textColor: '#FFFFFF',
    discountType: 'percentage',
    value: 15,
    minSpend: 3000
  },
  {
    label: '৳500 JACKPOT',
    sub: 'Super Win',
    code: 'JACKPOT500',
    color: '#DC2626',
    textColor: '#FFFFFF',
    discountType: 'fixed',
    value: 500,
    minSpend: 4000
  },
  {
    label: '৳150 VOUCHER',
    sub: 'Min ৳1500',
    code: 'FLASH150',
    color: '#0284C7',
    textColor: '#FFFFFF',
    discountType: 'fixed',
    value: 150,
    minSpend: 1500
  }
];

export const LuckySpinWheelModal: React.FC = () => {
  const {
    isLuckyWheelOpen,
    setIsLuckyWheelOpen,
    addCoupon,
    applyCoupon,
    addToast
  } = useStore();

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<WheelSegment | null>(null);
  const [copied, setCopied] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(2);

  const wheelRef = useRef<SVGSVGElement>(null);

  if (!isLuckyWheelOpen) return null;

  const handleSpin = () => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setWonPrize(null);
    setCopied(false);

    // Pick a random winning segment index
    const winningIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length; // 45 deg

    // Extra full spins (5 to 8 full revolutions)
    const extraSpins = 360 * 6;
    // Calculate target angle pointing to the top pointer
    // Pointer is at 270 deg or 90 deg. Let pointer be top (0 deg / 360 deg).
    const targetOffset = 360 - (winningIndex * segmentAngle + segmentAngle / 2);
    const nextRotation = rotation + extraSpins + (targetOffset - (rotation % 360));

    setRotation(nextRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = SEGMENTS[winningIndex];
      setWonPrize(prize);
      setSpinsLeft((prev) => Math.max(0, prev - 1));

      // Auto add coupon to wallet
      addCoupon({
        code: prize.code,
        discountType: prize.discountType,
        value: prize.value,
        minOrderAmount: prize.minSpend,
        description: `Lucky Wheel Spin Prize: ${prize.label} (${prize.sub})`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        active: true
      });

      addToast({
        type: 'success',
        title: 'Congratulations! 🎉',
        message: `You won ${prize.label}! Voucher code ${prize.code} added to your account.`
      });
    }, 4000);
  };

  const handleApplyCoupon = (prize: WheelSegment) => {
    const res = applyCoupon(prize.code);
    if (res.success) {
      addToast({
        type: 'success',
        title: 'Voucher Applied',
        message: `${prize.code} applied to your cart successfully!`
      });
      setIsLuckyWheelOpen(false);
    } else {
      // Copy to clipboard instead
      navigator.clipboard?.writeText(prize.code);
      setCopied(true);
      addToast({
        type: 'info',
        title: 'Coupon Copied',
        message: `Code ${prize.code} copied! Apply it when your cart total meets the minimum spend.`
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-rose-600 p-5 text-white text-center relative select-none">
          <button
            type="button"
            onClick={() => setIsLuckyWheelOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Daily Lucky Spin & Win</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">লাকি ড্র ঘুরিয়ে ভাউচার জিতুন</h2>
          <p className="text-xs text-white/90 mt-1">
            প্রতিদিন স্পিন করে পান ৳৫০০ পর্যন্ত আকর্ষণীয় ছাড় ও ফ্রি শিপিং!
          </p>
        </div>

        {/* Wheel Body */}
        <div className="p-6 flex flex-col items-center bg-slate-50">
          {/* Wheel Container */}
          <div className="relative w-72 h-72 my-2 select-none">
            {/* Top Indicator Arrow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400 drop-shadow-md" />

            {/* Rotating SVG Wheel */}
            <svg
              ref={wheelRef}
              viewBox="0 0 300 300"
              className="w-full h-full rounded-full shadow-xl"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none'
              }}
            >
              {SEGMENTS.map((seg, idx) => {
                const angle = 360 / SEGMENTS.length;
                const startAngle = idx * angle;
                const endAngle = startAngle + angle;

                // SVG slice path
                const x1 = 150 + 145 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                const y1 = 150 + 145 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                const x2 = 150 + 145 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                const y2 = 150 + 145 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                const pathData = `M 150 150 L ${x1} ${y1} A 145 145 0 0 1 ${x2} ${y2} Z`;

                const textAngle = startAngle + angle / 2;

                return (
                  <g key={idx}>
                    <path d={pathData} fill={seg.color} stroke="#FFFFFF" strokeWidth="2" />
                    <g
                      transform={`rotate(${textAngle}, 150, 150) translate(150, 45)`}
                      textAnchor="middle"
                    >
                      <text
                        x="0"
                        y="0"
                        fill={seg.textColor}
                        fontSize="11"
                        fontWeight="900"
                        transform="rotate(90)"
                      >
                        {seg.label}
                      </text>
                    </g>
                  </g>
                );
              })}
              {/* Outer Golden Ring */}
              <circle cx="150" cy="150" r="147" fill="none" stroke="#F59E0B" strokeWidth="4" />
            </svg>

            {/* Center Spin Button Hub */}
            <button
              type="button"
              onClick={handleSpin}
              disabled={isSpinning || spinsLeft <= 0}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-18 h-18 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 border-4 border-white shadow-xl flex flex-col items-center justify-center text-white font-black text-xs cursor-pointer hover:scale-105 active:scale-95 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <RotateCw className={`w-5 h-5 mb-0.5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'SPINNING' : 'SPIN'}</span>
            </button>
          </div>

          {/* Spins Remaining Banner */}
          <div className="flex items-center gap-2 mt-3 text-xs font-bold text-slate-600">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>আজকের ফ্রি স্পিন বাকি: <strong className="text-orange-600 font-black">{spinsLeft} বার</strong></span>
            {spinsLeft <= 0 && (
              <button
                type="button"
                onClick={() => setSpinsLeft(2)}
                className="text-[10px] text-orange-600 underline font-bold cursor-pointer ml-1"
              >
                (Reset for Demo)
              </button>
            )}
          </div>

          {/* Won Prize Popup Section */}
          {wonPrize && (
            <div className="mt-4 w-full p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 animate-in zoom-in-95 duration-200 text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                <Gift className="w-3 h-3" /> Winner
              </div>
              <h3 className="text-base font-black text-slate-900">
                আপনি পেয়েছেন {wonPrize.label}! ({wonPrize.sub})
              </h3>
              <div className="p-2.5 bg-white rounded-xl border border-dashed border-amber-400 flex items-center justify-between">
                <span className="font-mono text-sm font-black text-orange-600 tracking-wider">
                  {wonPrize.code}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(wonPrize.code);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleApplyCoupon(wonPrize)}
                className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Apply Voucher to Cart Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
          * ভাউচারটি চেকআউট পেইজে সরাসরি ডিসকাউন্টের জন্য ব্যবহার করা যাবে।
        </div>
      </div>
    </div>
  );
};
