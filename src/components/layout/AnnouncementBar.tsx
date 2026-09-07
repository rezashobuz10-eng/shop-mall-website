import React, { useState } from 'react';
import {
  Truck,
  CreditCard,
  PhoneCall,
  Gift,
  Globe,
  Sun,
  Moon,
  ShieldAlert,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';
import { VoucherClaimModal } from '../common/VoucherClaimModal';
import { soundEngine } from '../../utils/audioFeedback';

export const AnnouncementBar: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    language,
    toggleLanguage,
    isDarkMode,
    toggleDarkMode
  } = useStore();
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundEngine.isEnabled());

  const handleToggleSound = () => {
    const next = soundEngine.toggleSound();
    setSoundEnabled(next);
  };

  return (
    <div className="bg-slate-900 text-slate-300 text-[11px] font-medium border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left Perks */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-0.5">
          <span className="flex items-center gap-1.5 text-slate-200">
            <Truck className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>Free Delivery Over ৳800</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <CreditCard className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Cash on Delivery</span>
          </span>
          <button
            type="button"
            onClick={() => setShowVoucherModal(true)}
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold transition-colors cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-bounce" />
            <span>Claim Vouchers / কুপন</span>
          </button>
        </div>

        {/* Right Shortcuts, Language, Dark Mode */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* Admin Indicator (Only visible if already logged in as Admin) */}
          {currentUser?.role === 'admin' && (
            <Link
              to="/admin"
              id="announcement-admin-badge"
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-[10px] transition-colors"
            >
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              <span>Admin Mode</span>
            </Link>
          )}

          {/* Language Toggle (EN / BN) */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-bold text-[10px] transition-colors cursor-pointer"
            title="Toggle English / বাংলা"
          >
            <Globe className="w-3 h-3 text-orange-400" />
            <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-bold text-[10px] transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3 h-3 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3 h-3 text-sky-300" />
                <span>Dark</span>
              </>
            )}
          </button>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-bold text-[10px] transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3 h-3 text-emerald-400" />
                <span>Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3 h-3 text-slate-500" />
                <span>Muted</span>
              </>
            )}
          </button>

          <Link
            to="/seller-dashboard"
            className="hover:text-orange-400 transition-colors hidden sm:inline text-xs font-semibold text-slate-300"
          >
            Become a Seller
          </Link>
          <span className="text-slate-700 hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1 text-slate-400">
            <PhoneCall className="w-3 h-3 text-orange-400" />
            <span className="font-semibold text-slate-200">09612-SHOPNEXA</span>
          </div>
        </div>
      </div>

      {/* Lucky Scratch & Voucher Modal */}
      <VoucherClaimModal
        isOpen={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
      />
    </div>
  );
};
