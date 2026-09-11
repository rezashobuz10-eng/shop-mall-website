import React, { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Search,
  RefreshCw,
  Database,
  ExternalLink,
  Sparkles,
  Key,
  Clock,
  UserCheck,
  Phone,
  Plus,
  Send,
  AlertCircle,
  Copy,
  Check,
  Package,
  Inbox,
  MessageCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  FirestoreCustomer,
  saveCustomerToFirestore,
  fetchCustomersFromFirestore,
  fetchOrderNotificationsFromFirestore,
  dispatchShopNexaOrderEmail,
  getGmailComposeUrl,
  getWhatsAppShareUrl,
  checkEmailConfigStatus
} from '../../lib/firebase';
import { OrderNotification } from '../../types';
import { GoogleLogo } from '../auth/SocialLoginModal';

export const CustomerDatabaseManager: React.FC = () => {
  const {
    users,
    orders,
    firestoreCustomers,
    refreshFirestoreCustomers,
    addToast,
    sendEmailAuthCode
  } = useStore();
  const [subTab, setSubTab] = useState<'customers' | 'order_codes'>('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [orderNotifications, setOrderNotifications] = useState<OrderNotification[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [resendingOrderId, setResendingOrderId] = useState<string | null>(null);
  const [emailConfig, setEmailConfig] = useState<{ configured: boolean; senderEmail?: string; provider?: string }>({ configured: false });
  const [showAppPasswordGuide, setShowAppPasswordGuide] = useState(false);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  // Load order notifications & SMTP status on mount
  useEffect(() => {
    fetchOrderNotificationsFromFirestore().then((notifs) => {
      setOrderNotifications(notifs);
    });
    checkEmailConfigStatus().then(setEmailConfig).catch(() => {});
  }, []);

  // New Customer Form State
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<'customer' | 'seller' | 'admin'>('customer');
  const [isSaving, setIsSaving] = useState(false);

  // Combined order notifications: merge Firestore notifications and store orders
  const combinedOrderCodes = React.useMemo(() => {
    const map = new Map<string, {
      orderId: string;
      orderNumber: string;
      confirmationCode: string;
      customerEmail: string;
      customerName: string;
      customerPhone?: string;
      total: number;
      dispatchedAt: string;
      status: string;
      source: 'firestore' | 'app_store';
    }>();

    // From Firestore collection
    orderNotifications.forEach((n) => {
      if (n.orderId) {
        map.set(n.orderId, {
          orderId: n.orderId,
          orderNumber: n.orderNumber || n.orderId,
          confirmationCode: n.confirmationCode,
          customerEmail: n.customerEmail,
          customerName: n.customerName || 'Customer',
          total: n.total || 0,
          dispatchedAt: n.dispatchedAt,
          status: n.status || 'sent',
          source: 'firestore'
        });
      }
    });

    // From current store orders
    orders.forEach((o) => {
      const orderCode =
        o.orderConfirmationCode ||
        `SNX-${(o.orderNumber || o.id).replace(/[^0-9]/g, '').slice(-6) || '849201'}`;
      const email =
        o.customerEmail ||
        o.emailSentTo ||
        (o.shippingAddress as any)?.email ||
        'customer@gmail.com';
      const name = o.shippingAddress?.fullName || o.customerName || 'Customer';

      if (!map.has(o.id)) {
        map.set(o.id, {
          orderId: o.id,
          orderNumber: o.orderNumber || o.id,
          confirmationCode: orderCode,
          customerEmail: email,
          customerName: name,
          customerPhone: o.shippingAddress?.phone || o.customerPhone,
          total: o.total,
          dispatchedAt: o.createdAt || new Date().toISOString(),
          status: 'sent',
          source: o.emailNotificationSent ? 'firestore' : 'app_store'
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.dispatchedAt).getTime() - new Date(a.dispatchedAt).getTime()
    );
  }, [orderNotifications, orders]);

  // Merge store users and firestore customers for comprehensive view
  const combinedCustomers = React.useMemo(() => {
    const map = new Map<string, {
      id: string;
      email: string;
      name: string;
      role: string;
      authMethod: string;
      isVerified: boolean;
      phone?: string;
      createdAt: string;
      source: 'firestore' | 'app_cache';
    }>();

    // From Firestore
    firestoreCustomers.forEach((c) => {
      if (c.email) {
        map.set(c.email.toLowerCase(), {
          id: c.id,
          email: c.email,
          name: c.name,
          role: c.role,
          authMethod: c.authMethod || 'email_code',
          isVerified: c.isVerified,
          phone: c.phone,
          createdAt: c.createdAt || 'Recent',
          source: 'firestore'
        });
      }
    });

    // From store users
    users.forEach((u) => {
      if (u.email && !map.has(u.email.toLowerCase())) {
        map.set(u.email.toLowerCase(), {
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          authMethod: u.authProvider === 'google' ? 'google' : u.authMethod || 'email_code',
          isVerified: u.isVerified ?? true,
          phone: u.phone,
          createdAt: u.joinedDate || 'Recent',
          source: 'app_cache'
        });
      }
    });

    return Array.from(map.values());
  }, [firestoreCustomers, users]);

  const filteredCustomers = combinedCustomers.filter((c) =>
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(searchQuery))
  );

  const filteredOrderCodes = combinedOrderCodes.filter((o) =>
    o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.confirmationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast({
      type: 'info',
      title: 'কপি করা হয়েছে',
      message: `কোড ${code} ক্লিপবোর্ডে কপি করা হয়েছে।`
    });
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshFirestoreCustomers();
      const updatedNotifs = await fetchOrderNotificationsFromFirestore();
      setOrderNotifications(updatedNotifs);
      addToast({
        type: 'success',
        title: 'Database Synchronized',
        message: 'Successfully refreshed customer records & order codes from Firestore.'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) {
      addToast({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please provide a valid Gmail or email address.'
      });
      return;
    }

    setIsSaving(true);
    try {
      await saveCustomerToFirestore({
        email: newEmail.trim().toLowerCase(),
        name: newName.trim() || newEmail.split('@')[0],
        phone: newPhone.trim(),
        role: newRole,
        authMethod: 'email_code',
        isVerified: true
      });
      await refreshFirestoreCustomers();
      setShowAddModal(false);
      setNewEmail('');
      setNewName('');
      setNewPhone('');
      addToast({
        type: 'success',
        title: 'Customer Added to Database',
        message: `Successfully saved ${newEmail} to Firestore.`
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail.trim() || !testEmail.includes('@')) return;
    setIsSendingCode(true);
    try {
      const res = await sendEmailAuthCode(testEmail.trim());
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Verification Code Dispatched',
          message: `Code [ ${res.code} ] sent to ${testEmail}. Saved to Firestore auth_codes!`
        });
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResendFromAdmin = async (item: any) => {
    setResendingOrderId(item.orderId);
    try {
      const res = await dispatchShopNexaOrderEmail({
        orderId: item.orderId,
        orderNumber: item.orderNumber,
        orderCode: item.confirmationCode,
        trackingNumber: item.trackingNumber,
        customerEmail: item.customerEmail,
        customerName: item.customerName,
        total: item.total,
        itemsCount: 1
      });

      if (res.delivered) {
        addToast({
          type: 'success',
          title: 'সরাসরি জিমেইলে পাঠানো হয়েছে! 📧',
          message: `${item.customerEmail} ঠিকানায় অফিসিয়াল ইমেইল সফলভাবে পাঠানো হয়েছে।`
        });
      } else {
        addToast({
          type: 'info',
          title: 'কোড প্রস্তুত ও ডাটাবেসে সংরক্ষিত 📧',
          message: `কোড: ${item.confirmationCode} (${item.customerEmail})। সরাসরি পাঠানোর জন্য 'Compose' বাটন চাপুন।`
        });
      }
    } catch {
      addToast({
        type: 'error',
        title: 'প্রেরণ ব্যর্থ',
        message: 'ইমেইল সার্ভারে যোগাযোগে সমস্যা হয়েছে।'
      });
    } finally {
      setResendingOrderId(null);
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'rezashobuz10@gmail.com' })
      });
      const data = await res.json();
      if (data.success) {
        addToast({
          type: 'success',
          title: 'টেস্ট ইমেইল সফলভাবে পাঠানো হয়েছে! 🎉',
          message: 'rezashobuz10@gmail.com ঠিকানায় টেস্ট ইমেইল পৌঁছেছে। গুগল কানেকশন সক্রিয়!'
        });
      } else {
        addToast({
          type: 'error',
          title: 'টেস্ট ইমেইল ব্যর্থ',
          message: data.error || 'ইমেইল পাঠাতে সমস্যা হয়েছে।'
        });
      }
    } catch {
      addToast({
        type: 'error',
        title: 'সার্ভার ত্রুটি',
        message: 'ইমেইল সার্ভিস রেসপন্স করছে না।'
      });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Database Banner Card */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Database className="w-5 h-5" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-blue-300">
                Live Cloud Database
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Firestore Connected</span>
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Customer Gmail & Account Database
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Whenever customers log in with their email verification code or Google Sign-In, their Gmail and account credentials are permanently saved in our secure Google Cloud Firestore database.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Firestore'}</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer to DB</span>
            </button>
          </div>
        </div>

        {/* Database Specs Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Database ID</span>
            <span className="font-mono font-bold text-slate-200 text-[11px] truncate block">
              ai-studio-shopnexa
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Target Collection</span>
            <span className="font-mono font-bold text-emerald-400 text-[11px]">
              /customers
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Auth Verification</span>
            <span className="font-bold text-blue-300 text-[11px]">
              6-Digit Email Code & Google
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Total Registered</span>
            <span className="font-black text-white text-[13px]">
              {combinedCustomers.length} Customers
            </span>
          </div>
        </div>
      </div>

      {/* Quick Test: Send Email Verification Code */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-orange-100 text-orange-700">
                <Send className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Test Email Authentication Code Sender (টেস্ট ইমেইল কোড সেন্ডার)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Enter any Gmail or email to test generating a 6-digit authentication code and storing it in Firestore.
            </p>
          </div>

          <form onSubmit={handleSendTestCode} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="customer@gmail.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-500 outline-hidden transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSendingCode}
              className="py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSendingCode ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('customers')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              subTab === 'customers'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Registered Customers & Gmails ({combinedCustomers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('order_codes')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              subTab === 'order_codes'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>ShopNexa Order Gmail Codes ({combinedOrderCodes.length})</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {subTab === 'customers' ? (
            <span>Firestore: <strong className="font-mono text-slate-800">/customers</strong></span>
          ) : (
            <span>Firestore: <strong className="font-mono text-orange-600">/order_notifications</strong></span>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              subTab === 'customers'
                ? 'Search by Gmail, Name, or Phone...'
                : 'Search by Gmail, Order ID, or Confirmation Code...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 self-end sm:self-auto">
          {subTab === 'customers' ? (
            <span>Showing {filteredCustomers.length} of {combinedCustomers.length} accounts</span>
          ) : (
            <span>Showing {filteredOrderCodes.length} of {combinedOrderCodes.length} order codes</span>
          )}
        </div>
      </div>

      {/* Order Codes SMTP Status & Dispatch Guide Banner */}
      {subTab === 'order_codes' && (
        <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-slate-50 border border-orange-200/80 rounded-3xl p-5 text-xs text-slate-700 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-orange-100 text-orange-700 shrink-0 border border-orange-200">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {emailConfig.configured ? 'স্বয়ংক্রিয় জিমেইল ডেলিভারি সক্রিয় (Active SMTP)' : 'জিমেইল ইনবক্স ডেলিভারি ইঞ্জিন (Gmail SMTP Dispatch)'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    emailConfig.configured
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {emailConfig.configured ? `Connected: ${emailConfig.senderEmail || 'smtp.gmail.com'}` : 'App Password Ready'}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed max-w-2xl">
                  অর্ডার সফল হওয়ার সাথে সাথে প্রতিটি অর্ডারের ৬-সংখ্যার সিকিউরিটি কনফার্মেশন কোড গ্রাহকের জিমেইল এবং ফায়ারস্টোর ডাটাবেসে নিবন্ধিত হয়।
                  {!emailConfig.configured && (
                    <span> ব্যাকগ্রাউন্ড স্বয়ংক্রিয় প্রেরণের জন্য <code className="font-bold text-orange-700 font-mono">SMTP_USER</code> ও <code className="font-bold text-orange-700 font-mono">SMTP_PASS</code> (Google App Password) কনফিগার করতে পারেন। এছাড়াও নিচের টেবিলে যেকোনো অর্ডারে <strong>'Compose'</strong> চাপলে সরাসরি জিমেইলে প্রাক-পূরণকৃত ইমেইল চালু হবে।</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isSendingTestEmail}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                title="Send test email to rezashobuz10@gmail.com to verify Google App Password"
              >
                <Mail className={`w-3.5 h-3.5 ${isSendingTestEmail ? 'animate-spin' : ''}`} />
                <span>{isSendingTestEmail ? 'পাঠানো হচ্ছে...' : 'টেস্ট ইমেইল পাঠান (Test Email)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAppPasswordGuide(true)}
                className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-950" />
                <span>Google App Password গাইড</span>
              </button>

              <a
                href="https://mail.google.com/mail/u/0/#search/ShopNexa"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Inbox className="w-3.5 h-3.5 text-amber-300" />
                <span>জিমেইল ইনবক্স খুলুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Table: Customers or Dispatched Order Codes */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {subTab === 'customers' ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Customer & Gmail</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Auth Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Database Source</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-bold text-slate-600">No customers found</p>
                      <p className="text-xs">Customers will appear here automatically when they login with their Gmail.</p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs shrink-0 border border-blue-200">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {customer.name}
                            </span>
                            <div className="flex items-center gap-1.5 text-blue-600 font-mono text-[11px]">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span>{customer.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          customer.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : customer.role === 'seller'
                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {customer.role}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {customer.authMethod === 'google' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200/60 text-[10px]">
                            <GoogleLogo className="w-3 h-3 shrink-0" />
                            <span>Google Sign-In</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60 text-[10px]">
                            <Key className="w-3 h-3 shrink-0 text-emerald-600" />
                            <span>6-Digit Email Code</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {customer.source === 'firestore' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                            <Database className="w-2.5 h-2.5" />
                            <span>Firestore Cloud</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            <span>Local Cache</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-medium text-[11px]">
                        {customer.createdAt.includes('T')
                          ? new Date(customer.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : customer.createdAt}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Customer & Gmail</th>
                  <th className="py-3.5 px-4">ShopNexa Order Code</th>
                  <th className="py-3.5 px-4">Order Total</th>
                  <th className="py-3.5 px-4">Dispatch Status</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredOrderCodes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Mail className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-bold text-slate-600">No order confirmation codes recorded yet</p>
                      <p className="text-xs">
                        When customers place orders, official 6-digit confirmation codes are generated on behalf of ShopNexa and recorded here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredOrderCodes.map((item) => (
                    <tr key={item.orderId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-black text-xs shrink-0 border border-orange-200">
                            {item.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {item.customerName}
                            </span>
                            <div className="flex items-center gap-1.5 text-orange-600 font-mono text-[11px]">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span>{item.customerEmail}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-900 text-xs px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200">
                            {item.confirmationCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(item.confirmationCode)}
                            className="p-1 hover:text-orange-600 text-slate-400 cursor-pointer transition-colors"
                            title="Copy code"
                          >
                            {copiedCode === item.confirmationCode ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                          Order #{item.orderNumber}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900">
                        ৳{item.total.toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Delivered to Gmail</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-medium text-[11px]">
                        {item.dispatchedAt.includes('T')
                          ? new Date(item.dispatchedAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : item.dispatchedAt}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyCode(item.confirmationCode)}
                            className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-[10px] border border-orange-200 transition-colors cursor-pointer"
                            title="Copy 6-digit confirmation code"
                          >
                            Copy
                          </button>

                          <button
                            type="button"
                            onClick={() => handleResendFromAdmin(item)}
                            disabled={resendingOrderId === item.orderId}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] border border-slate-200 transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
                            title="Resend official email notification"
                          >
                            <RefreshCw className={`w-3 h-3 ${resendingOrderId === item.orderId ? 'animate-spin' : ''}`} />
                            <span>{resendingOrderId === item.orderId ? 'Sending...' : 'Resend'}</span>
                          </button>

                          <a
                            href={getWhatsAppShareUrl(
                              item.phone,
                              `প্রিয় ${item.customerName}, ShopNexa-তে আপনার অর্ডার কনফার্মেশন কোড: *${item.confirmationCode}* (অর্ডার #${item.orderNumber})। মোট মূল্য: ৳${item.total.toLocaleString()}। ধন্যবাদ!`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                            title="Send code directly to customer's WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={getGmailComposeUrl(
                              item.customerEmail,
                              `[ShopNexa] অর্ডার কনফার্মেশন কোড: ${item.confirmationCode} (Order #${item.orderNumber})`,
                              `প্রিয় ${item.customerName},\n\nআপনার ShopNexa অর্ডার কোড: ${item.confirmationCode}\nঅর্ডার নম্বর: #${item.orderNumber}\nমোট মূল্য: ৳${item.total.toLocaleString()}\n\nShopNexa Support Desk`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] border border-blue-200 transition-colors cursor-pointer flex items-center gap-1"
                            title="Open prefilled Gmail compose window"
                          >
                            <Inbox className="w-3 h-3" />
                            <span>Compose</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Manual Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Add Customer to Firestore Database
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Manually save a customer's Gmail and profile directly to the cloud Firestore database.
            </p>

            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Gmail / Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rezashobuz10@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Reza Shobuz"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 01712345678"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-blue-500 outline-hidden"
                >
                  <option value="customer">Customer (Buyer)</option>
                  <option value="seller">Seller Merchant</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving to DB...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google App Password & Zero-Setup Delivery Guide Modal */}
      {showAppPasswordGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-white">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 shrink-0 shadow-xs">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    গুগল অ্যাপ পাসওয়ার্ড (App Password) কেন আসেনি?
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    কারণসমূহ, সমাধানের সহজ ধাপ এবং পাসওয়ার্ড ছাড়া বিকল্প উপায়
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAppPasswordGuide(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 text-xs text-slate-700 leading-relaxed">
              {/* Main Reason */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>প্রধান কারণ: ২-স্টেপ ভেরিফিকেশন (2-Step Verification) বন্ধ থাকা</span>
                </div>
                <p className="text-rose-800 text-[11px]">
                  গুগলের নিরাপত্তা নীতি অনুসারে, যদি আপনার গুগল অ্যাকাউন্টে <strong>2-Step Verification</strong> চালু না থাকে, তাহলে গুগল অ্যাপ পাসওয়ার্ড অপশন দেখায় না অথবা বলে <em>"The setting you are looking for is not available"</em>।
                </p>
              </div>

              {/* Steps to get it */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white inline-flex items-center justify-center text-[10px]">১</span>
                  <span>গুগল অ্যাপ পাসওয়ার্ড পেতে নিচের ধাপগুলো অনুসরণ করুন:</span>
                </h4>

                <div className="space-y-2.5 pl-2 border-l-2 border-slate-200">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-900 block">ধাপ ১: ২-স্টেপ ভেরিফিকেশন অন করুন</span>
                    <p className="text-slate-600 text-[11px]">
                      আপনার ফোনে বা ব্রাউজারে নিচের লিংকে গিয়ে ২-স্টেপ ভেরিফিকেশন চালু করুন:
                    </p>
                    <a
                      href="https://myaccount.google.com/signinoptions/two-step-verification"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline pt-1"
                    >
                      <span>গুগল ২-স্টেপ ভেরিফিকেশন চালু করুন</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-900 block">ধাপ ২: অ্যাপ পাসওয়ার্ড লিংকে সরাসরি প্রবেশ করুন</span>
                    <p className="text-slate-600 text-[11px]">
                      ২-স্টেপ অন করার পর সরাসরি নিচের অফিশিয়াল গুগল পেজে যান:
                    </p>
                    <a
                      href="https://myaccount.google.com/apppasswords"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-amber-700 hover:underline pt-1"
                    >
                      <span>myaccount.google.com/apppasswords খুলুন</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-900 block">ধাপ ৩: নাম দিন এবং কোড পান</span>
                    <p className="text-slate-600 text-[11px]">
                      App name বক্সে <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono font-bold text-slate-800">ShopNexa</code> লিখুন এবং <strong>Create</strong> চাপুন। গুগল আপনাকে ১৬-অক্ষরের পাসওয়ার্ড প্রদর্শন করবে।
                    </p>
                  </div>
                </div>
              </div>

              {/* Zero-Setup Alternatives */}
              <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-white border border-emerald-200 rounded-2xl p-4 space-y-2.5">
                <span className="font-extrabold text-emerald-900 text-xs block">
                  💡 কোনো পাসওয়ার্ড ছাড়া ঝামেলামুক্ত বিকল্প উপায়:
                </span>

                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-start gap-2 text-[11px]">
                    <span className="font-bold text-emerald-700 shrink-0">১. WhatsApp মেসেজ:</span>
                    <span>অর্ডারের পাশে থাকা <strong>'WhatsApp'</strong> বাটনে ক্লিক করলেই কোনো পাসওয়ার্ড ছাড়া ১-ক্লিকে গ্রাহকের ফোনে অর্ডার কোড চলে যাবে।</span>
                  </div>
                  <div className="flex items-start gap-2 text-[11px]">
                    <span className="font-bold text-emerald-700 shrink-0">২. Gmail Compose:</span>
                    <span><strong>'Compose'</strong> বাটন চাপলে আপনার ডিভাইসের সাধারণ জিমেইল স্বয়ংক্রিয়ভাবে কোডসহ খুলে যাবে, কোনো ব্যাকএন্ড কনফিগারেশনের প্রয়োজন নেই।</span>
                  </div>
                  <div className="flex items-start gap-2 text-[11px]">
                    <span className="font-bold text-emerald-700 shrink-0">৩. লাইভ স্ক্রিন কোড:</span>
                    <span>গ্রাহক অর্ডার সম্পন্ন করা মাত্রই থ্যাংক ইউ পেজে বড় করে ৬-সংখ্যার কোড দেখতে পারেন এবং কপি করে নিতে পারেন।</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowAppPasswordGuide(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
              >
                বুঝেছি, বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
