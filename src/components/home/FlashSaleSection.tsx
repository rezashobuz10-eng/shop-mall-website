import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Clock, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { RatingStars } from '../common/RatingStars';
import { Product } from '../../types';
import { sanitizeImageUrl, handleImageError, FALLBACK_PRODUCT_IMAGE } from '../../utils/imageUtils';

export const FlashSaleSection: React.FC = () => {
  const { products, addToCart } = useStore();
  const navigate = useNavigate();

  // 1-second countdown timer for today's flash sale (e.g. 5 hours 42 mins 19 secs)
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    ended: boolean;
  }>(() => {
    const target = new Date();
    target.setHours(target.getHours() + 6);
    target.setMinutes(target.getMinutes() + 24);
    target.setSeconds(target.getSeconds() + 38);

    const diff = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
    return {
      hours: Math.floor(diff / 3600),
      minutes: Math.floor((diff % 3600) / 60),
      seconds: diff % 60,
      ended: diff <= 0
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.ended) return prev;
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 0, minutes: 0, seconds: 0, ended: true };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashSale).slice(0, 6);

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    navigate('/checkout');
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-orange-600/15 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-inner">
              <Zap className="w-7 h-7 fill-amber-300 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Flash Sale Live
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white text-orange-600 uppercase tracking-widest animate-pulse">
                  Ending Soon
                </span>
              </div>
              <p className="text-xs text-orange-100 mt-0.5">
                Steepest discounts on guaranteed authentic electronics and apparel
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 bg-slate-950/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
            <Clock className="w-4 h-4 text-amber-300" />
            {timeLeft.ended ? (
              <span className="text-sm font-extrabold text-amber-300">Sale Ended</span>
            ) : (
              <div className="flex items-center gap-1.5 text-white">
                <span className="text-xs text-orange-200 font-medium mr-1">Time Left:</span>
                <div className="flex items-center gap-1 font-mono font-black text-sm sm:text-base">
                  <span className="px-2 py-1 bg-white/20 rounded-lg">{pad(timeLeft.hours)}</span>
                  <span>:</span>
                  <span className="px-2 py-1 bg-white/20 rounded-lg">{pad(timeLeft.minutes)}</span>
                  <span>:</span>
                  <span className="px-2 py-1 bg-amber-400 text-slate-950 rounded-lg">
                    {pad(timeLeft.seconds)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flash Sale Product Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {flashProducts.map((product) => {
          // Calculate stock percentage
          const totalStock = (product.soldCount || 100) + product.stock;
          const soldPercent = Math.min(
            92,
            Math.round(((product.soldCount || 50) / totalStock) * 100)
          );

          return (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-orange-200 transition-all duration-300"
            >
              <div>
                {/* Image */}
                <div className="relative pt-[100%] overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <Link to={`/product/${product.id}`} className="absolute inset-0">
                    <img
                      src={sanitizeImageUrl(product.images[0], product.category)}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      onError={(e) =>
                        handleImageError(
                          e,
                          product.images[1]
                            ? sanitizeImageUrl(product.images[1], product.category)
                            : FALLBACK_PRODUCT_IMAGE
                        )
                      }
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                  </Link>

                  {/* Discount tag */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[11px] font-black bg-rose-500 text-white shadow-sm">
                    -{product.discount}%
                  </span>
                </div>

                {/* Info */}
                <div className="p-3">
                  <Link
                    to={`/product/${product.id}`}
                    className="text-xs font-semibold text-slate-800 line-clamp-2 hover:text-orange-600 transition-colors leading-snug mb-1"
                  >
                    {product.title}
                  </Link>

                  <RatingStars rating={product.rating} size="xs" reviewCount={product.reviewCount} />

                  <div className="mt-2">
                    <div className="font-extrabold text-sm sm:text-base text-orange-600">
                      ৳{product.price.toLocaleString()}
                    </div>
                    {product.originalPrice > product.price && (
                      <div className="text-[11px] text-slate-400 line-through">
                        ৳{product.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${soldPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                      <span>{product.stock} Left</span>
                      <span className="text-orange-600">{soldPercent}% Sold</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 pt-0 flex gap-1.5">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product, 1);
                  }}
                  className="p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors"
                  title="Add to Cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleBuyNow(e, product)}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold text-center transition-colors shadow-xs"
                >
                  Buy Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/products?filter=flash"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
        >
          <span>View All Flash Deals</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
