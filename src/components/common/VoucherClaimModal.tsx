import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Ticket,
  Sparkles,
  Check,
  Copy,
  Clock,
  Gift,
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface VoucherClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoucherClaimModal: React.FC<VoucherClaimModalProps> = ({ isOpen, onClose }) => {
  const { coupons, applyCoupon, appliedCoupon, addToast } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scratchPercent, setScratchPercent] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill canvas with shiny scratch layer
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative pattern
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ SCRATCH HERE ⚡', canvas.width / 2, canvas.height / 2 + 4);
  }, [isOpen, isScratched]);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleApply = (code: string) => {
    const res = applyCoupon(code);
    if (res.success) {
      onClose();
    }
  };

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    setScratchPercent((prev) => {
      const next = prev + 12;
      if (next >= 40) {
        setIsScratched(true);
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white p-6 relative select-none shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
              Exclusive Vouchers
            </span>
            <span className="flex items-center gap-1 text-[11px] text-white/90 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" /> Save up to ৳১,৫০০
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight">Claim Your Shopping Discounts</h2>
          <p className="text-xs text-white/90 mt-0.5">
            Collect special vouchers and apply them at checkout for instant savings.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Interactive Lucky Scratch Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-5 h-5 text-orange-600 animate-bounce" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Scratch & Win Lucky Bonus
              </h3>
            </div>

            <div className="relative w-full h-24 rounded-xl overflow-hidden bg-white border border-amber-200 flex items-center justify-between px-6 shadow-inner">
              {/* Prize revealed underneath */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Mystery Surprise Coupon
                </span>
                <span className="text-lg font-black text-orange-600 tracking-wider font-mono">
                  LUCKY250
                </span>
                <span className="text-[11px] text-slate-600 block">৳250 OFF on orders over ৳1,500</span>
              </div>

              <div>
                {isScratched ? (
                  <button
                    type="button"
                    onClick={() => handleApply('LUCKY250')}
                    className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs transition-transform hover:scale-105 cursor-pointer shadow-xs"
                  >
                    Apply Now
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400">
                    Rub canvas to reveal
                  </span>
                )}
              </div>

              {/* Scratch canvas overlay */}
              {!isScratched && (
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={100}
                  onMouseMove={handleScratch}
                  onTouchMove={handleScratch}
                  className="absolute inset-0 w-full h-full cursor-crosshair"
                />
              )}
            </div>
          </div>

          {/* Available Coupons List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Ticket className="w-4 h-4 text-orange-600" /> Available Store Coupons
            </h3>

            <div className="space-y-2.5">
              {coupons.map((c) => {
                const isApplied = appliedCoupon?.code === c.code;

                return (
                  <div
                    key={c.code}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isApplied
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {c.code}
                          </span>
                          <span className="text-xs font-bold text-emerald-600">
                            {c.discountType === 'percentage'
                              ? `${c.value}% OFF`
                              : `৳${c.value} OFF`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{c.description}</p>
                        <span className="text-[10px] text-slate-400">
                          Min. spend ৳{c.minOrderAmount.toLocaleString()} • Expires {c.expiresAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleCopy(c.code)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                        title="Copy Code"
                      >
                        {copiedCode === c.code ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApply(c.code)}
                        disabled={isApplied}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                          isApplied
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-orange-600 hover:bg-orange-500 text-white'
                        }`}
                      >
                        {isApplied ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% verified discounts
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
