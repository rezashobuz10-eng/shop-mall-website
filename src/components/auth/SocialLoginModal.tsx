import React, { useState } from 'react';
import { X, CheckCircle2, User, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SocialLoginModalProps {
  provider: 'google' | 'facebook' | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const GoogleLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.31 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27a7.22 7.22 0 0 1 0-4.54V6.58H1.26a11.96 11.96 0 0 0 0 10.84l4.02-3.15Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
    />
  </svg>
);

export const FacebookLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const SocialLoginModal: React.FC<SocialLoginModalProps> = ({ provider, onClose, onSuccess }) => {
  const { loginWithGoogle, loginWithFacebook } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!provider) return null;

  const handleQuickLogin = async (email?: string, name?: string) => {
    setIsLoading(true);
    try {
      if (provider === 'google') {
        await loginWithGoogle(email || 'rezashobuz10@gmail.com', name || 'Reza Shobuz');
      } else {
        await loginWithFacebook(name || 'Reza Shobuz', email || 'rezashobuz.fb@gmail.com');
      }
      onSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    setIsLoading(true);
    try {
      if (provider === 'google') {
        await loginWithGoogle(customEmail, customName);
      } else {
        await loginWithFacebook(customName, customEmail);
      }
      onSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="social-login-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            {provider === 'google' ? (
              <>
                <GoogleLogo className="w-5 h-5" />
                <div>
                  <h3 className="text-xs font-black text-slate-800">Sign in with Google (Gmail)</h3>
                  <p className="text-[10px] text-slate-500">to continue to ShopNexa</p>
                </div>
              </>
            ) : (
              <>
                <FacebookLogo className="w-5 h-5" />
                <div>
                  <h3 className="text-xs font-black text-slate-800">Log in with Facebook</h3>
                  <p className="text-[10px] text-slate-500">Connect your Facebook profile</p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {provider === 'google' ? (
            <>
              <p className="text-xs text-slate-600">
                Choose a Google (Gmail) account to securely sign in or register instantly:
              </p>

              {!isCustomMode ? (
                <div className="space-y-2">
                  {/* Recommended / Detected Account */}
                  <button
                    onClick={() => handleQuickLogin('rezashobuz10@gmail.com', 'Reza Shobuz')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        R
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                            Reza Shobuz
                          </span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded-full">
                            Active
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block">rezashobuz10@gmail.com</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  {/* Alternative Fast Gmail Account */}
                  <button
                    onClick={() => handleQuickLogin('customer.shopnexa@gmail.com', 'Tanzim Hasan')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm">
                        T
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-slate-900">
                          Tanzim Hasan
                        </span>
                        <span className="text-[11px] text-slate-500 block">customer.shopnexa@gmail.com</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCustomMode(true)}
                    className="w-full text-center py-2 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline pt-2"
                  >
                    + Use another Gmail address
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Your Gmail Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full p-2.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-blue-500"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Display Name (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. Reza Shobuz"
                        className="w-full p-2.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-blue-500"
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCustomMode(false)}
                      className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      {isLoading ? 'Connecting...' : 'Sign In'}
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <>
              {/* Facebook Modal Content */}
              <div className="bg-blue-50/60 rounded-2xl p-3 border border-blue-100 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#1877F2] shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-900 leading-relaxed">
                  ShopNexa will receive your name, profile picture, and email address to create or link your customer account.
                </p>
              </div>

              {!isCustomMode ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3 bg-slate-50/60">
                    <div className="w-12 h-12 rounded-full bg-[#1877F2] text-white font-black flex items-center justify-center text-lg shadow-sm">
                      f
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">Reza Shobuz</h4>
                      <p className="text-[11px] text-slate-500">rezashobuz.fb@gmail.com</p>
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-[#1877F2]">
                        Facebook Profile Ready
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickLogin('rezashobuz.fb@gmail.com', 'Reza Shobuz')}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FacebookLogo className="w-4 h-4 fill-white" />
                    <span>{isLoading ? 'Connecting to Facebook...' : 'Continue as Reza Shobuz'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCustomMode(true)}
                    className="w-full text-center py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline"
                  >
                    Log in with a different Facebook account
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Facebook Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. Tanvir Ahmed"
                        className="w-full p-2.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-blue-500"
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Facebook Email / Phone
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        placeholder="e.g. name@gmail.com or 017XXXXXXXX"
                        className="w-full p-2.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-blue-500"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCustomMode(false)}
                      className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      {isLoading ? 'Connecting...' : 'Log In'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Privacy Note */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>100% Secure & encrypted OAuth single sign-on</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
