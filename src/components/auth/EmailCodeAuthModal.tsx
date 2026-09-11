import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Key,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  X,
  Database
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface EmailCodeAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialEmail?: string;
  role?: 'customer' | 'seller';
}

export const EmailCodeAuthModal: React.FC<EmailCodeAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialEmail = '',
  role = 'customer'
}) => {
  const { sendEmailAuthCode, verifyEmailCodeAndLogin, addToast } = useStore();

  const [step, setStep] = useState<'input_email' | 'enter_code'>('input_email');
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState('');
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  useEffect(() => {
    let timer: any;
    if (step === 'enter_code' && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid Gmail or email address.');
      return;
    }

    setErrorMsg('');
    setIsSending(true);
    try {
      const res = await sendEmailAuthCode(cleanEmail);
      if (res.success) {
        setStep('enter_code');
        setResendTimer(60);
        // Focus first digit
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 150);
      } else {
        setErrorMsg(res.message || 'Failed to dispatch verification code.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    const newDigits = [...digits];

    if (cleaned.length > 1) {
      // Paste handling: e.g. "649120"
      const chars = cleaned.slice(0, 6).split('');
      chars.forEach((c, i) => {
        if (i < 6) newDigits[i] = c;
      });
      setDigits(newDigits);
      const nextIdx = Math.min(chars.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    newDigits[index] = cleaned;
    setDigits(newDigits);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasteData) {
      const newDigits = [...digits];
      pasteData.split('').forEach((c, idx) => {
        if (idx < 6) newDigits[idx] = c;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(pasteData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the code.');
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);
    try {
      const result = await verifyEmailCodeAndLogin(email, fullCode, name, role);
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(result.message || 'Invalid or expired code.');
      }
    } catch {
      setErrorMsg('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      id="email-code-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                {step === 'input_email'
                  ? 'Email Code Authentication'
                  : 'Enter 6-Digit Security Code'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Direct Firestore Database Sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'input_email' ? (
            /* STEP 1: Enter Email / Gmail */
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Gmail / Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="e.g. yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:border-blue-500 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Reza Shobuz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:border-blue-500 outline-hidden transition-all"
                />
              </div>

              {/* Quick 1-Click Fill for testing */}
              <div className="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-200/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-blue-800 font-bold">
                  ⚡ Quick Demo Gmail:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('rezashobuz10@gmail.com');
                    setName('Reza Shobuz');
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-black underline cursor-pointer"
                >
                  rezashobuz10@gmail.com
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send 6-Digit Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium text-center pt-2">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Your Gmail will be permanently saved in our Firestore database.</span>
              </div>
            </form>
          ) : (
            /* STEP 2: Enter 6-Digit Code */
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="text-center">
                <p className="text-xs text-slate-600">
                  We sent a 6-digit authentication code to:
                </p>
                <span className="font-mono font-bold text-blue-600 text-xs mt-0.5 inline-block">
                  {email}
                </span>
              </div>

              {/* Real Email Dispatch Notice */}
              <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-blue-900">
                <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  A 6-digit verification code has been dispatched directly to your Gmail inbox. Please check your inbox or spam folder and enter the code below.
                </p>
              </div>

              {/* 6 Digits Input Boxes */}
              <div>
                <label className="block text-center text-xs font-bold text-slate-700 mb-2">
                  Enter 6-Digit Code:
                </label>
                <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className={`w-11 h-12 text-center text-lg font-mono font-black rounded-xl border-2 transition-all outline-hidden ${
                        digit
                          ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                          : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-400 focus:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isVerifying || digits.join('').length !== 6}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying with Database...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify Code & Complete Login</span>
                    </>
                  )}
                </button>
              </div>

              {/* Resend & Change Email Footer */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep('input_email')}
                  className="text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                >
                  ← Change Email
                </button>

                {resendTimer > 0 ? (
                  <span className="text-slate-400 font-medium">
                    Resend in <span className="font-bold">{resendTimer}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendCode()}
                    className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
