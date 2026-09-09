import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Store, CheckCircle2, Sparkles } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useStore } from '../context/StoreContext';
import { GoogleLogo, FacebookLogo, SocialLoginModal } from '../components/auth/SocialLoginModal';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [socialModalProvider, setSocialModalProvider] = useState<'google' | 'facebook' | null>(null);

  const { login, switchUserRole, loginWithGoogle, loginWithFacebook } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    navigate('/');
  };

  const handleSocialSuccess = () => {
    setSocialModalProvider(null);
    navigate('/');
  };

  const handleQuickDemo = (persona: 'customer' | 'seller' | 'admin') => {
    switchUserRole(persona);
    if (persona === 'seller') {
      navigate('/seller-dashboard');
    } else if (persona === 'admin') {
      navigate('/admin');
    } else {
      navigate('/account');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-block mb-3">
            <Logo size="md" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isLogin ? 'Welcome Back!' : 'Join ShopNexa Marketplace'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isLogin
              ? 'Access your orders, saved wishlist and express checkout'
              : 'Create a free buyer or seller merchant account in seconds'}
          </p>
        </div>

        {/* Quick Demo Logins Bar */}
        <div className="mb-6 p-3 rounded-2xl bg-orange-50/80 border border-orange-200/60 text-xs">
          <span className="font-bold text-orange-900 block mb-1.5 text-center">
            ⚡ Quick 1-Click Demo Login:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemo('customer')}
              className="py-1.5 px-2 bg-white hover:bg-orange-100 text-slate-800 font-bold rounded-xl border border-orange-200 text-center transition-colors shadow-2xs cursor-pointer"
            >
              Buyer / Customer
            </button>
            <button
              onClick={() => handleQuickDemo('seller')}
              className="py-1.5 px-2 bg-white hover:bg-orange-100 text-orange-700 font-bold rounded-xl border border-orange-200 text-center transition-colors shadow-2xs cursor-pointer"
            >
              Seller Merchant
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 rounded-2xl p-1 mb-5 text-xs font-bold">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-xl transition-colors ${
              isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-xl transition-colors ${
              !isLogin ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Direct Social Login: Google / Gmail & Facebook */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-slate-700">
              {isLogin ? 'Direct Social Sign In:' : 'Fast 1-Click Registration:'}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Instant Access</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Google / Gmail Button */}
            <button
              type="button"
              id="google-login-btn"
              onClick={() => setSocialModalProvider('google')}
              className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-2xl border border-slate-300 hover:border-blue-400 flex items-center justify-center gap-2.5 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
            >
              <GoogleLogo className="w-4 h-4 shrink-0" />
              <span className="truncate">Google (Gmail)</span>
            </button>

            {/* Facebook Button */}
            <button
              type="button"
              id="facebook-login-btn"
              onClick={() => setSocialModalProvider('facebook')}
              className="w-full py-2.5 px-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2.5 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
            >
              <FacebookLogo className="w-4 h-4 shrink-0 fill-white" />
              <span className="truncate">Facebook</span>
            </button>
          </div>

          {/* Quick Bengali Subtitle/Hint */}
          <p className="text-[11px] text-center text-slate-500 font-medium">
            জিমেইল বা ফেসবুক দিয়ে সরাসরি ১-ক্লিকে লগইন করুন
          </p>

          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              or use email & password
            </span>
            <div className="border-t border-slate-200 w-full"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLogin && (
            <>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    onClick={() => setRole('customer')}
                    className={`p-2.5 rounded-xl border cursor-pointer text-center font-bold transition-all ${
                      role === 'customer'
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Shopper / Buyer
                  </label>
                  <label
                    onClick={() => setRole('seller')}
                    className={`p-2.5 rounded-xl border cursor-pointer text-center font-bold transition-all ${
                      role === 'seller'
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Merchant / Seller
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full p-2.5 pl-9 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number (+880)</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full p-2.5 pl-9 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-2.5 pl-9 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-700">Password</label>
              {isLogin && (
                <button type="button" className="text-orange-600 hover:underline text-[11px]">
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 pl-9 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-600/20 transition-all hover:scale-102 flex items-center justify-center gap-2"
          >
            <span>{isLogin ? 'Sign In to Account' : 'Create My Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          By continuing, you agree to ShopNexa's Conditions of Use and Privacy Notice.
        </div>

        {/* Discreet Admin Portal Link for Site Owner */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <Link
            to="/admin"
            className="text-[11px] text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            <span>Administrator Portal Access</span>
          </Link>
        </div>
      </div>

      {/* Interactive Social Login Dialog (Google & Facebook) */}
      <SocialLoginModal
        provider={socialModalProvider}
        onClose={() => setSocialModalProvider(null)}
        onSuccess={handleSocialSuccess}
      />
    </div>
  );
};
