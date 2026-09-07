import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Heart, ShoppingBag, Truck, ShieldCheck, Check, Star } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { RatingStars } from './RatingStars';
import { sanitizeImageUrl, handleImageError, FALLBACK_PRODUCT_IMAGE } from '../../utils/imageUtils';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  if (!quickViewProduct) return null;

  const inWishlist = isInWishlist(quickViewProduct.id);

  const rawImages = Array.isArray(quickViewProduct.images) && quickViewProduct.images.length > 0
    ? quickViewProduct.images
    : [FALLBACK_PRODUCT_IMAGE];
  const galleryImages = rawImages.map((img) => sanitizeImageUrl(img, quickViewProduct.category));
  const activeImage = galleryImages[selectedImageIndex] || galleryImages[0] || FALLBACK_PRODUCT_IMAGE;

  const handleClose = () => {
    setQuickViewProduct(null);
    setSelectedImageIndex(0);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity);
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, quantity);
    handleClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Product Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
              <img
                src={activeImage}
                alt={quickViewProduct.title}
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, galleryImages[1] || FALLBACK_PRODUCT_IMAGE)}
                className="w-full h-full object-cover object-center"
              />
              {quickViewProduct.discount > 0 && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-black bg-rose-500 text-white shadow-md">
                  -{quickViewProduct.discount}% OFF
                </span>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-orange-500 ring-2 ring-orange-500/20'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumbnail"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-[11px] font-bold uppercase tracking-wider">
                  {quickViewProduct.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">Brand: {quickViewProduct.brand}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-2">
                {quickViewProduct.title}
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <RatingStars
                  rating={quickViewProduct.rating}
                  showNumber
                  reviewCount={quickViewProduct.reviewCount}
                />
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">
                  {quickViewProduct.soldCount.toLocaleString()} units sold
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 p-3 bg-slate-50 rounded-2xl mb-4">
                <span className="text-2xl font-black text-slate-900">
                  ৳{quickViewProduct.price.toLocaleString()}
                </span>
                {quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-sm text-slate-400 line-through">
                    ৳{quickViewProduct.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="ml-auto text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock ({quickViewProduct.stock})
                </span>
              </div>

              {/* Brief Description */}
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-5">
                <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 text-sm font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-slate-900 min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(quickViewProduct.stock, q + 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 text-sm font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                    inWishlist
                      ? 'border-rose-200 bg-rose-50 text-rose-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                  {inWishlist ? 'Saved' : 'Wishlist'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-2.5 px-4 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-colors"
                >
                  Buy Now
                </button>
              </div>

              <Link
                to={`/product/${quickViewProduct.id}`}
                onClick={handleClose}
                className="text-center text-xs font-semibold text-slate-500 hover:text-orange-600 py-1 transition-colors"
              >
                View Full Product Specifications & Customer Reviews &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
