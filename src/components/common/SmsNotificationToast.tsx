import React, { useState, useEffect } from 'react';
import { MessageSquare, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface SmsNotificationToastProps {
  orderId: string;
  trackingNumber: string;
  amount: number;
  phone: string;
  customerName: string;
  onClose: () => void;
}

export const SmsNotificationToast: React.FC<SmsNotificationToastProps> = ({
  orderId,
  trackingNumber,
  amount,
  phone,
  customerName,
  onClose
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 p-4 animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-orange-600 flex items-center justify-center text-white shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-wide">MESSAGES • SHOPNEXA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <span className="text-[10px] text-slate-400">Official SMS Gateway • Just now</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs text-slate-200 font-mono leading-relaxed">
        <p className="text-amber-300 font-bold mb-1">[ShopNexa BD]</p>
        <p>
          Dear {customerName}, your Order <span className="text-orange-400 font-bold">#{orderId}</span> (৳{amount.toLocaleString()}) has been confirmed!
        </p>
        <p className="mt-1 text-[11px] text-slate-300">
          Tracking ID: <span className="text-emerald-400 font-bold">{trackingNumber}</span> via Steadfast Courier.
        </p>
        <p className="mt-1 text-[10px] text-slate-400">
          Helpline: 09612-SHOPNEXA • Thanks for shopping!
        </p>
      </div>
    </div>
  );
};
