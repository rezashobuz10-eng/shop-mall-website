import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Zap,
  ShieldCheck,
  Truck,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  AlertCircle,
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { BD_DIVISIONS, BD_DISTRICTS } from '../../data/mockData';
import { sanitizeImageUrl, FALLBACK_PRODUCT_IMAGE, handleImageError } from '../../utils/imageUtils';
import { soundEngine } from '../../utils/audioFeedback';

interface FastOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  initialColor?: string;
  initialSize?: string;
  initialQuantity?: number;
}

export const FastOrderModal: React.FC<FastOrderModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedColor = '',
  selectedSize = '',
  initialColor = '',
  initialSize = '',
  initialQuantity = 1
}) => {
  const activeColor = selectedColor || initialColor || '';
  const activeSize = selectedSize || initialSize || '';
  const navigate = useNavigate();
  const { createOrder, currentUser, addToast } = useStore();

  const [quantity, setQuantity] = useState(initialQuantity);
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [division, setDivision] = useState<string>(currentUser?.addresses[0]?.division || 'Dhaka');
  const [district, setDistrict] = useState<string>(currentUser?.addresses[0]?.district || 'Dhaka City');
  const [fullAddress, setFullAddress] = useState(currentUser?.addresses[0]?.fullAddress || '');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const isDhaka = division === 'Dhaka';
  const shippingFee = product.freeDelivery ? 0 : isDhaka ? 60 : 120;
  const subtotal = (product.price || 0) * quantity;
  const total = subtotal + shippingFee;

  const availableDistricts = BD_DISTRICTS[division] || ['Dhaka City'];

  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const newDistricts = BD_DISTRICTS[newDiv];
    if (newDistricts && newDistricts.length > 0) {
      setDistrict(newDistricts[0]);
    }
  };

  const handleFastOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (!fullName.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }
    if (cleanPhone.length < 11) {
      setErrorMsg('অনুগ্রহ করে সঠিক ১১ ডিজিট মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।');
      return;
    }
    if (!fullAddress.trim() || fullAddress.trim().length < 5) {
      setErrorMsg('অনুগ্রহ করে আপনার ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা) বিস্তারিত লিখুন।');
      return;
    }

    setIsSubmitting(true);
    soundEngine.playAddToCart();

    try {
      const createdOrder = createOrder({
        customerName: fullName.trim(),
        customerPhone: cleanPhone,
        items: [
          {
            productId: product.id,
            product,
            title: product.title,
            image: product.images?.[0] || FALLBACK_PRODUCT_IMAGE,
            price: product.price,
            quantity,
            selectedColor: activeColor || undefined,
            selectedSize: activeSize || undefined,
            sellerName: product.sellerName
          }
        ],
        subtotal,
        discount: 0,
        shippingFee,
        total,
        shippingAddress: {
          fullName: fullName.trim(),
          phone: cleanPhone,
          division,
          district,
          fullAddress: fullAddress.trim(),
          label: 'Home',
          isDefault: true,
          area: district,
          postalCode: '1000'
        },
        shippingMethod: isDhaka ? 'Standard Delivery (ঢাকা সিটি)' : 'Standard Delivery (ঢাকার বাইরে)',
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (ক্যাশ অন ডেলিভারি)' : 'Mobile Banking (bKash/Nagad)',
        paymentStatus: 'Pending',
        paymentMode: paymentMethod === 'cod' ? 'cod' : 'online_gateway'
      });

      soundEngine.playOrderSuccess();
      addToast({
        type: 'success',
        title: 'অর্ডার সফল হয়েছে! 🎉',
        message: `আপনার দ্রুত অর্ডার #${createdOrder.orderNumber} গ্রহণ করা হয়েছে।`
      });

      onClose();
      navigate(`/thank-you/${createdOrder.id}`, { state: { order: createdOrder } });
    } catch (err) {
      console.error(err);
      setErrorMsg('অর্ডার সম্পন্ন করতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।');
      setIsSubmitting(false);
    }
  };

  const productImage = sanitizeImageUrl(product.images?.[0], product.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Lightning Badge */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-200 fill-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-none">
                সরাসরি দ্রুত অর্ডার (1-Click Fast Order)
              </h3>
              <p className="text-[11px] text-orange-100 mt-1">
                কার্ট ছাড়াই নাম ও ঠিকানা দিয়ে ৩ সেকেন্ডে অর্ডার করুন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Product Summary Card */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center gap-3">
          <img
            src={productImage}
            alt={product.title}
            onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
            className="w-16 h-16 object-cover rounded-2xl bg-white border border-slate-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
              {product.title}
            </h4>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
              {activeColor && <span className="text-slate-700">কালার: <b>{activeColor}</b></span>}
              {activeSize && <span className="text-slate-700">সাইজ: <b>{activeSize}</b></span>}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-black text-orange-600 text-sm">
                ৳{product.price.toLocaleString()}
              </span>

              {/* Quantity Controls */}
              <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-0.5 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  -
                </button>
                <span className="px-2.5 py-0.5 text-xs font-bold text-slate-900 min-w-[1.8rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                  className="px-2.5 py-0.5 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fast Order Form */}
        <form onSubmit={handleFastOrderSubmit} className="p-4 sm:p-5 space-y-3.5">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                আপনার নাম (Full Name) *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="যেমন: মোঃ সাব্বির আহমেদ"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-hidden transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                মোবাইল নম্বর (Phone Number) *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-hidden font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {/* Division & District */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                বিভাগ (Division)
              </label>
              <select
                value={division}
                onChange={(e) => handleDivisionChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-hidden font-medium"
              >
                {BD_DIVISIONS.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                জেলা / শহর (District)
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-hidden font-medium"
              >
                {availableDistricts.map((dst) => (
                  <option key={dst} value={dst}>
                    {dst}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Full Delivery Address */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              ডেলিভারি পূর্ণ ঠিকানা (বাসা/রোড/এলাকা) *
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <textarea
                required
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                rows={2}
                placeholder="যেমন: বাসা নং ১২, রোড ৪, ব্লক-সি, মিরপুর ১০"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
              পেমেন্ট পদ্ধতি পছন্দ করুন (Payment Method)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex items-center gap-2 p-2.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-900 ring-2 ring-orange-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="fastPayment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-orange-600"
                />
                <div className="text-left">
                  <span className="text-xs font-black block">ক্যাশ অন ডেলিভারি</span>
                  <span className="text-[10px] text-slate-500 block">হাতে পেয়ে টাকা দিন</span>
                </div>
              </label>

              <label
                className={`flex items-center gap-2 p-2.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-500 bg-pink-50/50 text-pink-900 ring-2 ring-pink-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="fastPayment"
                  value="bkash"
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="accent-pink-600"
                />
                <div className="text-left">
                  <span className="text-xs font-black block">বিকাশ / নগদ</span>
                  <span className="text-[10px] text-slate-500 block">অনলাইন এমএফএস</span>
                </div>
              </label>
            </div>
          </div>

          {/* Pricing Breakdown & Delivery Note */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>পণ্য মূল্য ({quantity}টি):</span>
              <span className="font-semibold text-slate-800">৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>ডেলিভারি চার্জ ({isDhaka ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'}):</span>
              <span className="font-semibold text-slate-800">
                {shippingFee === 0 ? <b className="text-emerald-600">ফ্রি ডেলিভারি</b> : `৳${shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-slate-200 text-sm font-black text-slate-900">
              <span>সর্বমোট পরিশোধযোগ্য:</span>
              <span className="text-orange-600 text-base">৳{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all hover:scale-101 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>
              {isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার নিশ্চিত করুন (Confirm Order)'}
            </span>
          </button>

          {/* Trust Guarantees */}
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ১০০% জেনুইন পণ্য
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-blue-600" /> দ্রুত ডোরস্টেপ ডেলিভারি
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
