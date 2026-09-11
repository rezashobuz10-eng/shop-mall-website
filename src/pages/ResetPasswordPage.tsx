import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, KeyRound, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useStore } from '../context/StoreContext';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const emailParam = searchParams.get('email') || '';
  const tokenParam = searchParams.get('token') || '';

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { authVerifyOTP, authResetPassword } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    setIsLoading(true);
    try {
      let activeToken = resetToken;

      // If we don't have a resetToken yet, verify the 6-digit OTP code first
      if (!activeToken) {
        const cleanCode = code.trim();
        if (!cleanCode || cleanCode.length !== 6) {
          setErrorMessage('Please enter the 6-digit verification code sent to your email.');
          setIsLoading(false);
          return;
        }

        const verifyRes = await authVerifyOTP({
          email: cleanEmail,
          code: cleanCode,
          purpose: 'reset_password'
        });

        if (!verifyRes.success || !verifyRes.resetToken) {
          setErrorMessage(verifyRes.error || verifyRes.message || 'Invalid or expired verification code.');
          setIsLoading(false);
          return;
        }

        activeToken = verifyRes.resetToken;
        setResetToken(activeToken);
      }

      // Now reset the password with the verified resetToken
      const resetRes = await authResetPassword({
        email: cleanEmail,
        resetToken: activeToken,
        newPassword
      });

      if (!resetRes.success) {
        setErrorMessage(resetRes.error || resetRes.message || 'Failed to update password.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login?notice=' + encodeURIComponent('Your password has been changed. You can now sign in.'));
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while resetting your password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50/60 py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 transition-all">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-block mb-3">
            <Logo size="md" />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-orange-100/80 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reset Your Password</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Create a strong, unique password for your account.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="reset-email" className="block text-xs font-bold text-slate-700 mb-1">
              Account Email
            </label>
            <input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={isLoading || !!emailParam}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:opacity-60"
            />
          </div>

          {/* 6-Digit OTP Code (if not already verified via tokenParam) */}
          {!resetToken && (
            <div>
              <label htmlFor="reset-code" className="block text-xs font-bold text-slate-700 mb-1">
                6-Digit Security Code (from Email)
              </label>
              <div className="relative">
                <input
                  id="reset-code"
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 font-mono text-center tracking-widest text-sm bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          {/* New Password */}
          <div>
            <label htmlFor="reset-new-password" className="block text-xs font-bold text-slate-700 mb-1">
              New Password (min. 6 characters)
            </label>
            <div className="relative">
              <input
                id="reset-new-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <button
                type="button"
                id="toggle-reset-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="reset-confirm-password" className="block text-xs font-bold text-slate-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="reset-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <button
                type="button"
                id="toggle-reset-confirm-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="reset-password-submit-button"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-2xl shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving New Password...</span>
              </>
            ) : (
              <>
                <span>Save New Password & Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <Link
            to="/login"
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Cancel and Return to Sign In
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>New password is encrypted with cryptographic salt + scrypt</span>
        </div>

      </div>
    </div>
  );
};
