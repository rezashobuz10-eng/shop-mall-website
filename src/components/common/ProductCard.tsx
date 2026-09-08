import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Truck, Zap, Scale, Bell } from 'lucide-react';
import { Product } from '../../types';
import { RatingStars } from './RatingStars';
import { useStore } from '../../context/StoreContext';
import { sanitizeImageUrl, handleImageError, FALLBACK_PRODUCT_IMAGE } from '../../utils/imageUtils';
import { soundEngine } from '../../utils/audioFeedback';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'default'
}) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    addToComparison,
    comparisonProducts,
    setPriceDropModalProduct
  } = useStore();
  const inWishlist = isInWishlist(product.id);
  const isCompared = comparisonProducts.some((p) => p.id === product.id);

  const primaryImage = sanitizeImageUrl(product.images?.[0], product.category);
  const backupImage = product.images?.[1]
    ? sanitizeImageUrl(product.images[1], product.category)
    : FALLBACK_PRODUCT_IMAGE;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    soundEngine.playAddToCart();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    soundEngine.playPop();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToComparison(product);
  };

  const handlePriceAlert = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPriceDropModalProduct(product);
  };

  if (variant === 'horizontal') {
    return (
      <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3 flex gap-4 hover:shadow-lg dark:hover:border-slate-700 transition-all duration-300">
        <div className="relative w-28 h-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          <img
            src={primaryImage}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, backupImage)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.discount > 0 && (
            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-500 text-white shadow-xs">
              -{product.discount}%
            </span>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between py-0.5">
          <div>
            <span className="text-[11px] font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
              {product.category}
            </span>
            <Link
              to={`/product/${product.id}`}
              className="block font-semibold text-sm text-slate-900 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-400 line-clamp-1 transition-colors"
            >
              {product.title}
            </Link>
            <RatingStars rating={product.rating} size="xs" reviewCount={product.reviewCount} />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through ml-1.5">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-500 hover:text-white rounded-lg transition-colors"
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100/90 dark:border-slate-800 overflow-hidden flex flex-col hover:shadow-xl hover:border-orange-200/80 dark:hover:border-slate-700 transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative w-full pt-[100%] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link to={`/product/${product.id}`} className="absolute inset-0">
          <img
            src={primaryImage}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, backupImage)}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start pointer-events-none z-10">
          {product.discount > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-sm tracking-tight">
              -{product.discount}%
            </span>
          )}
          {product.isMall && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-amber-300 flex items-center gap-1 shadow-xs border border-amber-400/20">
              <Zap className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
              MALL
            </span>
          )}
          {product.freeDelivery && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
              <Truck className="w-2.5 h-2.5" />
              Free Delivery
            </span>
          )}
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all duration-200 ${
              inWishlist
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-rose-500'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                inWishlist ? 'fill-rose-500 text-rose-500 scale-110' : ''
              }`}
            />
          </button>

          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            aria-label="Quick preview"
            className="w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-orange-600 flex items-center justify-center backdrop-blur-md shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 hidden sm:flex"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Compare Button */}
          <button
            onClick={handleCompare}
            title={isCompared ? 'In Comparison List' : 'Compare Product'}
            aria-label="Compare"
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 hidden sm:flex ${
              isCompared
                ? 'bg-orange-600 text-white'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-orange-600'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>

          {/* Price Alert Button */}
          <button
            onClick={handlePriceAlert}
            title="Set Price Drop Alert"
            aria-label="Price Alert"
            className="w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 flex items-center justify-center backdrop-blur-md shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 hidden sm:flex"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Add Overlay on Hover for Desktop */}
        <div className="absolute bottom-2.5 inset-x-2.5 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
          <button
            onClick={handleAddToCart}
            className="w-full py-2 px-3 bg-slate-900/90 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-lg backdrop-blur-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add to Cart
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5 bg-white dark:bg-slate-900">
        <div>
          {/* Seller / Brand */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-400 font-medium mb-1">
            <span className="truncate max-w-[120px] hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              {product.brand}
            </span>
            <span className="text-slate-400 dark:text-slate-500">{product.soldCount.toLocaleString()} sold</span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.id}`}
            className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-400 line-clamp-2 leading-snug transition-colors group-hover:text-orange-600 dark:group-hover:text-orange-400"
            title={product.title}
          >
            {product.title}
          </Link>
        </div>

        {/* Rating and Price */}
        <div>
          <RatingStars
            rating={product.rating}
            size="xs"
            showNumber
            reviewCount={product.reviewCount}
            className="mb-2"
          />

          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-normal">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Mobile Add to Cart Button */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 sm:hidden">
            <button
              onClick={handleAddToCart}
              className="w-full py-1.5 px-2.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-lg flex items-center justify-center gap-1 hover:bg-orange-500 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
