import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Tag,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { EmptyState } from '../components/common/EmptyState';
import { sanitizeImageUrl, handleImageError, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';
import { soundEngine } from '../utils/audioFeedback';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartTotal,
    cartTotalCount,
    addToast
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  // Free shipping threshold: ৳800
  const freeShippingThreshold = 800;
  const isFreeShipping = cartTotal >= freeShippingThreshold || appliedCoupon?.code === 'FREESHIP';
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : 60;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
  const freeShippingPercent = Math.min(100, Math.round((cartTotal / freeShippingThreshold) * 100));

  // Calculate coupon discount
  let couponDiscountAmount = 0;
  if (appliedCoupon && cartTotal >= appliedCoupon.minSpend) {
    if (appliedCoupon.discountType === 'percentage') {
      couponDiscountAmount = Math.min(
        appliedCoupon.maxDiscount || Infinity,
        Math.round((cartTotal * appliedCoupon.discountValue) / 100)
      );
    } else if (appliedCoupon.discountType === 'fixed') {
      couponDiscountAmount = appliedCoupon.discountValue;
    }
  }

  const grandTotal = Math.max(0, cartTotal + shippingFee - couponDiscountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput.trim());
    if (success) {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon={ShoppingBag}
            title="Your Shopping Cart is Empty"
            description="Looks like you haven't added anything to your cart yet. Explore our flash sale deals and genuine local artisan collections."
            actionText="Start Shopping"
            actionLink="/products"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-6 pb-36 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-semibold">Shopping Cart</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-slate-900">
            Shopping Cart ({cartTotalCount} items)
          </h1>
          <button
            onClick={clearCart}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
          >
            Clear Entire Cart
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <div className="flex items-center gap-2 text-slate-800">
              <Truck className="w-4 h-4 text-orange-600" />
              {isFreeShipping ? (
                <span className="text-emerald-600">Congratulations! You unlocked Free Shipping.</span>
              ) : (
                <span>
                  Add <span className="text-orange-600 font-black">৳{amountNeededForFreeShipping}</span> more to get FREE Delivery!
                </span>
              )}
            </div>
            <span className="text-slate-400">{freeShippingPercent}%</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFreeShipping ? 'bg-emerald-500' : 'bg-gradient-to-r from-orange-500 to-amber-500'
              }`}
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.product.id} className="p-4 sm:p-5 flex gap-4 items-center">
                  {/* Image */}
                  <Link
                    to={`/product/${item.product.id}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0"
                  >
                    <img
                      src={sanitizeImageUrl(item.product.images[0], item.product.category)}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-orange-600 uppercase">
                          {item.product.brand}
                        </span>
                        <Link
                          to={`/product/${item.product.id}`}
                          className="block text-xs sm:text-sm font-bold text-slate-800 hover:text-orange-600 transition-colors line-clamp-1"
                        >
                          {item.product.title}
                        </Link>
                        {(item.selectedColor || item.selectedSize) && (
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {item.selectedColor && `Color: ${item.selectedColor}`}
                            {item.selectedColor && item.selectedSize && ' | '}
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-3 pt-2">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-slate-800 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-slate-900 block">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-slate-400">
                            ৳{item.product.price.toLocaleString()} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                to="/products"
                className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
              >
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary & Coupon (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Coupon Box */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Promo / Coupon Code
                </h3>
              </div>

              {appliedCoupon ? (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-emerald-800">
                        Code: {appliedCoupon.code} Applied
                      </span>
                      <p className="text-[10px] text-emerald-600">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 text-emerald-700 hover:text-rose-600 transition-colors"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. NEXA10, EID500"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold uppercase tracking-wider outline-hidden focus:border-orange-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-medium">Try:</span>
                    {['NEXA10', 'EID500', 'FREESHIP', 'WELCOME100'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => applyCoupon(c)}
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-slate-800">৳{cartTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-slate-800">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      `৳${shippingFee}`
                    )}
                  </span>
                </div>

                {couponDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span>-৳{couponDiscountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Estimated Total</span>
                  <span className="text-2xl font-black text-orange-600">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted checkout & 100% purchase protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Cart Checkout Floating Bar */}
      <div className="sm:hidden fixed bottom-14 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-30 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3 safe-area-bottom">
        <div>
          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
            Total Payable ({cartTotalCount} {cartTotalCount === 1 ? 'item' : 'items'})
          </span>
          <span className="text-xl font-black text-orange-600">
            ৳{grandTotal.toLocaleString()}
          </span>
        </div>
        <button
          onClick={() => {
            soundEngine.playPop();
            navigate('/checkout');
          }}
          className="py-3 px-5 bg-orange-600 hover:bg-orange-500 active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span>Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
