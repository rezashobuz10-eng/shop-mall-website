import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShieldCheck,
  Navigation,
  FileText,
  Copy,
  Check,
  Gift,
  PhoneCall,
  MessageSquare,
  Sparkles,
  Printer,
  ShoppingBag,
  Calendar,
  CreditCard,
  MapPin,
  Clock,
  ExternalLink,
  Heart,
  Mail,
  RefreshCw,
  Inbox,
  AlertTriangle,
  MessageCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderTrackingModal } from '../components/common/OrderTrackingModal';
import { TaxInvoiceModal } from '../components/common/TaxInvoiceModal';
import { SmsNotificationToast } from '../components/common/SmsNotificationToast';
import { ShopNexaOrderEmailNotice } from '../components/common/ShopNexaOrderEmailNotice';
import { soundEngine } from '../utils/audioFeedback';
import { FALLBACK_PRODUCT_IMAGE, handleImageError, sanitizeImageUrl } from '../utils/imageUtils';
import { extractPaymentDetails } from '../utils/paymentValidation';
import { getGmailComposeUrl, getWhatsAppShareUrl, dispatchShopNexaOrderEmail } from '../lib/firebase';
import { Order } from '../types';

export const ThankYouPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, addToast, setIsLiveChatOpen } = useStore();
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showSmsToast, setShowSmsToast] = useState(true);
  const [showEmailNoticeModal, setShowEmailNoticeModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [couponCopied, setCouponCopied] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [resendStatusMsg, setResendStatusMsg] = useState<string | null>(null);

  // 1. Check router state (passed directly from CheckoutPage navigate)
  const stateOrder = (location.state as { order?: Order } | undefined)?.order;

  // 2. Find order from store orders by ID, orderNumber, or trackingNumber
  const foundOrder = id
    ? orders.find(
        (o) =>
          o.id === id ||
          (o.orderNumber && o.orderNumber.toLowerCase() === id.toLowerCase()) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase() === id.toLowerCase())
      )
    : undefined;

  // 3. Check localStorage cache in case state batching hasn't flushed
  let cachedOrder: Order | undefined;
  if (!stateOrder && !foundOrder) {
    try {
      const latestRaw = localStorage.getItem('sn_latest_order');
      if (latestRaw) {
        const parsed = JSON.parse(latestRaw) as Order;
        if (!id || parsed.id === id || parsed.orderNumber === id) {
          cachedOrder = parsed;
        }
      }
      if (!cachedOrder) {
        const allRaw = localStorage.getItem('sn_orders');
        if (allRaw) {
          const allOrders = JSON.parse(allRaw) as Order[];
          if (id) {
            cachedOrder = allOrders.find(
              (o) =>
                o.id === id ||
                (o.orderNumber && o.orderNumber.toLowerCase() === id.toLowerCase()) ||
                (o.trackingNumber && o.trackingNumber.toLowerCase() === id.toLowerCase())
            );
          }
          if (!cachedOrder && allOrders.length > 0) {
            cachedOrder = allOrders[0];
          }
        }
      }
    } catch {
      // ignore JSON parse error
    }
  }

  // 4. Resolve the order safely
  const order: Order | undefined = stateOrder || foundOrder || cachedOrder || orders[0];

  useEffect(() => {
    soundEngine.playOrderSuccess();
  }, []);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    addToast({
      type: 'info',
      title: 'কপি করা হয়েছে!',
      message: `${fieldName} ক্লিপবোর্ডে কপি করা হয়েছে।`
    });
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('THANKYOU10');
    setCouponCopied(true);
    addToast({
      type: 'success',
      title: 'কুপন কোড কপি হয়েছে!',
      message: 'THANKYOU10 কোডটি পরবর্তী অর্ডারে ১০% ছাড় পেতে ব্যবহার করুন।'
    });
    setTimeout(() => setCouponCopied(false), 3000);
  };

  const handleResendOrderCode = async () => {
    if (!order) return;
    setIsResendingCode(true);
    setResendStatusMsg(null);
    try {
      const result = await dispatchShopNexaOrderEmail({
        orderId: order.id,
        orderNumber: order.orderNumber || order.id,
        orderCode: order.orderConfirmationCode || `SNX-${(order.orderNumber || order.id).replace(/[^0-9]/g, '').slice(-6) || '849201'}`,
        trackingNumber: order.trackingNumber,
        customerEmail: order.customerEmail || (order.shippingAddress as any)?.email || 'customer@gmail.com',
        customerName: order.shippingAddress?.fullName || order.customerName || 'Valued Customer',
        total: order.total,
        itemsCount: order.items.length
      });

      if (result.delivered) {
        setResendStatusMsg(`সরাসরি জিমেইলে সফলভাবে পৌঁছেছে! (${result.recipient})`);
        addToast({
          type: 'success',
          title: 'কোড জিমেইলে প্রেরিত 📧',
          message: `${result.recipient} ঠিকানায় অফিসিয়াল ইমেইল সফলভাবে পাঠানো হয়েছে।`
        });
      } else {
        setResendStatusMsg(`কোড নিশ্চিত ও প্রস্তুত আছে। ইনবক্স/স্প্যাম ফোল্ডার চেক করুন।`);
        addToast({
          type: 'info',
          title: 'ইমেইল কোড আপডেট 📧',
          message: `কোড: ${result.orderCode} • ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।`
        });
      }
    } catch {
      setResendStatusMsg('ইমেইল সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে। স্ক্রিনে থাকা কোডটি সেভ করে রাখুন।');
    } finally {
      setIsResendingCode(false);
      setTimeout(() => setResendStatusMsg(null), 7000);
    }
  };

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
          <Heart className="w-10 h-10 animate-pulse text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Thank You for Visiting!</h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
          আপনার অর্ডারটি সিস্টেমে সংরক্ষিত হয়েছে। সাম্প্রতিক অর্ডারের স্ট্যাটাস দেখতে নিচের বাটনে ক্লিক করুন।
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/orders"
            className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            Go to My Orders
          </Link>
          <Link
            to="/"
            className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const paymentDetails = extractPaymentDetails(order);
  const customerName = order.shippingAddress?.fullName || order.customerName || 'সম্মানিত গ্রাহক';
  const customerPhone = order.shippingAddress?.phone || order.customerPhone || 'N/A';
  const displayAddress =
    (order.shippingAddress as { fullAddress?: string; address?: string })?.fullAddress ||
    (order.shippingAddress as { fullAddress?: string; address?: string })?.address ||
    'Standard Courier Delivery';

  const orderNum = order.orderNumber || order.id;
  const trackingNum = order.trackingNumber || `STF-${orderNum.slice(-6).toUpperCase()}`;
  const customerEmail =
    order.customerEmail ||
    order.emailSentTo ||
    (order.shippingAddress as any)?.email ||
    'customer@gmail.com';
  const confirmationCode =
    order.orderConfirmationCode ||
    `SNX-${orderNum.replace(/[^0-9]/g, '').slice(-6) || '849201'}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-slate-50 to-slate-100/60 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Celebration Thank You Header Card */}
        <div className="relative bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xl mb-6 overflow-hidden text-center">
          
          {/* Top Decorative Confetti/Gradient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-r from-orange-400/20 via-amber-400/30 to-emerald-400/20 blur-3xl pointer-events-none" />

          {/* Animated Celebration Icon */}
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.5]" />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 border-2 border-white">
              <Sparkles className="w-3 h-3 fill-slate-900" />
              Confirmed
            </span>
          </div>

          {/* Thank You Main Title */}
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            ধন্যবাদ, {customerName}! 🎉
          </h1>
          <p className="text-sm sm:text-base font-bold text-orange-600 mb-2">
            Thank You for Your Order! আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।
          </p>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed mb-6">
            আমরা আপনার অর্ডারটি গ্রহণ করেছি এবং সেলারকে দ্রুত পার্সেল প্রস্তুত করার নির্দেশনা দিয়েছি। শীঘ্রই আপনি নিশ্চিতকরণ এসএমএস এবং ডেলিভারি আপডেট পাবেন।
          </p>

          {/* Fast Information Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 mb-6 text-left">
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">Order Number</span>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-slate-900 truncate">{orderNum}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(orderNum, 'Order Number')}
                  className="text-slate-400 hover:text-orange-600 p-0.5 cursor-pointer"
                  title="অর্ডার নম্বর কপি করুন"
                >
                  {copiedField === 'Order Number' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="border-l border-slate-200 pl-3">
              <span className="text-slate-400 block text-[11px] mb-0.5">Tracking Number</span>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-orange-600 font-mono truncate">{trackingNum}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(trackingNum, 'Tracking Number')}
                  className="text-slate-400 hover:text-orange-600 p-0.5 cursor-pointer"
                  title="ট্র্যাকিং কোড কপি করুন"
                >
                  {copiedField === 'Tracking Number' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="border-l border-slate-200 pl-3">
              <span className="text-slate-400 block text-[11px] mb-0.5">Payment Method</span>
              <span className="font-extrabold text-slate-900 block truncate">
                {paymentDetails.providerName}
              </span>
              <span className={`text-[10px] font-bold ${paymentDetails.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                ● {paymentDetails.statusBadge}
              </span>
            </div>

            <div className="border-l border-slate-200 pl-3">
              <span className="text-slate-400 block text-[11px] mb-0.5">Estimated Delivery</span>
              <span className="font-extrabold text-slate-900 block">
                {order.estimatedDelivery || '২ - ৩ কার্যদিবস'}
              </span>
              <span className="text-[10px] text-slate-400 block">ডোরস্টেপ হোম ডেলিভারি</span>
            </div>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowTrackingModal(true)}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-orange-600/20 cursor-pointer hover:scale-102"
            >
              <Navigation className="w-4 h-4" />
              <span>লাইভ কুরিয়ার ট্র্যাকিং</span>
            </button>

            <button
              type="button"
              onClick={() => setShowInvoiceModal(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-800 bg-white hover:bg-slate-50 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <FileText className="w-4 h-4 text-orange-600" />
              <span>ট্যাক্স চালান (Mushak-6.3)</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>রসিদ প্রিন্ট করুন</span>
            </button>
          </div>
        </div>

        {/* ShopNexa Official Gmail Verification Code Card */}
        <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl mb-6 border border-orange-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/20 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                      ShopNexa Official Email Dispatch
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active Dispatch Engine
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    আপনার জিমেইলে কনফার্মেশন কোড পাঠানো হয়েছে! 📧
                  </h3>
                  <p className="text-xs text-slate-300">
                    ShopNexa-এর পক্ষ থেকে <strong className="text-orange-300 font-bold">{customerEmail}</strong> জিমেইলে অফিসিয়াল সিকিউরিটি কনফার্মেশন কোড প্রেরণ করা হয়েছে।
                  </p>
                </div>
              </div>

              {/* Verification Code Box & Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 shrink-0">
                <div className="text-center sm:text-left px-2">
                  <span className="text-[10px] text-orange-300 font-bold block uppercase tracking-wider">
                    Official Order Code
                  </span>
                  <span className="font-mono text-2xl font-black text-white tracking-widest">
                    {confirmationCode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(confirmationCode, 'অর্ডার কোড')}
                    className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {copiedField === 'অর্ডার কোড' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'অর্ডার কোড' ? 'কপি হয়েছে' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowEmailNoticeModal(true)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
                    <span>View Template</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Gmail & Resend Interactive Actions Bar */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleResendOrderCode}
                  disabled={isResendingCode}
                  className="px-3.5 py-2 rounded-xl bg-orange-600/90 hover:bg-orange-500 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResendingCode ? 'animate-spin' : ''}`} />
                  <span>{isResendingCode ? 'পাঠানো হচ্ছে...' : 'পুনরায় ইমেইল কোড পাঠান (Resend)'}</span>
                </button>

                <a
                  href={`https://mail.google.com/mail/u/0/#search/ShopNexa`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Inbox className="w-3.5 h-3.5 text-amber-300" />
                  <span>জিমেইল ইনবক্স খুলুন (Open Gmail)</span>
                  <ExternalLink className="w-3 h-3 text-slate-300" />
                </a>

                <a
                  href={getWhatsAppShareUrl(
                    order.shippingAddress?.phone,
                    `প্রিয় ${customerName}, ShopNexa-তে আপনার অর্ডার কনফার্মেশন কোড: *${confirmationCode}* (অর্ডার #${orderNum})। মোট মূল্য: ৳${order.total.toLocaleString()}। ট্র্যাকিং: ${trackingNum}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-white" />
                  <span>হোয়াটসঅ্যাপে কোড সেভ করুন (WhatsApp)</span>
                  <ExternalLink className="w-3 h-3 text-emerald-200" />
                </a>

                <a
                  href={getGmailComposeUrl(
                    customerEmail,
                    `[ShopNexa] অর্ডার কনফার্মেশন কোড: ${confirmationCode} (Order #${orderNum})`,
                    `প্রিয় ${customerName},\n\nআপনার ShopNexa অর্ডার কনফার্মেশন কোড: ${confirmationCode}\nঅর্ডার নম্বর: #${orderNum}\nট্র্যাকিং নম্বর: ${trackingNum}\nমোট মূল্য: ৳${order.total.toLocaleString()}\n\nShopNexa Support Desk`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>জিমেইল থেকে কম্পোজ</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {resendStatusMsg && (
                <span className="text-amber-300 font-medium animate-pulse">
                  {resendStatusMsg}
                </span>
              )}
            </div>

            {/* Helpful Troubleshooting / Spam Guidance Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-[11px] text-slate-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-amber-300 block">জিমেইলে সরাসরি ইনবক্সে কোড না পেলে:</span>
                <p className="text-slate-300 leading-relaxed">
                  ১. Google-এর ফিল্টারের কারণে মেসেজটি অনেক সময় জিমেইলের <strong>Spam (স্প্যাম)</strong> অথবা <strong>Promotions (প্রমোশন)</strong> ফোল্ডারে চলে যেতে পারে, অনুগ্রহ করে সেখানে চেক করুন।<br />
                  ২. স্ক্রিনে প্রদর্শিত কোড <span className="font-mono font-black text-white bg-white/10 px-1 rounded">{confirmationCode}</span>-টি নোট করে রাখুন, এটি সরাসরি আপনার ডেলিভারি রাইডারের জন্য প্রযোজ্য।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Thank You Gift / Reward Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 sm:p-6 text-white shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
              <Gift className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Special Thank You Gift</span>
              </div>
              <h3 className="text-base sm:text-lg font-black leading-snug">
                আপনার পরবর্তী অর্ডারের জন্য ১০% বিশেষ ছাড় ভাউচার!
              </h3>
              <p className="text-xs text-white/90">
                আমাদের সাথে থাকার জন্য ধন্যবাদ। চেকআউটে কোডটি ব্যবহার করে ১০% ডিসকাউন্ট উপভোগ করুন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shrink-0">
            <span className="px-3 py-1 font-mono font-black text-sm tracking-wider text-amber-200 select-all">
              THANKYOU10
            </span>
            <button
              type="button"
              onClick={handleCopyCoupon}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              {couponCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{couponCopied ? 'কপি হয়েছে' : 'কপি কোড'}</span>
            </button>
          </div>
        </div>

        {/* What Happens Next? (পরবর্তী ধাপসমূহ) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm mb-6">
          <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span>What Happens Next? (পরবর্তী ধাপসমূহ)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-xs mb-3 shadow-xs">
                ১
              </div>
              <h4 className="font-black text-slate-900 text-xs mb-1">অর্ডার নিশ্চিতকরণ</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                আপনার দেওয়া নম্বরে তাৎক্ষণিক কনফার্মেশন এসএমএস পাঠানো হয়েছে।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100">
              <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-xs mb-3 shadow-xs">
                ২
              </div>
              <h4 className="font-black text-slate-900 text-xs mb-1">কোয়ালিটি চেক ও প্যাকিং</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                সেলার ১০০% জেনুইন প্রোডাক্ট যাচাই করে ৩-লেয়ার বাবল র‍্যাপে প্যাক করবে।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs mb-3 shadow-xs">
                ৩
              </div>
              <h4 className="font-black text-slate-900 text-xs mb-1">কুরিয়ারে হস্তান্তর</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                স্টিভাস্ট বা রেডএক্স কুরিয়ারে পার্সেল বুকিং দিয়ে লাইভ ট্র্যাকিং চালু হবে।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs mb-3 shadow-xs">
                ৪
              </div>
              <h4 className="font-black text-slate-900 text-xs mb-1">হোম ডেলিভারি</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                ডেলিভারি রাইডার কল করে আপনার ঠিকানায় সরাসরি পার্সেল বুঝিয়ে দেবে।
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Purchased Items & Delivery/Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Purchased Items List (2 cols) */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-orange-600" />
                Purchased Items ({order.items.length})
              </span>
              <span className="text-[11px] font-normal text-slate-400">
                Total: ৳{order.total.toLocaleString()}
              </span>
            </h3>

            <div className="space-y-3 divide-y divide-slate-100">
              {order.items.map((item, idx) => {
                const itemTitle = item.product?.title || item.title || 'Marketplace Product';
                const itemImage = item.product?.images?.[0] || item.image || FALLBACK_PRODUCT_IMAGE;
                const itemCategory = item.product?.category || 'General';

                return (
                  <div key={idx} className="flex items-center justify-between gap-3 pt-3 first:pt-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={sanitizeImageUrl(itemImage, itemCategory)}
                        alt={itemTitle}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                        className="w-14 h-14 object-cover rounded-2xl bg-slate-50 border border-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">{itemTitle}</p>
                        <span className="text-slate-400 text-xs block">
                          পরিমাণ: {item.quantity} × ৳{item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="font-black text-slate-900 text-sm shrink-0">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Total breakdown */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal (সাবটোটাল)</span>
                <span className="font-semibold text-slate-700">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Charge (ডেলিভারি চার্জ)</span>
                <span className="font-semibold text-slate-700">৳{order.shippingFee.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Special Discount (ভাউচার ছাড়)</span>
                  <span>-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>সর্বমোট (Grand Total)</span>
                <span className="text-orange-600 text-lg">৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address & Customer Info (1 col) */}
          <div className="space-y-6">
            
            {/* Delivery Destination */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm text-xs">
              <h4 className="font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                ডেলিভারি ঠিকানা
              </h4>
              <div className="space-y-1 text-slate-600">
                <p className="font-extrabold text-slate-900 text-sm">{customerName}</p>
                <p className="leading-relaxed">{displayAddress}</p>
                <p className="font-medium text-slate-800 pt-1">
                  ফোন: <span className="font-bold text-slate-900">{customerPhone}</span>
                </p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm text-xs">
              <h4 className="font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-orange-600" />
                পেমেন্ট বিবরণ
              </h4>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">মাধ্যম:</span>
                  <span className="font-bold text-slate-900">{paymentDetails.providerName}</span>
                </div>

                {paymentDetails.trxId && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">TrxID:</span>
                    <span className="font-mono font-bold text-slate-800">{paymentDetails.trxId}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-slate-400">স্ট্যাটাস:</span>
                  <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${paymentDetails.isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {paymentDetails.statusBadge}
                  </span>
                </div>
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm text-xs">
              <div className="flex items-center gap-2 font-bold mb-2">
                <PhoneCall className="w-4 h-4 text-orange-400" />
                <span>যেকোনো প্রয়োজনে সাহায্য</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                অর্ডার পরিবর্তন, কুরিয়ার আপডেট বা বিশেষ নির্দেশনার জন্য আমাদের ২৪/৭ সাপোর্ট প্রস্তুত।
              </p>
              <button
                type="button"
                onClick={() => setIsLiveChatOpen(true)}
                className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>লাইভ সাপোর্ট চ্যাট</span>
              </button>
            </div>
          </div>
        </div>

        {/* 10/10 Trust & Buyer Protection Assurance */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
              10/10 Official Buyer Protection Guarantee
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                ✓
              </div>
              <div>
                <p className="font-bold text-slate-900">১০০% আসল পণ্য গ্যারান্টি</p>
                <p className="text-[11px] text-slate-500">অনুমোদিত ব্র্যান্ড ও ভেরিফাইড সেলারের পণ্য।</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                ✓
              </div>
              <div>
                <p className="font-bold text-slate-900">৭ দিনের রিটার্ন ও রিফান্ড</p>
                <p className="text-[11px] text-slate-500">পণ্য পছন্দ না হলে বা ত্রুটি থাকলে সহজ রিফান্ড।</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                ✓
              </div>
              <div>
                <p className="font-bold text-slate-900">নিরাপদ পেমেন্ট নিশ্চয়তা</p>
                <p className="text-[11px] text-slate-500">বিকাশ, নগদ ও ক্যাশ অন ডেলিভারি সুরক্ষা।</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>আমার সকল অর্ডার দেখুন (My Orders)</span>
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 transition-all cursor-pointer hover:scale-102"
          >
            <span>আরো কেনাকাটা করুন (Continue Shopping)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Modals & Notification Toasts */}
        {order && (
          <OrderTrackingModal
            isOpen={showTrackingModal}
            onClose={() => setShowTrackingModal(false)}
            order={order as unknown as Order}
          />
        )}

        {order && (
          <TaxInvoiceModal
            isOpen={showInvoiceModal}
            onClose={() => setShowInvoiceModal(false)}
            order={order as unknown as Order}
          />
        )}

        {showSmsToast && order && (
          <SmsNotificationToast
            orderId={order.id}
            trackingNumber={trackingNum}
            amount={order.total}
            phone={customerPhone}
            customerName={customerName}
            onClose={() => setShowSmsToast(false)}
          />
        )}

        {order && (
          <ShopNexaOrderEmailNotice
            order={order}
            isOpen={showEmailNoticeModal}
            onClose={() => setShowEmailNoticeModal(false)}
          />
        )}
      </div>
    </div>
  );
};
