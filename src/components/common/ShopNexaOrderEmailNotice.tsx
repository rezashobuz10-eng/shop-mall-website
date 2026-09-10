import React, { useState } from 'react';
import {
  Mail,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Send,
  Lock,
  RefreshCw,
  X,
  Package,
  Clock,
  Inbox
} from 'lucide-react';
import { Order } from '../../types';
import { Logo } from './Logo';
import { dispatchShopNexaOrderEmail, getGmailComposeUrl } from '../../lib/firebase';
import { useStore } from '../../context/StoreContext';

interface ShopNexaOrderEmailNoticeProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const ShopNexaOrderEmailNotice: React.FC<ShopNexaOrderEmailNoticeProps> = ({
  order,
  isOpen,
  onClose
}) => {
  const { addToast } = useStore();
  const [copiedCode, setCopiedCode] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  if (!isOpen) return null;

  const customerEmail =
    order.customerEmail ||
    order.emailSentTo ||
    (order.shippingAddress as any)?.email ||
    'customer@gmail.com';

  const customerName =
    order.shippingAddress?.fullName ||
    order.customerName ||
    'সম্মানিত গ্রাহক';

  const orderNum = order.orderNumber || order.id;
  const confirmationCode = order.orderConfirmationCode || `SNX-${orderNum.replace(/[^0-9]/g, '').slice(-6) || '849201'}`;
  const trackingNum = order.trackingNumber || `STF-${orderNum.slice(-6).toUpperCase()}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(confirmationCode);
    setCopiedCode(true);
    addToast({
      type: 'success',
      title: 'কনফার্মেশন কোড কপি হয়েছে!',
      message: `${confirmationCode} কোডটি কপি করা হয়েছে।`
    });
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleResendToGmail = async () => {
    setIsResending(true);
    try {
      await dispatchShopNexaOrderEmail({
        orderId: order.id,
        orderNumber: orderNum,
        orderCode: confirmationCode,
        trackingNumber: trackingNum,
        customerEmail: customerEmail,
        customerName: customerName,
        total: order.total,
        itemsCount: order.items.length
      });

      setResendSuccess(true);
      addToast({
        type: 'success',
        title: 'জিমেইলে কোড পাঠানো হয়েছে! 📧',
        message: `ShopNexa কনফার্মেশন কোড (${confirmationCode}) ${customerEmail}-এ সফলভাবে পাঠানো হয়েছে।`
      });
      setTimeout(() => setResendSuccess(false), 4000);
    } catch {
      addToast({
        type: 'error',
        title: 'প্রেরণ ব্যর্থ',
        message: 'ইমেইল কোড পাঠাতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।'
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-orange-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-orange-400">
                  ShopNexa Official Email Dispatch
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Sent via Gmail
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">
                অর্ডার কনফার্মেশন কোড (Gmail Confirmation)
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gmail Preview Mock Container */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Email Headers Meta Box */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="font-bold text-slate-700">From:</span>
                <span className="font-medium text-slate-900">
                  ShopNexa Official &lt;orders@shopnexa.com&gt;
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                Just now (এখনই প্রেরিত)
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="font-bold text-slate-700">To:</span>
                <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                  {customerEmail}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Inbox Delivered
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <span className="font-bold text-slate-700">Subject:</span>
              <span className="font-semibold text-slate-800 truncate">
                [ShopNexa] অর্ডার কনফার্মেশন কোড: {confirmationCode} • Order #{orderNum}
              </span>
            </div>
          </div>

          {/* Rendered Email Body */}
          <div className="bg-gradient-to-b from-orange-50/30 to-white rounded-3xl border border-orange-100 p-6 shadow-sm text-center">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Logo size="md" />
            </div>

            <h2 className="text-xl font-black text-slate-900 mb-1">
              আপনার অর্ডার সফল হয়েছে! 🎉
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto mb-6">
              প্রিয় <strong>{customerName}</strong>, ShopNexa বাংলাদেশ থেকে কেনাকাটা করার জন্য ধন্যবাদ। আপনার অর্ডারের অফিসিয়াল কনফার্মেশন কোড নিচে দেওয়া হলো:
            </p>

            {/* Verification Code Display Card */}
            <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-orange-500/40 p-5 shadow-lg relative overflow-hidden mb-6">
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-[9px] font-black uppercase px-3 py-0.5 rounded-bl-xl tracking-wider">
                Official Security Code
              </div>

              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-widest mb-1.5">
                ShopNexa Order Verification Code
              </span>

              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-3xl sm:text-4xl font-black text-orange-600 tracking-wider">
                  {confirmationCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="কোড কপি করুন"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'কপি হয়েছে' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-2.5">
                🔒 পার্সেল ডেলিভারি গ্রহণের সময় বা কুরিয়ার রাইডারকে এই কোডটি ভেরিফিকেশন হিসেবে দেখান।
              </p>
            </div>

            {/* Quick Order Highlights Table */}
            <div className="max-w-md mx-auto grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs mb-5">
              <div>
                <span className="text-[10px] text-slate-400 block">Order Number</span>
                <span className="font-bold text-slate-900 block truncate">#{orderNum}</span>
              </div>
              <div className="border-l border-slate-200 pl-2">
                <span className="text-[10px] text-slate-400 block">Total Amount</span>
                <span className="font-bold text-orange-600 block">৳{order.total.toLocaleString()}</span>
              </div>
              <div className="border-l border-slate-200 pl-2">
                <span className="text-[10px] text-slate-400 block">Tracking ID</span>
                <span className="font-mono font-bold text-slate-700 block truncate">{trackingNum}</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                এই কনফার্মেশন কোডটি ফায়ারস্টোর ক্লাউড ডাটাবেসে স্থায়ীভাবে রেকর্ড করা হয়েছে।
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleResendToGmail}
              disabled={isResending}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>{resendSuccess ? 'পুনরায় পাঠানো হয়েছে!' : 'Resend Code to Gmail'}</span>
            </button>

            <a
              href="https://mail.google.com/mail/u/0/#search/ShopNexa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Inbox className="w-3.5 h-3.5 text-amber-300" />
              <span>Open Gmail (ইনবক্স খুলুন)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={getGmailComposeUrl(
                customerEmail,
                `[ShopNexa] অর্ডার কনফার্মেশন কোড: ${confirmationCode} (Order #${orderNum})`,
                `প্রিয় ${customerName},\n\nআপনার ShopNexa অর্ডার কোড: ${confirmationCode}\nঅর্ডার নম্বর: #${orderNum}\nট্র্যাকিং নম্বর: ${trackingNum}\nমোট মূল্য: ৳${order.total.toLocaleString()}\n\nShopNexa Support Team`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Compose in Gmail</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            Done (ঠিক আছে)
          </button>
        </div>
      </div>
    </div>
  );
};
