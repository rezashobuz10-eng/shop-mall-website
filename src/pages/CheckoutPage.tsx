import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderItem } from '../types';
import { PaymentGatewayModal } from '../components/common/PaymentGatewayModal';
import { sanitizeImageUrl, handleImageError, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';

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

  // If cart is empty, redirect
  if (cart.length === 0) {
    navigate('/cart');
  }

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
  >('cod');

  // MFS Mobile Number & Pin/TrxID state
  const [mfsNumber, setMfsNumber] = useState('01712345678');
  const [mfsTrxId, setMfsTrxId] = useState('');
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

  const executeOrderCreation = (paymentInfo?: { method: string; trxId: string; account: string }) => {
    setIsProcessing(true);

    const orderItems: OrderItem[] = cart.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.product.price,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize
    }));

    const fullAddress = `${formData.address}, ${formData.thana}, ${formData.city}, ${formData.division}`;

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
      paymentMethod:
        paymentMethod === 'cod'
          ? 'Cash on Delivery'
          : paymentInfo
          ? `${paymentInfo.method} (Trx: ${paymentInfo.trxId})`
          : paymentMethod.toUpperCase(),
      paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
      sellerId: cart[0]?.product.sellerId || 'seller-1'
    });

    setIsProcessing(false);
    setShowPaymentModal(false);
    navigate(`/order-success/${created.id}`);
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

    if (paymentMethod !== 'cod') {
      setShowPaymentModal(true);
      return;
    }

    // Direct Cash on Delivery
    executeOrderCreation();
  };

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
                      ? 'border-pink-500 bg-pink-50/40 ring-2 ring-pink-500/15'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="text-pink-600"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-pink-700 block">
                        bKash Mobile Banking
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Instant payment via bKash gateway or wallet
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-100 text-pink-700">
                    Instant
                  </span>
                </label>

                {/* Nagad */}
                <label
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'nagad'
                      ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/15'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'nagad'}
                      onChange={() => setPaymentMethod('nagad')}
                      className="text-amber-600"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-amber-700 block">
                        Nagad Digital Payment
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Fast and secure payment with Nagad
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                    Instant
                  </span>
                </label>

                {/* Visa/Mastercard */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/15'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-blue-600"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-blue-800 block">
                        Credit / Debit Card (Visa, Mastercard, Amex)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        3D Secure authentication through Bangladesh Bank verified gateway
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Cards</span>
                </label>
              </div>

              {/* Conditional MFS / Card Input */}
              {paymentMethod !== 'cod' && (
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3 animate-in fade-in duration-200">
                  <div className="font-bold text-slate-800">
                    Enter {paymentMethod.toUpperCase()} Account / Mobile Number:
                  </div>
                  <input
                    type="text"
                    value={mfsNumber}
                    onChange={(e) => setMfsNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                  />
                  <p className="text-[10px] text-slate-500">
                    A secure OTP simulation will be confirmed upon placing your order.
                  </p>
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
            onSuccess={(paymentData) => {
              executeOrderCreation(paymentData);
            }}
          />
        )}
      </div>
    </div>
  );
};
