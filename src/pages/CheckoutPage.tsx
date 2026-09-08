import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  User,
  ChevronRight,
  CheckCircle2,
  Lock,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderItem } from '../types';
import { PaymentGatewayModal } from '../components/common/PaymentGatewayModal';
import { sanitizeImageUrl, handleImageError, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';
import {
  MFS_CONFIGS,
  validateMfsTrxId,
  generateDemoTrxId,
  isMfsPaymentMethod,
  type MfsProvider
} from '../utils/paymentValidation';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotal,
    appliedCoupon,
    createOrder,
    currentUser,
    addToast
  } = useStore();

  const navigate = useNavigate();

  // If cart is empty, redirect safely
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cart.length, navigate]);

  // Address Form State
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Tanzim Hasan',
    phone: currentUser?.phone || '01712345678',
    division: 'Dhaka',
    city: 'Dhaka - North',
    thana: 'Gulshan',
    address: 'House 42, Road 11, Block D, Banani',
    note: ''
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<
    'cod' | 'bkash' | 'nagad' | 'rocket' | 'card'
  >('bkash');

  // Unified MFS fields (supports bKash, Nagad, and Rocket)
  const isMfs = isMfsPaymentMethod(paymentMethod);
  const currentMfsConfig = isMfs ? MFS_CONFIGS[paymentMethod as MfsProvider] : null;

  const [mfsNumber, setMfsNumber] = useState(currentUser?.phone || '01712345678');
  const [mfsTrxId, setMfsTrxId] = useState('');
  const [mfsMode, setMfsMode] = useState<'trxid' | 'gateway'>('trxid');
  const [copiedMerchant, setCopiedMerchant] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Financial calculations
  const freeShippingThreshold = 800;
  const isFreeStandard = cartTotal >= freeShippingThreshold || appliedCoupon?.code === 'FREESHIP';
  const baseShippingCost = isFreeStandard ? 0 : 60;
  const shippingFee = shippingMethod === 'express' ? baseShippingCost + 60 : baseShippingCost;

  let couponDiscountAmount = 0;
  if (appliedCoupon && cartTotal >= appliedCoupon.minSpend) {
    if (appliedCoupon.discountType === 'percentage') {
      couponDiscountAmount = Math.min(
        appliedCoupon.maxDiscount || Infinity,
        Math.round((cartTotal * appliedCoupon.discountValue) / 100)
      );
    } else if (appliedCoupon.discountType === 'fixed') {
      couponDiscountAmount = appliedCoupon.discountValue;
    }
  }

  const grandTotal = Math.max(0, cartTotal + shippingFee - couponDiscountAmount);

  const divisions = [
    'Dhaka',
    'Chattogram',
    'Rajshahi',
    'Khulna',
    'Barishal',
    'Sylhet',
    'Rangpur',
    'Mymensingh'
  ];

  const handleCopyMerchant = () => {
    if (currentMfsConfig && navigator.clipboard) {
      navigator.clipboard.writeText(currentMfsConfig.merchantNumber.replace(/-/g, ''));
      setCopiedMerchant(true);
      setTimeout(() => setCopiedMerchant(false), 2000);
      addToast({
        type: 'info',
        title: 'Merchant Number Copied',
        message: `${currentMfsConfig.name}: ${currentMfsConfig.merchantNumber}`
      });
    }
  };

  const handleGenerateDemoTrxId = () => {
    if (isMfs) {
      const rand = generateDemoTrxId(paymentMethod as MfsProvider);
      setMfsTrxId(rand);
      addToast({
        type: 'info',
        title: 'Demo TrxID Generated',
        message: `Sample ${currentMfsConfig?.name} TrxID: ${rand}`
      });
    }
  };

  const executeOrderCreation = (paymentInfo?: {
    method: string;
    trxId: string;
    account: string;
    paymentMode?: 'manual_trxid' | 'online_gateway';
  }) => {
    setIsProcessing(true);

    const orderItems: OrderItem[] = cart.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.product.price,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize
    }));

    const fullAddress = `${formData.address}, ${formData.thana}, ${formData.city}, ${formData.division}`;

    const effectiveTrx = paymentInfo?.trxId || (isMfs ? mfsTrxId.trim().toUpperCase() : undefined);
    const effectiveSender = paymentInfo?.account || (isMfs ? mfsNumber.trim() : undefined);
    const effectivePaymentMode =
      paymentMethod === 'cod'
        ? 'cod'
        : paymentInfo?.paymentMode || (mfsMode === 'trxid' ? 'manual_trxid' : 'online_gateway');

    const paymentLabel =
      paymentMethod === 'cod'
        ? 'Cash on Delivery'
        : isMfs && currentMfsConfig
        ? `${currentMfsConfig.name}${effectiveTrx ? ` (Trx: ${effectiveTrx})` : ''}`
        : paymentInfo
        ? `${paymentInfo.method} (Trx: ${paymentInfo.trxId})`
        : paymentMethod.toUpperCase();

    const created = createOrder({
      items: orderItems,
      subtotal: cartTotal,
      shippingFee: shippingFee,
      discount: couponDiscountAmount,
      total: grandTotal,
      shippingAddress: {
        fullName: formData.name,
        phone: formData.phone,
        address: fullAddress,
        city: formData.city,
        division: formData.division
      },
      paymentMethod: paymentLabel,
      paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
      bkashTrxId: effectiveTrx,
      trxId: effectiveTrx,
      mfsProvider: isMfs ? (paymentMethod as MfsProvider) : paymentMethod === 'card' ? 'card' : 'cod',
      mfsSenderNumber: effectiveSender,
      paymentMode: effectivePaymentMode,
      sellerId: cart[0]?.product.sellerId || 'seller-1'
    });

    setIsProcessing(false);
    setShowPaymentModal(false);
    navigate(`/thank-you/${created.id}`, { state: { order: created } });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      addToast({
        type: 'error',
        title: 'Missing Details',
        message: 'Please complete all required shipping address fields.'
      });
      return;
    }

    if (isMfs && currentMfsConfig) {
      if (mfsMode === 'trxid') {
        const validation = validateMfsTrxId(paymentMethod as MfsProvider, mfsTrxId);
        if (!validation.isValid) {
          addToast({
            type: 'warning',
            title: `${currentMfsConfig.name} TrxID Invalid`,
            message: validation.error || `সঠিক ${currentMfsConfig.name} TrxID প্রদান করুন।`
          });
          return;
        }
        executeOrderCreation({
          method: currentMfsConfig.name,
          trxId: validation.cleanTrx,
          account: mfsNumber.trim() || `${currentMfsConfig.logo} Wallet`,
          paymentMode: 'manual_trxid'
        });
        return;
      } else {
        // Launch Gateway Modal
        setShowPaymentModal(true);
        return;
      }
    }

    if (paymentMethod !== 'cod') {
      setShowPaymentModal(true);
      return;
    }

    // Direct Cash on Delivery
    executeOrderCreation();
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/cart" className="hover:text-orange-600">Cart</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-semibold">Secure Checkout</span>
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-6">Checkout & Delivery</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Address, Delivery & Payment (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Shipping Address Section */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
                <MapPin className="w-5 h-5 text-orange-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  1. Shipping Information (Bangladesh)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                    placeholder="Recipient's full name"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phone Number (+880) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                    placeholder="e.g. 01712345678"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Division</label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500 cursor-pointer"
                  >
                    {divisions.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City / District</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                    placeholder="e.g. Dhaka, Chattogram, Sylhet"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thana / Upazila</label>
                  <input
                    type="text"
                    required
                    value={formData.thana}
                    onChange={(e) => setFormData({ ...formData, thana: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                    placeholder="e.g. Dhanmondi, Gulshan, Mirpur"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Street Address, House & Flat No <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                    placeholder="House, Road, Area, Landmark"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Delivery Instructions / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                    placeholder="e.g. Leave with building security guard, call before arrival"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Delivery Options */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
                <Truck className="w-5 h-5 text-orange-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  2. Choose Delivery Method
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Standard */}
                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                    shippingMethod === 'standard'
                      ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/15'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="mt-1 text-orange-600"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                        Standard Nationwide Delivery
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Delivered within 2 - 4 business days
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    {baseShippingCost === 0 ? 'FREE' : `৳${baseShippingCost}`}
                  </span>
                </label>

                {/* Express */}
                <label
                  onClick={() => setShippingMethod('express')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                    shippingMethod === 'express'
                      ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/15'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="mt-1 text-orange-600"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block flex items-center gap-1.5">
                        <span>Express Priority Delivery</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-orange-500 text-white">
                          FAST
                        </span>
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Next day in Dhaka & Chattogram
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900">৳{baseShippingCost + 60}</span>
                </label>
              </div>
            </div>

            {/* 3. Payment Method Selection */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
                <CreditCard className="w-5 h-5 text-orange-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  3. Select Payment Option
                </h2>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/15'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-orange-600"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Pay cash directly to the courier upon inspection and receipt
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    Popular
                  </span>
                </label>

                {/* bKash */}
                <label
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'bkash'
                      ? 'border-[#E2136E] bg-pink-50/50 ring-2 ring-pink-500/15 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="text-[#E2136E]"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-[#E2136E] block">
                        bKash Mobile Banking (বিকাশ)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Manual TrxID or Instant Gateway via *247# / bKash App
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-[#E2136E]">
                    1.5% Cashback
                  </span>
                </label>

                {/* Nagad */}
                <label
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'nagad'
                      ? 'border-[#F7931E] bg-amber-50/50 ring-2 ring-amber-500/15 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'nagad'}
                      onChange={() => setPaymentMethod('nagad')}
                      className="text-[#F7931E]"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-[#F7931E] block">
                        Nagad Digital Payment (নগদ)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Fast postal digital MFS with TrxID validation or Gateway
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-[#F7931E]">
                    Instant
                  </span>
                </label>

                {/* Rocket */}
                <label
                  onClick={() => setPaymentMethod('rocket')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'rocket'
                      ? 'border-[#8C3494] bg-purple-50/50 ring-2 ring-purple-500/15 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'rocket'}
                      onChange={() => setPaymentMethod('rocket')}
                      className="text-[#8C3494]"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-[#8C3494] block">
                        Rocket Mobile Banking (রকেট - DBBL)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Dutch-Bangla Bank 12-digit MFS wallet or manual TrxID
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#8C3494]">
                    Secure DBBL
                  </span>
                </label>

                {/* Visa/Mastercard */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'card'
                      ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/15 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-slate-900"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                        Credit / Debit Card (Visa, Mastercard, Amex)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        3D Secure 2.0 gateway verified by Bangladesh Bank
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Cards
                  </span>
                </label>
              </div>

              {/* Unified MFS Payment Configuration Panel (bKash / Nagad / Rocket) */}
              {isMfs && currentMfsConfig && (
                <div
                  className={`mt-4 p-5 rounded-2xl ${currentMfsConfig.brandBg} border ${currentMfsConfig.brandBorder} text-xs space-y-4 animate-in fade-in duration-200`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${currentMfsConfig.brandColor} animate-pulse`}
                      />
                      <span className={`font-bold ${currentMfsConfig.brandText} text-sm`}>
                        {currentMfsConfig.name} Payment Verification
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${currentMfsConfig.brandColor} text-white shadow-xs`}
                    >
                      ৳{grandTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Mode Switcher: TrxID vs Gateway */}
                  <div className="flex rounded-xl bg-white/80 p-1 border border-slate-200 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setMfsMode('trxid')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        mfsMode === 'trxid'
                          ? `${currentMfsConfig.brandColor} text-white shadow-xs`
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      TrxID দিয়ে সরাসরি অর্ডার (Manual TrxID)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMfsMode('gateway')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        mfsMode === 'gateway'
                          ? `${currentMfsConfig.brandColor} text-white shadow-xs`
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      অনলাইন গেটওয়ে (PIN Gateway)
                    </button>
                  </div>

                  {/* Direct TrxID Mode */}
                  {mfsMode === 'trxid' ? (
                    <div className="space-y-3 pt-1">
                      {/* Merchant Box */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Official {currentMfsConfig.logo} Merchant Number
                          </span>
                          <span
                            className={`font-mono text-sm font-black ${currentMfsConfig.brandText}`}
                          >
                            {currentMfsConfig.merchantNumber}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyMerchant}
                          className={`px-3 py-1.5 rounded-lg ${currentMfsConfig.brandBg} hover:opacity-90 ${currentMfsConfig.brandText} font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border ${currentMfsConfig.brandBorder}`}
                        >
                          {copiedMerchant ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Number</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Instructions */}
                      <div className="p-3 rounded-xl bg-white/70 text-[11px] text-slate-700 border border-slate-200/80 leading-relaxed">
                        <p className="font-bold mb-1 text-slate-900">
                          {currentMfsConfig.logo} পেমেন্ট করার সহজ ধাপসমূহ:
                        </p>
                        <ol className="list-decimal pl-4 space-y-0.5">
                          <li>
                            আপনার {currentMfsConfig.logo} অ্যাপ অথবা {currentMfsConfig.ussdCode} ডায়াল
                            করে <strong>Payment</strong> / <strong>Send Money</strong> সিলেক্ট করুন।
                          </li>
                          <li>
                            মার্চেন্ট নম্বর <strong>{currentMfsConfig.merchantNumber}</strong> এ সর্বমোট{' '}
                            <strong>৳{grandTotal.toLocaleString()}</strong> পরিশোধ করুন।
                          </li>
                          <li>
                            ফিরতি মেসেজ বা অ্যাপ হিস্ট্রি থেকে <strong>TrxID</strong> কপি করে নিচের বক্সে
                            লিখুন।
                          </li>
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            আপনার {currentMfsConfig.logo} নম্বর (Sender Number)
                          </label>
                          <input
                            type="tel"
                            value={mfsNumber}
                            onChange={(e) => setMfsNumber(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-900 outline-hidden focus:border-slate-400"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-bold text-slate-700">
                              {currentMfsConfig.logo} TrxID <span className="text-rose-500">*</span>
                            </label>
                            <button
                              type="button"
                              onClick={handleGenerateDemoTrxId}
                              className={`text-[10px] font-bold ${currentMfsConfig.brandText} hover:underline cursor-pointer`}
                            >
                              + Demo TrxID
                            </button>
                          </div>
                          <input
                            type="text"
                            value={mfsTrxId}
                            onChange={(e) => setMfsTrxId(e.target.value.toUpperCase())}
                            placeholder={currentMfsConfig.samplePlaceholder}
                            className={`w-full p-2.5 bg-white border-2 ${currentMfsConfig.brandBorder} rounded-xl font-mono text-xs font-black text-slate-900 tracking-wider uppercase outline-hidden`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                        <span>
                          * TrxID লেখার পর নিচের <strong>'Confirm & Place Order'</strong> বাটনে চাপুন।
                        </span>
                        {mfsTrxId && (
                          <span
                            className={`font-semibold ${
                              validateMfsTrxId(paymentMethod as MfsProvider, mfsTrxId).isValid
                                ? 'text-emerald-600'
                                : 'text-amber-600'
                            }`}
                          >
                            {validateMfsTrxId(paymentMethod as MfsProvider, mfsTrxId).isValid
                              ? '✓ Valid format'
                              : 'Format warning'}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* PIN Gateway Mode */
                    <div className="space-y-3 pt-1 text-center py-2">
                      <p className="text-xs text-slate-700">
                        {currentMfsConfig.name} অনলাইন গেটওয়ের মাধ্যমে নিরাপদ ওরিজিনাল ওটিপি ও পিন
                        সিমুলেশন করে অর্ডার সম্পন্ন করতে চান?
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowPaymentModal(true)}
                        className={`py-2.5 px-5 ${currentMfsConfig.brandColor} hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Launch {currentMfsConfig.name}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Card Gateway Prompt */}
              {paymentMethod === 'card' && (
                <div className="mt-4 p-5 rounded-2xl bg-slate-900 text-white text-xs space-y-3 animate-in fade-in duration-200 shadow-md">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-slate-200">Bangladesh Bank 3D Secure Gateway</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px]">
                      Visa / Mastercard / Amex
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Click 'Confirm & Place Order' or launch the payment gateway directly to verify your card details via 3D Secure simulation.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(true)}
                    className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Card Payment Gateway</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                Order Review ({cart.length} items)
              </h3>

              {/* Mini Item List */}
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-2 flex items-center gap-3">
                    <img
                      src={sanitizeImageUrl(item.product.images[0], item.product.category)}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                      className="w-10 h-10 object-cover rounded-lg bg-slate-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {item.product.title}
                      </p>
                      <span className="text-[11px] text-slate-500">
                        Qty: {item.quantity} × ৳{item.product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Items Total</span>
                  <span className="font-bold text-slate-800">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery ({shippingMethod === 'express' ? 'Express' : 'Standard'})</span>
                  <span className="font-bold text-slate-800">
                    {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `৳${shippingFee}`}
                  </span>
                </div>

                {couponDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-৳{couponDiscountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Payable</span>
                  <span className="text-2xl font-black text-orange-600">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-4 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-300 text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-600/25 flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                {isProcessing ? (
                  <span>Securing Your Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm & Place Order</span>
                  </>
                )}
              </button>

              <div className="text-[10px] text-slate-400 text-center leading-relaxed">
                By confirming, you agree to ShopNexa's Customer Protection Policy & Terms of Service.
              </div>
            </div>
          </div>
        </form>

        {/* Interactive Payment Gateway (bKash / Nagad / Rocket / Card) */}
        {paymentMethod !== 'cod' && (
          <PaymentGatewayModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            method={paymentMethod}
            amount={grandTotal}
            initialTrxId={isMfs ? mfsTrxId : undefined}
            onSuccess={(paymentData) => {
              executeOrderCreation({
                ...paymentData,
                paymentMode: 'online_gateway'
              });
            }}
          />
        )}
      </div>
    </div>
  );
};
