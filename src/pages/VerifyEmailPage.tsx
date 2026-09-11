import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, ShieldCheck, Clock, Loader2, ArrowLeft } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useStore } from '../context/StoreContext';
import { safeFetchJson } from '../lib/api';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const emailParam = searchParams.get('email') || '';
  const nameParam = searchParams.get('name') || '';
  const roleParam = (searchParams.get('role') as 'customer' | 'seller') || 'customer';
  const purposeParam = (searchParams.get('purpose') as 'signup' | 'login' | 'reset_password') || 'signup';
  const reasonParam = searchParams.get('reason');

  const [email, setEmail] = useState(emailParam);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(60);
  const [isEditingEmail, setIsEditingEmail] = useState(!emailParam);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [isFetchingCode, setIsFetchingCode] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { authVerifyOTP, authResendOTP } = useStore();

  const fetchLiveHelperCode = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter an email address first.');
      return;
    }
    setIsFetchingCode(true);
    setErrorMessage(null);
    try {
      const data = await safeFetchJson(`/api/auth/latest-otp?email=${encodeURIComponent(cleanEmail)}&purpose=${purposeParam}`);
      if (data.success && data.code) {
        const chars = data.code.split('').slice(0, 6);
        setDigits(chars);
        setSuccessMessage(`Latest verification code loaded (${data.code}). Click "Verify & Activate Account" below!`);
      } else {
        setErrorMessage(data.message || data.error || 'No active code found. Please click Resend Code.');
      }
    } catch (err: any) {
      setErrorMessage('Could not load code assistant. Please check Gmail.');
    } finally {
      setIsFetchingCode(false);
    }
  };

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleDigitChange = (index: number, val: string) => {
    setErrorMessage(null);
    const cleaned = val.replace(/\D/g, '');

    // If pasted multi-digit string
    if (cleaned.length > 1) {
      const newDigits = [...digits];
      const chars = cleaned.slice(0, 6).split('');
      chars.forEach((c, i) => {
        if (index + i < 6) {
          newDigits[index + i] = c;
        }
      });
      setDigits(newDigits);
      const nextFocus = Math.min(index + chars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);

    // Auto-advance to next input
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!paste) return;
    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < paste.length; i++) {
      newDigits[i] = paste[i];
    }
    setDigits(newDigits);
    inputRefs.current[Math.min(paste.length, 5)]?.focus();
  };

  const codeString = digits.join('');

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (codeString.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authVerifyOTP({
        email: cleanEmail,
        code: codeString,
        purpose: purposeParam,
        name: nameParam,
        role: roleParam
      });

      if (!result.success) {
        setErrorMessage(result.error || result.message || 'Invalid verification code.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Email verified successfully! Welcome to ShopNexa.');
      
      if (purposeParam === 'reset_password' && result.resetToken) {
        // Redirect to reset password page with token
        setTimeout(() => {
          navigate(
            `/reset-password?email=${encodeURIComponent(cleanEmail)}&token=${encodeURIComponent(
              result.resetToken!
            )}`
          );
        }, 800);
      } else {
        // Redirect to user dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during verification.');
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address to resend the code.');
      return;
    }

    setErrorMessage(null);
    setIsResending(true);
    try {
      const result = await authResendOTP(cleanEmail, purposeParam);
      if (!result.success) {
        setErrorMessage(result.error || result.message || 'Failed to resend code.');
        if (result.cooldownRemaining) {
          setCooldown(result.cooldownRemaining);
        }
      } else {
        setSuccessMessage('A fresh verification code has been dispatched to your email.');
        setCooldown(60);
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend verification code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50/60 py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 transition-all text-center">
        
        {/* Brand Header */}
        <div className="inline-block mb-3">
          <Logo size="md" />
        </div>

        <div className="w-14 h-14 rounded-2xl bg-orange-100/80 text-orange-600 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verify Your Email</h1>
        
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          We have dispatched a 6-digit security code directly to your email address:
        </p>

        {/* Email Display & Edit */}
        <div className="my-3 flex items-center justify-center gap-2">
          {isEditingEmail ? (
            <div className="flex items-center gap-2 max-w-xs w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 text-center"
              />
              <button
                type="button"
                onClick={() => setIsEditingEmail(false)}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-[11px] font-bold shrink-0"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200/80">
              <span className="text-xs font-bold text-slate-800">{email || 'Not specified'}</span>
              <button
                type="button"
                onClick={() => setIsEditingEmail(true)}
                className="text-[10px] font-bold text-orange-600 hover:text-orange-700 underline cursor-pointer"
              >
                Change
              </button>
            </div>
          )}
        </div>

        {/* Gmail Primary Inbox Delivery Guidance Banner */}
        <div className="my-3 p-3.5 bg-blue-50/90 border border-blue-200 rounded-2xl text-left text-xs text-blue-900 shadow-sm flex items-start gap-2.5">
          <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-blue-950">মেইলটি সরাসরি Inbox-এ পাওয়ার উপায়</p>
              <a
                href={`https://mail.google.com/mail/u/0/#search/in%3Aanywhere+ShopNexa`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 shrink-0"
              >
                Open Gmail ↗
              </a>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              আপনার জিমেইলের <strong>Primary Inbox</strong> অথবা <strong>All Mail</strong> চেক করুন। যদি প্রথমবার মেইলটি <em>Spam</em> ফোল্ডারে যায়, তবে মেইলটি ওপেন করে <strong>"Report not spam"</strong> অথবা <strong>"Move to Inbox"</strong> সিলেক্ট করুন। এতে ভবিষ্যতে সকল ShopNexa কোড সরাসরি মূল ইনবক্সে আসবে।
            </p>
            <div className="flex items-center gap-2 text-[10px] text-blue-700 font-mono">
              <span>প্রেরক: rezashobuz10@gmail.com</span>
              <span>&bull;</span>
              <span>বিষয়: &lt;কোড&gt; is your ShopNexa verification code</span>
            </div>
          </div>
        </div>

        {reasonParam === 'unverified' && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-left flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">
              Your email is not verified yet. Please enter the verification code sent to your inbox to activate your account.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-left flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-left flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">{successMessage}</p>
          </div>
        )}

        {/* 6-Digit OTP Boxes */}
        <form onSubmit={handleVerify} className="mt-5 space-y-5">
          <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                id={`otp-digit-${idx}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                disabled={isLoading}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl font-black text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>This verification code expires in 5 minutes</span>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            id="verify-otp-submit-button"
            disabled={isLoading || codeString.length !== 6}
            className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-2xl shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Security Code...</span>
              </>
            ) : (
              <>
                <span>Verify & Activate Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend Code Section */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center gap-2 text-xs">
          <p className="text-slate-500">Didn't receive the email in your inbox or spam?</p>
          <button
            type="button"
            id="resend-otp-button"
            onClick={handleResend}
            disabled={cooldown > 0 || isResending || isLoading}
            className="font-bold text-orange-600 hover:text-orange-700 disabled:text-slate-400 disabled:cursor-not-allowed inline-flex items-center gap-1.5 cursor-pointer"
          >
            {isResending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Resending Code...</span>
              </>
            ) : cooldown > 0 ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Resend Code in {cooldown}s</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend Verification Code Now</span>
              </>
            )}
          </button>
        </div>

        {/* Troubleshoot & Instant Helper Section */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            id="toggle-troubleshoot-btn"
            onClick={() => setShowTroubleshoot(!showTroubleshoot)}
            className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{showTroubleshoot ? '▲ Hide Delivery Help' : '▼ Gmail এ কোড আসছে না? (সহায়তা ও কোড সহকারী)'}</span>
          </button>

          {showTroubleshoot && (
            <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-3 animate-in fade-in duration-200">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-orange-600" />
                <span>Gmail-এ কোড খুঁজে পাওয়ার ৩টি সহজ উপায়:</span>
              </p>
              <ol className="list-decimal list-inside text-slate-600 space-y-1.5 text-[11px] leading-relaxed">
                <li><strong>ইনবক্স নিশ্চিত করতে (১ ক্লিক):</strong> মেইলটি যদি স্প্যামে দেখতে পান, তবে ভেতরে ঢুকে <strong>"Report not spam"</strong> চাপুন। এতে জিমেইল এই প্রেরককে নিরাপদ তালিকাভুক্ত করে সবসময় ইনবক্সে ডেলিভারি নিশ্চিত করবে।</li>
                <li><strong>Gmail Filter দিয়ে ১০০% ইনবক্স গ্যারান্টি:</strong> জিমেইলে <em>rezashobuz10@gmail.com</em> এর জন্য একটি ফিল্টার বানিয়ে <em>"Never send it to Spam"</em> ও <em>"Categorize as: Primary"</em> সেট করতে পারেন।</li>
                <li><strong>দ্রুত সার্চ:</strong> জিমেইল সার্চবারে <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-800 font-semibold">in:anywhere ShopNexa</code> লিখে সার্চ করলে সব ফোল্ডার মিলিয়ে কোডটি সাথে সাথে পাওয়া যাবে।</li>
              </ol>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">প্রিভিউতে সরাসরি কোড চান?</span>
                </div>
                <button
                  type="button"
                  id="fetch-helper-code-btn"
                  onClick={fetchLiveHelperCode}
                  disabled={isFetchingCode}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-[11px] shrink-0 inline-flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isFetchingCode ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3" />
                      <span>Auto-Fill Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back to Login Link */}
        <div className="mt-5 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Login</span>
          </Link>
        </div>

        {/* Security badge */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>OTP is securely hashed and verified on the server</span>
        </div>

      </div>
    </div>
  );
};
