import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Smartphone,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { validateMfsTrxId, generateDemoTrxId, MFS_CONFIGS } from '../../utils/paymentValidation';

export interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: 'bkash' | 'nagad' | 'rocket' | 'card';
  amount: number;
  orderNumber?: string;
  initialTrxId?: string;
  onSuccess: (paymentData: { method: string; trxId: string; account: string }) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  method,
  amount,
  orderNumber = `SNX-${Math.floor(100000 + Math.random() * 900000)}`,
  initialTrxId = '',
  onSuccess
}) => {
  const isMfs = method === 'bkash' || method === 'nagad' || method === 'rocket';
  const [activeTab, setActiveTab] = useState<'gateway' | 'trxid'>(isMfs && initialTrxId ? 'trxid' : 'gateway');
  const [step, setStep] = useState<'account' | 'otp' | 'pin' | 'card' | 'processing'>('account');
  const [accountNumber, setAccountNumber] = useState(
    method === 'nagad' ? '01812345678' : method === 'rocket' ? '01912345678' : '01712345678'
  );
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [trxIdInput, setTrxIdInput] = useState(initialTrxId || '');
  const [copiedMerchant, setCopiedMerchant] = useState(false);
  const [cardData, setCardData] = useState({
    number: '4111 2222 3333 4444',
    name: 'TANZIM HASAN',
    expiry: '09/28',
    cvv: '888'
  });
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Configuration per provider
  const providerConfig = {
    bkash: {
      name: 'bKash Checkout',
      brandColor: 'bg-[#E2136E]',
      brandBorder: 'border-[#E2136E]',
      brandText: 'text-[#E2136E]',
      brandBg: 'bg-pink-50',
      logo: 'bKash',
      badge: 'Official Payment Partner',
      merchantNumber: '01712-345678',
      ussdCode: '*247#',
      demoOtp: '748291',
      defaultNumber: '01712345678'
    },
    nagad: {
      name: 'Nagad Digital Payment',
      brandColor: 'bg-[#F7931E]',
      brandBorder: 'border-[#F7931E]',
      brandText: 'text-[#F7931E]',
      brandBg: 'bg-amber-50',
      logo: 'NAGAD',
      badge: 'Bangladesh Post Digital MFS',
      merchantNumber: '01812-345678',
      ussdCode: '*167#',
      demoOtp: '519302',
      defaultNumber: '01812345678'
    },
    rocket: {
      name: 'Rocket Mobile Banking',
      brandColor: 'bg-[#8C3494]',
      brandBorder: 'border-[#8C3494]',
      brandText: 'text-[#8C3494]',
      brandBg: 'bg-purple-50',
      logo: 'ROCKET',
      badge: 'DBBL Mobile Banking',
      merchantNumber: '01912-345678-4',
      ussdCode: '*322#',
      demoOtp: '638192',
      defaultNumber: '01912345678'
    },
    card: {
      name: 'Card Payment Gateway',
      brandColor: 'bg-slate-900',
      brandBorder: 'border-slate-800',
      brandText: 'text-slate-900',
      brandBg: 'bg-slate-50',
      logo: 'VISA / MC',
      badge: 'Bangladesh Bank 3D Secure',
      merchantNumber: 'SHOPNEXA-ONLINE',
      ussdCode: '',
      demoOtp: '992211',
      defaultNumber: ''
    }
  };

  const config = providerConfig[method] || providerConfig.bkash;

  const handleCopyMerchant = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(config.merchantNumber.replace(/-/g, ''));
      setCopiedMerchant(true);
      setTimeout(() => setCopiedMerchant(false), 2000);
    }
  };

  const handleGenerateSampleTrx = () => {
    const rand = generateDemoTrxId(method);
    setTrxIdInput(rand);
    setError(null);
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || accountNumber.length < 11) {
      setError('Please enter a valid 11-digit mobile wallet number');
      return;
    }
    setError(null);
    setStep('otp');
    setOtp(config.demoOtp); // prefill with demo for effortless user testing
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    setError(null);
    setStep('pin');
  };

  const handleTrxIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateMfsTrxId(method, trxIdInput);
    if (!validation.isValid) {
      setError(validation.error || 'সঠিক ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
      return;
    }
    setError(null);
    setStep('processing');

    setTimeout(() => {
      onSuccess({
        method: config.name,
        trxId: validation.cleanTrx,
        account: accountNumber || `${config.logo} Wallet`
      });
    }, 1200);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      setError('Please enter your 4 or 5 digit PIN');
      return;
    }
    setError(null);
    setStep('processing');

    setTimeout(() => {
      const generatedTrxId =
        trxIdInput.trim().toUpperCase() ||
        generateDemoTrxId(method);
      onSuccess({
        method: config.name,
        trxId: generatedTrxId,
        account: accountNumber
      });
    }, 1400);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardData.number || !cardData.expiry || !cardData.cvv) {
      setError('Please fill in complete card credentials');
      return;
    }
    setError(null);
    setStep('processing');

    setTimeout(() => {
      const generatedTrxId = `CRD${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      onSuccess({
        method: 'Visa / Mastercard',
        trxId: generatedTrxId,
        account: `Card ending in ${cardData.number.slice(-4)}`
      });
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header with Provider Branding */}
        <div className={`${config.brandColor} text-white p-5 relative select-none shrink-0`}>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
              {config.badge}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-white/80 font-medium">
              <Lock className="w-3 h-3" /> 256-Bit Encrypted
            </span>
          </div>

          <div className="flex items-end justify-between mt-1">
            <div>
              <h2 className="text-xl font-black tracking-tight">{config.name}</h2>
              <p className="text-xs text-white/80 mt-0.5">Merchant: ShopNexa Bangladesh Ltd.</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/80 block uppercase font-bold">Amount to Pay</span>
              <span className="text-2xl font-black">৳{amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* MFS Dual Mode Switcher (bKash, Nagad, Rocket) */}
          {isMfs && step !== 'processing' && (
            <div className={`flex rounded-xl ${config.brandBg} p-1 border ${config.brandBorder}`}>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('trxid');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'trxid'
                    ? `${config.brandColor} text-white shadow-xs`
                    : `${config.brandText} hover:opacity-80`
                }`}
              >
                {config.logo} TrxID প্রদান (Manual TrxID)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('gateway');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'gateway'
                    ? `${config.brandColor} text-white shadow-xs`
                    : `${config.brandText} hover:opacity-80`
                }`}
              >
                অনলাইন গেটওয়ে (PIN Gateway)
              </button>
            </div>
          )}

          {/* MFS Direct TrxID Mode Form (bKash, Nagad, Rocket) */}
          {isMfs && activeTab === 'trxid' && step !== 'processing' && (
            <form onSubmit={handleTrxIdSubmit} className="space-y-4 text-xs">
              <div className={`p-3.5 rounded-2xl ${config.brandBg} border ${config.brandBorder} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${config.brandText} text-xs`}>{config.logo} মার্চেন্ট নম্বর:</span>
                  <button
                    type="button"
                    onClick={handleCopyMerchant}
                    className={`px-2.5 py-1 rounded-lg ${config.brandColor} text-white text-[10px] font-bold hover:opacity-95 transition cursor-pointer flex items-center gap-1`}
                  >
                    {copiedMerchant ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>
                <div className={`font-mono text-base font-black ${config.brandText} tracking-wider`}>
                  {config.merchantNumber}
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  আপনার {config.logo} অ্যাপ বা {config.ussdCode ? `${config.ussdCode} ডায়াল করে` : ''} মার্চেন্ট নম্বরে <strong>৳{amount.toLocaleString()}</strong> টাকা পেমেন্ট/সেন্ড মানি করুন এবং প্রাপ্ত <strong>TrxID</strong> নিচে এন্টার করুন।
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  আপনার {config.logo} মোবাইল নম্বর (Sender Number)
                </label>
                <input
                  type="tel"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={`w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-900 outline-hidden focus:${config.brandBorder}`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    {config.logo} ট্রানজেকশন আইডি ({config.logo} TrxID) <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateSampleTrx}
                    className={`text-[10px] font-bold ${config.brandText} hover:underline cursor-pointer`}
                  >
                    + Sample TrxID
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={trxIdInput}
                  onChange={(e) => setTrxIdInput(e.target.value.toUpperCase())}
                  placeholder={`e.g. ${config.logo === 'bKash' ? 'BK9823AB1' : config.logo === 'NAGAD' ? 'NG7842KM9' : 'RK9283741'}`}
                  className={`w-full p-3 bg-slate-50 border-2 ${config.brandBorder} rounded-xl font-mono text-sm font-black text-slate-900 tracking-wider uppercase outline-hidden`}
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  {config.logo} কনফার্মেশন এসএমএস থেকে প্রাপ্ত ৬-১৬ অক্ষরের TrxID টি লিখুন।
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 px-4 rounded-xl ${config.brandColor} hover:opacity-95 text-white font-black text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer`}
                >
                  <span>Verify & Confirm</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP: Card Payment */}
          {method === 'card' && step !== 'processing' && (
            <form onSubmit={handleCardSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-4 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-300">
                    Debit / Credit Card
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-4 bg-rose-500 rounded-sm inline-block opacity-80" />
                    <span className="w-6 h-4 bg-amber-400 rounded-sm inline-block opacity-80 -ml-3" />
                  </div>
                </div>
                <div className="font-mono text-sm tracking-widest text-slate-200">
                  {cardData.number || '•••• •••• •••• ••••'}
                </div>
                <div className="flex justify-between items-end text-[10px] font-mono text-slate-300">
                  <div>
                    <span className="block text-[8px] text-slate-400 uppercase">Cardholder</span>
                    <span>{cardData.name || 'YOUR NAME'}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-400 uppercase">Expires</span>
                    <span>{cardData.expiry || 'MM/YY'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Card Number</label>
                <input
                  type="text"
                  required
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                  placeholder="4111 2222 3333 4444"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-hidden focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    placeholder="Name on card"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    required
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    placeholder="12/28"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-hidden focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="w-1/2">
                <label className="block font-bold text-slate-700 mb-1">Security Code (CVV)</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={cardData.cvv}
                  onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                  placeholder="•••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-hidden focus:border-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Pay ৳{amount.toLocaleString()} Securely</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 1: MFS Account Number */}
          {method !== 'card' && !(isMfs && activeTab === 'trxid') && step === 'account' && (
            <form onSubmit={handleAccountSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Smartphone className={`w-8 h-8 ${config.brandText}`} />
                <div>
                  <h4 className="font-bold text-slate-800">Your {config.name} Number</h4>
                  <p className="text-[11px] text-slate-500">
                    Enter your personal account or agent number to authenticate.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mobile Account Number (+880)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full p-3 pl-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900 outline-hidden focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setAccountNumber(config.defaultNumber)}
                    className="absolute right-2 top-2 px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[10px] cursor-pointer"
                  >
                    Auto Fill
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Sandbox Demonstration:</strong> Click <em>Confirm</em> to instantly verify
                  via demo OTP code without charging real money.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 px-4 rounded-xl ${config.brandColor} text-white font-black text-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shadow-md`}
                >
                  <span>Proceed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Verification Code (OTP) */}
          {method !== 'card' && step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 text-xs">
              <div className="text-center py-2">
                <span className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <h4 className="font-bold text-slate-900 text-sm">Enter Verification Code</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  A 6-digit OTP has been sent to{' '}
                  <span className="font-bold text-slate-800">{accountNumber}</span>
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-center">
                  Verification Code (OTP)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full p-3 text-center tracking-widest font-mono text-lg font-black bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <button
                  type="button"
                  onClick={() => setOtp(config.demoOtp)}
                  className="text-orange-600 hover:underline font-bold cursor-pointer"
                >
                  Insert Demo OTP ({config.demoOtp})
                </button>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" /> Resend in 45s
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('account')}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 px-4 rounded-xl ${config.brandColor} text-white font-black text-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shadow-md`}
                >
                  <span>Verify OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: MFS PIN Input */}
          {method !== 'card' && step === 'pin' && (
            <form onSubmit={handlePinSubmit} className="space-y-4 text-xs">
              <div className="text-center py-2">
                <span className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </span>
                <h4 className="font-bold text-slate-900 text-sm">Enter Wallet PIN</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Enter your 4 or 5-digit PIN to authorize payment of{' '}
                  <strong className="text-slate-900">৳{amount.toLocaleString()}</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-center">
                  Account PIN
                </label>
                <input
                  type="password"
                  maxLength={5}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="•••••"
                  className="w-full p-3 text-center tracking-widest font-mono text-xl font-black bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-100/70 text-[10px] text-slate-500 text-center">
                Your PIN is securely processed with end-to-end tokenization and is never stored on
                our servers.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('otp')}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 px-4 rounded-xl ${config.brandColor} text-white font-black text-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shadow-md`}
                >
                  <span>Confirm Payment</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP: Processing state */}
          {step === 'processing' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-orange-600 animate-spin mx-auto" />
              <div>
                <h4 className="font-black text-slate-900 text-base">Processing Transaction...</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Connecting with {config.name} gateway. Please do not close or refresh this tab.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium shrink-0 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>PCI-DSS Level 1 Certified • 100% Buyer Protected</span>
        </div>
      </div>
    </div>
  );
};
