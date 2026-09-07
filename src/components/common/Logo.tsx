import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark' | 'white';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  showTagline = true,
  size = 'md'
}) => {
  const isWhite = variant === 'white';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <Link to="/" className="inline-flex items-center gap-2.5 group select-none">
      {/* Nexus Marketplace Icon */}
      <div
        className={`${iconSizes[size]} rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 p-0.5 shadow-md shadow-orange-500/20 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center`}
      >
        <div className="w-full h-full bg-slate-950/20 rounded-[10px] flex items-center justify-center backdrop-blur-xs text-white">
          <svg
            className="w-3/5 h-3/5 fill-current"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="14" r="1.5" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Brand Name & Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span
            className={`font-black tracking-tight ${textSizes[size]} ${
              isWhite ? 'text-white' : 'text-slate-900'
            }`}
          >
            Shop
          </span>
          <span
            className={`font-black tracking-tight ${textSizes[size]} bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent`}
          >
            Nexa
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 ml-0.5 inline-block animate-pulse"></span>
        </div>
        {showTagline && (
          <span
            className={`text-[10px] tracking-wider uppercase font-semibold mt-0.5 ${
              isWhite ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Everything You Need, One Place
          </span>
        )}
      </div>
    </Link>
  );
};
