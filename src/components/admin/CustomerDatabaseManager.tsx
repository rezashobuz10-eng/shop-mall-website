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
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { FirestoreCustomer, saveCustomerToFirestore, fetchCustomersFromFirestore } from '../../lib/firebase';
import { GoogleLogo } from '../auth/SocialLoginModal';

export const CustomerDatabaseManager: React.FC = () => {
  const { users, firestoreCustomers, refreshFirestoreCustomers, addToast, sendEmailAuthCode } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);

  // New Customer Form State
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<'customer' | 'seller' | 'admin'>('customer');
  const [isSaving, setIsSaving] = useState(false);

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshFirestoreCustomers();
      addToast({
        type: 'success',
        title: 'Database Synchronized',
        message: 'Successfully refreshed customer records from Firestore.'
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

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Gmail, Name, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 self-end sm:self-auto">
          <span>Showing {filteredCustomers.length} of {combinedCustomers.length} accounts</span>
        </div>
      </div>

      {/* Customer Database Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
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
    </div>
  );
};
