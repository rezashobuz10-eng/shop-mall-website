import { Order } from '../types';

export type MfsProviderKey = 'bkash' | 'nagad' | 'rocket' | 'card' | 'cod';
export type MfsProvider = 'bkash' | 'nagad' | 'rocket';

export const isMfsPaymentMethod = (method?: string | null): method is MfsProvider => {
  return method === 'bkash' || method === 'nagad' || method === 'rocket';
};

export interface MfsProviderConfig {
  id: MfsProviderKey;
  name: string;
  nameBn: string;
  logo: string;
  badge: string;
  brandColor: string;
  brandBorder: string;
  brandText: string;
  brandBg: string;
  badgeBg: string;
  merchantNumber: string;
  ussdCode: string;
  demoOtp: string;
  trxPrefix: string;
  trxPlaceholder: string;
  samplePlaceholder: string;
  instructionsBn: string[];
}

export const MFS_CONFIGS: Record<'bkash' | 'nagad' | 'rocket', MfsProviderConfig> = {
  bkash: {
    id: 'bkash',
    name: 'bKash Mobile Banking',
    nameBn: 'বিকাশ পেমেন্ট ভেরিফিকেশন',
    logo: 'bKash',
    badge: 'bKash Verified',
    brandColor: 'bg-[#E2136E]',
    brandBorder: 'border-[#E2136E]',
    brandText: 'text-[#E2136E]',
    brandBg: 'bg-pink-50/80',
    badgeBg: 'bg-pink-100 text-pink-700 border-pink-300',
    merchantNumber: '01712-345678',
    ussdCode: '*247#',
    demoOtp: '748291',
    trxPrefix: 'BK',
    trxPlaceholder: 'e.g. BK9823AB1',
    samplePlaceholder: 'e.g. BK9823AB1',
    instructionsBn: [
      'আপনার বিকাশ অ্যাপে প্রবেশ করুন অথবা *247# ডায়াল করুন।',
      'Payment অথবা Send Money অপশনে যান।',
      'মার্চেন্ট নম্বর 01712-345678 এ মোট বিল পরিশোধ করুন।',
      'কনফার্মেশন এসএমএস থেকে TrxID কপি করে নিচে বসিয়ে দিন।'
    ]
  },
  nagad: {
    id: 'nagad',
    name: 'Nagad Digital Payment',
    nameBn: 'নগদ পেমেন্ট ভেরিফিকেশন',
    logo: 'Nagad',
    badge: 'Nagad Verified',
    brandColor: 'bg-[#F7931E]',
    brandBorder: 'border-[#F7931E]',
    brandText: 'text-[#F7931E]',
    brandBg: 'bg-amber-50/80',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    merchantNumber: '01812-345678',
    ussdCode: '*167#',
    demoOtp: '519302',
    trxPrefix: 'NG',
    trxPlaceholder: 'e.g. NG7842KM9',
    samplePlaceholder: 'e.g. NG7842KM9',
    instructionsBn: [
      'আপনার নগদ অ্যাপে প্রবেশ করুন অথবা *167# ডায়াল করুন।',
      'মার্চেন্ট পে (Merchant Pay) অথবা সেন্ড মানি সিলেক্ট করুন।',
      'মার্চেন্ট একাউন্ট 01812-345678 এ সঠিক মোট টাকার পরিমাণ পরিশোধ করুন।',
      'লেনদেন সম্পন্ন হওয়ার পর প্রাপ্ত TrxID নিচে প্রদান করুন।'
    ]
  },
  rocket: {
    id: 'rocket',
    name: 'Rocket Mobile Banking',
    nameBn: 'রকেট পেমেন্ট ভেরিফিকেশন',
    logo: 'Rocket',
    badge: 'Rocket Verified',
    brandColor: 'bg-[#8C3494]',
    brandBorder: 'border-[#8C3494]',
    brandText: 'text-[#8C3494]',
    brandBg: 'bg-purple-50/80',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    merchantNumber: '01912-345678-4',
    ussdCode: '*322#',
    demoOtp: '638192',
    trxPrefix: 'RK',
    trxPlaceholder: 'e.g. RK9283741',
    samplePlaceholder: 'e.g. RK9283741',
    instructionsBn: [
      'আপনার রকেট অ্যাপ ওপেন করুন অথবা *322# ডায়াল করুন।',
      'Merchant Pay অথবা Send Money অপশন বাছাই করুন।',
      'মার্চেন্ট নম্বর 01912-345678-4 এ অর্ডার মূল্য সেন্ড করুন।',
      'ডাচ-বাংলা ব্যাংক রকেট থেকে প্রাপ্ত ট্রানজেকশন আইডি (TrxID) নিচে প্রদান করুন।'
    ]
  }
};

/**
 * Validates a BD Mobile Phone Number (11 digits, starts with 01)
 */
export const validateBdPhone = (phone: string): { isValid: boolean; error?: string } => {
  const clean = (phone || '').replace(/[\s-]/g, '');
  if (!clean) {
    return { isValid: false, error: 'মোবাইল নম্বর প্রদান করা আবশ্যক।' };
  }
  // Standard BD phone regex: 013-019 (or 12 digits for DBBL Rocket wallet)
  if (!/^01[3-9]\d{8,9}$/.test(clean)) {
    return {
      isValid: false,
      error: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)'
    };
  }
  return { isValid: true };
};

/**
 * Validates an MFS TrxID (bKash, Nagad, Rocket)
 */
export const validateMfsTrxId = (
  provider: 'bkash' | 'nagad' | 'rocket' | string,
  trxId: string
): { isValid: boolean; error?: string; cleanTrx: string } => {
  const cleanTrx = (trxId || '').trim().toUpperCase();

  if (!cleanTrx) {
    return {
      isValid: false,
      error: 'অনুগ্রহ করে ট্রানজেকশন আইডি (TrxID) প্রদান করুন।',
      cleanTrx: ''
    };
  }

  // Minimum length check (6 chars)
  if (cleanTrx.length < 6) {
    return {
      isValid: false,
      error: 'TrxID অত্যন্ত সংক্ষিপ্ত। কমপক্ষে ৬-১০ অক্ষরের সঠিক TrxID লিখুন।',
      cleanTrx
    };
  }

  // Maximum length check (16 chars)
  if (cleanTrx.length > 18) {
    return {
      isValid: false,
      error: 'TrxID সর্বোচ্চ ১৮ অক্ষরের হতে পারে।',
      cleanTrx
    };
  }

  // Alphanumeric format check (no symbols, spaces, or non-latin characters)
  if (!/^[A-Z0-9]+$/.test(cleanTrx)) {
    return {
      isValid: false,
      error: 'TrxID-তে শুধুমাত্র ইংরেজি বড় হাতের বর্ণ ও সংখ্যা ব্যবহার করুন (যেমন: 7K92M4P1)',
      cleanTrx
    };
  }

  return {
    isValid: true,
    cleanTrx
  };
};

/**
 * Generates a realistic sample TrxID for testing
 */
export const generateDemoTrxId = (provider: 'bkash' | 'nagad' | 'rocket' | string): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let prefix = 'TX';
  if (provider === 'bkash') prefix = 'BK';
  else if (provider === 'nagad') prefix = 'NG';
  else if (provider === 'rocket') prefix = 'RK';

  let rand = prefix;
  for (let i = 0; i < 8; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rand;
};

/**
 * Normalizes and extracts safe payment details for 100% crash-free rendering
 * across Invoices, Tracking, Order Success, and Order History.
 */
export interface SafePaymentDetails {
  provider: 'bkash' | 'nagad' | 'rocket' | 'card' | 'cod' | 'other';
  providerName: string;
  trxId?: string;
  senderNumber?: string;
  isPaid: boolean;
  isMfs: boolean;
  paymentMode: 'manual_trxid' | 'online_gateway' | 'cod' | string;
  modeLabel: string;
  statusBadge: string;
  brandText: string;
  brandBg: string;
  brandBorder: string;
  badgeBg: string;
  formattedMethod: string;
}

export const extractPaymentDetails = (order?: Partial<Order> | null): SafePaymentDetails => {
  if (!order) {
    return {
      provider: 'cod',
      providerName: 'Cash on Delivery',
      isPaid: false,
      isMfs: false,
      paymentMode: 'cod',
      modeLabel: 'Cash on Delivery',
      statusBadge: 'Unpaid (COD)',
      brandText: 'text-slate-700',
      brandBg: 'bg-slate-100',
      brandBorder: 'border-slate-300',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      formattedMethod: 'Cash on Delivery'
    };
  }

  const rawMethod = (order.paymentMethod || '').toLowerCase();
  const rawProvider = (order.mfsProvider || '').toLowerCase();

  // Determine provider
  let provider: 'bkash' | 'nagad' | 'rocket' | 'card' | 'cod' | 'other' = 'other';
  if (rawProvider === 'bkash' || rawMethod.includes('bkash') || rawMethod.includes('বিকাশ')) {
    provider = 'bkash';
  } else if (rawProvider === 'nagad' || rawMethod.includes('nagad') || rawMethod.includes('নগদ')) {
    provider = 'nagad';
  } else if (rawProvider === 'rocket' || rawMethod.includes('rocket') || rawMethod.includes('রকেট')) {
    provider = 'rocket';
  } else if (rawProvider === 'card' || rawMethod.includes('card') || rawMethod.includes('visa') || rawMethod.includes('mastercard')) {
    provider = 'card';
  } else if (rawProvider === 'cod' || rawMethod.includes('cod') || rawMethod.includes('cash on delivery') || rawMethod.includes('ক্যাশ অন')) {
    provider = 'cod';
  }

  const isMfs = provider === 'bkash' || provider === 'nagad' || provider === 'rocket';

  // Extract TrxID safely
  let trxId: string | undefined = order.trxId || order.bkashTrxId;
  if (!trxId && order.paymentMethod) {
    // Try extracting from string like "bKash Mobile Banking (Trx: BK123456)"
    const match = order.paymentMethod.match(/Trx:\s*([A-Za-z0-9]+)/i);
    if (match && match[1]) {
      trxId = match[1].toUpperCase();
    }
  }

  // Determine isPaid
  const statusStr = (order.paymentStatus || '').toLowerCase();
  const isPaid = statusStr === 'paid' || (provider !== 'cod' && Boolean(trxId));
  const statusBadge = isPaid ? 'Paid' : provider === 'cod' ? 'COD (Due)' : 'Pending';

  // Determine payment mode
  const paymentMode =
    order.paymentMode ||
    (order.paymentMode === 'online_gateway'
      ? 'online_gateway'
      : trxId
      ? 'manual_trxid'
      : provider === 'cod'
      ? 'cod'
      : 'online_gateway');

  const modeLabel =
    paymentMode === 'online_gateway'
      ? 'PIN & OTP Gateway'
      : paymentMode === 'manual_trxid'
      ? 'Direct App TrxID'
      : provider === 'cod'
      ? 'Cash on Delivery'
      : '';

  // Determine formatting
  let brandText = 'text-slate-700';
  let brandBg = 'bg-slate-50';
  let brandBorder = 'border-slate-200';
  let badgeBg = 'bg-slate-100 text-slate-700 border-slate-200';
  let providerName = 'Cash on Delivery';
  let formattedMethod = order.paymentMethod || 'Cash on Delivery';

  if (provider === 'bkash') {
    brandText = 'text-[#E2136E]';
    brandBg = 'bg-pink-50';
    brandBorder = 'border-pink-200';
    badgeBg = 'bg-pink-50 text-pink-700 border-pink-300';
    providerName = 'bKash Mobile Banking';
    formattedMethod = 'bKash Mobile Banking';
  } else if (provider === 'nagad') {
    brandText = 'text-[#F7931E]';
    brandBg = 'bg-amber-50';
    brandBorder = 'border-amber-200';
    badgeBg = 'bg-amber-50 text-amber-800 border-amber-300';
    providerName = 'Nagad Digital Payment';
    formattedMethod = 'Nagad Digital Payment';
  } else if (provider === 'rocket') {
    brandText = 'text-[#8C3494]';
    brandBg = 'bg-purple-50';
    brandBorder = 'border-purple-200';
    badgeBg = 'bg-purple-50 text-purple-800 border-purple-300';
    providerName = 'Rocket Mobile Banking';
    formattedMethod = 'Rocket Mobile Banking';
  } else if (provider === 'card') {
    brandText = 'text-blue-700';
    brandBg = 'bg-blue-50';
    brandBorder = 'border-blue-200';
    badgeBg = 'bg-blue-50 text-blue-700 border-blue-300';
    providerName = 'Credit / Debit Card';
    formattedMethod = 'Card (Visa / Mastercard)';
  }

  return {
    provider,
    providerName,
    trxId,
    senderNumber: order.mfsSenderNumber,
    isPaid,
    isMfs,
    paymentMode,
    modeLabel,
    statusBadge,
    brandText,
    brandBg,
    brandBorder,
    badgeBg,
    formattedMethod
  };
};
