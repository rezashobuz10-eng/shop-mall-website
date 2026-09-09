import React, { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  User,
  Clock,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';
import { BD_DIVISIONS, BD_DISTRICTS } from '../../data/mockData';

interface OrderEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export const OrderEditModal: React.FC<OrderEditModalProps> = ({ isOpen, onClose, order }) => {
  const { updateOrderAddress, cancelOrder, addToast } = useStore();

  const [activeTab, setActiveTab] = useState<'address' | 'cancel'>('address');

  // Address edit fields
  const currentAddressObj = order.shippingAddress as Record<string, string> | undefined;
  const [fullName, setFullName] = useState(
    currentAddressObj?.fullName || order.customerName || ''
  );
  const [phone, setPhone] = useState(
    currentAddressObj?.phone || order.customerPhone || ''
  );
  const [division, setDivision] = useState(currentAddressObj?.division || 'Dhaka');
  const [district, setDistrict] = useState(currentAddressObj?.district || 'Dhaka City');
  const [fullAddress, setFullAddress] = useState(
    currentAddressObj?.fullAddress || currentAddressObj?.address || ''
  );

  // Cancellation fields
  const [cancelReason, setCancelReason] = useState('ভুল ডেলিভারি ঠিকানা দিয়ে ফেলেছি');
  const [customReason, setCustomReason] = useState('');
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);

  if (!isOpen) return null;

  // Calculate remaining window: 45 minutes from createdAt or if status is not shipped/delivered
  const orderTime = new Date(order.createdAt).getTime();
  const now = Date.now();
  const diffMinutes = Math.max(0, Math.floor((45 * 60 * 1000 - (now - orderTime)) / 60000));
  const isCancellable =
    order.status !== 'Shipped' &&
    order.status !== 'Out for Delivery' &&
    order.status !== 'Delivered' &&
    order.status !== 'Cancelled';

  const handleUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      addToast({ type: 'error', message: 'অনুগ্রহ করে গ্রাহকের নাম লিখুন।' });
      return;
    }
    if (phone.replace(/[^0-9]/g, '').length < 11) {
      addToast({ type: 'error', message: 'অনুগ্রহ করে সঠিক ১১ ডিজিট মোবাইল নম্বর দিন।' });
      return;
    }
    if (!fullAddress.trim()) {
      addToast({ type: 'error', message: 'অনুগ্রহ করে পূর্ণ ডেলিভারি ঠিকানা লিখুন।' });
      return;
    }

    updateOrderAddress(order.id, {
      fullName: fullName.trim(),
      phone: phone.trim(),
      division,
      district,
      fullAddress: fullAddress.trim()
    });

    onClose();
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmCheckbox) {
      addToast({
        type: 'error',
        message: 'অনুগ্রহ করে অর্ডার বাতিলের সম্মতি বক্সে টিক চিহ্ন দিন।'
      });
      return;
    }

    const finalReason = cancelReason === 'অন্যান্য কারণ' ? customReason || 'অন্যান্য' : cancelReason;
    cancelOrder(order.id, finalReason);
    onClose();
  };

  const availableDistricts = BD_DISTRICTS[division] || ['Dhaka City'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-800 text-orange-400 font-bold">
                {order.orderNumber || order.id}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                অর্ডার পরিবর্তন উইন্ডো
              </span>
            </div>
            <h3 className="text-base font-black text-white mt-0.5">
              অর্ডার পরিবর্তন বা বাতিল করুন
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Time Remaining Notice */}
        <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-200/70 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>সেলার পার্সেল প্যাক করার আগে পরিবর্তন সম্ভব</span>
          </div>
          {diffMinutes > 0 ? (
            <span className="px-2 py-0.5 rounded-md bg-amber-200/80 font-mono font-bold text-[11px]">
              {diffMinutes} মিনিট বাকি
            </span>
          ) : (
            <span className="text-[11px] font-bold text-slate-500">স্বাভাবিক সময়সীমা</span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('address')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'address'
                ? 'bg-white text-orange-600 border-b-2 border-orange-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>ঠিকানা ও ফোন পরিবর্তন</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cancel')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'cancel'
                ? 'bg-white text-rose-600 border-b-2 border-rose-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>অর্ডার বাতিল (Cancel)</span>
          </button>
        </div>

        {/* Tab 1: Edit Address Form */}
        {activeTab === 'address' && (
          <form onSubmit={handleUpdateAddress} className="p-5 space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                প্রাপকের পুরো নাম (Recipient Name) *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-hidden font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                মোবাইল নম্বর (Phone Number) *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-hidden font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">বিভাগ</label>
                <select
                  value={division}
                  onChange={(e) => {
                    setDivision(e.target.value);
                    const list = BD_DISTRICTS[e.target.value];
                    if (list && list.length > 0) setDistrict(list[0]);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-hidden font-medium"
                >
                  {BD_DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">জেলা / শহর</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-hidden font-medium"
                >
                  {availableDistricts.map((dst) => (
                    <option key={dst} value={dst}>
                      {dst}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                পূর্ণ ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা) *
              </label>
              <textarea
                required
                rows={2}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="বাসা নং, রোড নং, এলাকা বিস্তারিত..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 outline-hidden font-medium"
              />
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2 text-blue-900 text-[11px] leading-relaxed">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                ঠিকানা আপডেট করার সাথে সাথে ডেলিভারি পার্টনার ও সেলারের নিকট সংশোধিত তথ্য স্বয়ংক্রিয়ভাবে পৌঁছে যাবে।
              </span>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-md shadow-orange-600/20 cursor-pointer"
              >
                ঠিকানা সংরক্ষণ করুন
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Cancel Order Form */}
        {activeTab === 'cancel' && (
          <form onSubmit={handleConfirmCancel} className="p-5 space-y-4 text-xs">
            {!isCancellable ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 mb-2" />
                <p className="font-bold">এই অর্ডারটি বর্তমানে সরাসরি বাতিল করা সম্ভব নয়।</p>
                <p className="mt-1 text-[11px] text-amber-700 leading-relaxed">
                  পার্সেলটি ইতিমধ্যে শিপমেন্ট বা কুরিয়ার ডেলিভারিতে পাঠানো হয়েছে। যেকোনো সহায়তার জন্য আমাদের ২৪/৭ লাইভ সাপোর্টে যোগাযোগ করুন।
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    অর্ডার বাতিলের কারণ নির্বাচন করুন *
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 outline-hidden font-medium text-xs"
                  >
                    <option value="ভুল ডেলিভারি ঠিকানা দিয়ে ফেলেছি">
                      ভুল ডেলিভারি ঠিকানা দিয়ে ফেলেছি
                    </option>
                    <option value="পেমেন্ট মাধ্যম বা ক্যাশ অন ডেলিভারি পরিবর্তন করতে চাই">
                      পেমেন্ট মাধ্যম পরিবর্তন করতে চাই
                    </option>
                    <option value="ভুল সাইজ বা কালার সিলেক্ট করেছিলাম">
                      ভুল সাইজ বা কালার সিলেক্ট করেছিলাম
                    </option>
                    <option value="ডেলিভারিতে বিলম্ব হওয়ার কারণে আর প্রয়োজন নেই">
                      ডেলিভারি তারিখ বিলম্বে পাওয়ার কারণে
                    </option>
                    <option value="ভুলবশত একাধিকবার অর্ডার হয়ে গেছে">
                      ভুলবশত একাধিকবার অর্ডার হয়ে গেছে
                    </option>
                    <option value="অন্যান্য কারণ">অন্যান্য কারণ (বিস্তারিত লিখুন)</option>
                  </select>
                </div>

                {cancelReason === 'অন্যান্য কারণ' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      বিস্তারিত কারণ লিখুন
                    </label>
                    <input
                      type="text"
                      required
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="অর্ডার বাতিলের সুনির্দিষ্ট কারণ লিখুন..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-hidden"
                    />
                  </div>
                )}

                <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-start gap-2.5 text-rose-900 text-[11px] leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">সতর্কবার্তা:</span>
                    অর্ডার বাতিল করলে অর্ডারটি সিস্টেমে তাৎক্ষণিক রদ হবে এবং বুকিং বাতিল হবে। যদি অনলাইন পেমেন্ট করে থাকেন, তবে ২৪ ঘণ্টার মধ্যে রিফান্ড প্রসেস করা হবে।
                  </div>
                </div>

                <label className="flex items-start gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={confirmCheckbox}
                    onChange={(e) => setConfirmCheckbox(e.target.checked)}
                    className="mt-0.5 accent-rose-600 rounded cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-700 font-medium">
                    আমি নিশ্চিত যে আমি অর্ডারটি সম্পূর্ণ বাতিল করতে চাই।
                  </span>
                </label>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    বাতিল করবেন না
                  </button>
                  <button
                    type="submit"
                    disabled={!confirmCheckbox}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-rose-600/20 cursor-pointer"
                  >
                    অর্ডার বাতিল নিশ্চিত করুন
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
