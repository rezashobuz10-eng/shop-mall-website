import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 'sm',
  showNumber = false,
  reviewCount,
  className = ''
}) => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textMap = {
    xs: 'text-[11px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center text-amber-400">
        {Array.from({ length: maxStars }).map((_, index) => {
          const filled = index + 1 <= Math.floor(rating);
          const half = !filled && index < rating;

          return (
            <span key={index} className="relative inline-block">
              {half ? (
                <span className="relative">
                  <Star className={`${sizeMap[size]} text-gray-200 fill-gray-200`} />
                  <span className="absolute top-0 left-0 overflow-hidden w-1/2">
                    <Star className={`${sizeMap[size]} text-amber-400 fill-amber-400`} />
                  </span>
                </span>
              ) : (
                <Star
                  className={`${sizeMap[size]} ${
                    filled ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'
                  }`}
                />
              )}
            </span>
          );
        })}
      </div>

      {showNumber && (
        <span className={`font-semibold text-slate-800 ml-0.5 ${textMap[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className={`text-slate-500 font-normal ${textMap[size]}`}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};
