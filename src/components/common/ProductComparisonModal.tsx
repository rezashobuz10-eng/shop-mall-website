import React, { useState } from 'react';
import {
  X,
  Scale,
  Trash2,
  ShoppingCart,
  Check,
  Star,
  ShieldCheck,
  Truck,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { sanitizeImageUrl, handleImageError, FALLBACK_PRODUCT_IMAGE } from '../../utils/imageUtils';

export const ProductComparisonModal: React.FC = () => {
  const {
    comparisonProducts,
    removeFromComparison,
    clearComparison,
    isComparisonOpen,
    setIsComparisonOpen,
    addToCart,
    addToast
  } = useStore();

  const [highlightDifferences, setHighlightDifferences] = useState(false);

  // If no items in comparison, don't show floating bar or modal
  if (comparisonProducts.length === 0) return null;

  // Extract unique spec keys across all compared products
  const allSpecKeys: string[] = Array.from(
    new Set<string>(
      comparisonProducts.flatMap((p) => [
        ...Object.keys(p.specifications || {}),
        ...Object.keys(p.specs || {})
      ])
    )
  );

  return (
    <>
      {/* 1. Floating Bottom Dock Bar (When items exist in comparison) */}
      {!isComparisonOpen && (
        <aside
          aria-label="Product comparison dock"
          className="fixed bottom-18 md:bottom-6 right-4 md:right-8 z-40 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 p-3.5 flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-orange-400">
                Compare Products
              </div>
              <div className="text-xs font-bold text-slate-300">
                {comparisonProducts.length} of 4 items selected
              </div>
            </div>
          </div>

          {/* Mini Thumbnails */}
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-700/80 pl-3">
            {comparisonProducts.map((p) => (
              <div key={p.id} className="relative group">
                <img
                  src={sanitizeImageUrl(p.images[0], p.category)}
                  alt={p.title}
                  onError={(e) => handleImageError(e, p.category)}
                  className="w-9 h-9 rounded-lg object-cover bg-white border border-slate-700"
                />
                <button
                  type="button"
                  onClick={() => removeFromComparison(p.id)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-l border-slate-700/80 pl-3">
            <button
              type="button"
              onClick={() => setIsComparisonOpen(true)}
              className="py-2 px-3.5 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={clearComparison}
              title="Clear Comparison"
              className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* 2. Full Comparison Matrix Modal */}
      {isComparisonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-6xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black">
                      প্রোডাক্ট পাশাপাশি তুলনা (Product Comparison)
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
                      {comparisonProducts.length} items
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    মূল্য, কাস্টমার রেটিং, ওয়ারেন্টি এবং বিস্তারিত স্পেসিফিকেশন পাশাপাশি তুলনা করুন।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearComparison}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Clear All</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsComparisonOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Content Table */}
            <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6">
              <table className="w-full min-w-[650px] border-collapse">
                <tbody>
                  {/* Row 1: Product Card Header */}
                  <tr className="border-b border-slate-200">
                    <td className="w-40 sm:w-48 p-3 text-xs font-black uppercase text-slate-400 tracking-wider align-top">
                      Product Overview
                    </td>
                    {comparisonProducts.map((p) => (
                      <td key={p.id} className="p-3 align-top min-w-[200px] max-w-[240px]">
                        <div className="relative group bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex flex-col justify-between h-full space-y-3">
                          <button
                            type="button"
                            onClick={() => removeFromComparison(p.id)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                            title="Remove from comparison"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>

                          <div className="aspect-square rounded-xl overflow-hidden bg-white p-2 border border-slate-100 flex items-center justify-center">
                            <img
                              src={sanitizeImageUrl(p.images[0], p.category)}
                              alt={p.title}
                              onError={(e) => handleImageError(e, p.category)}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                              {p.brand}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5 leading-snug">
                              {p.title}
                            </h4>
                          </div>

                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                            <div>
                              <div className="text-base font-black text-slate-900">
                                ৳{p.price.toLocaleString()}
                              </div>
                              {p.originalPrice > p.price && (
                                <div className="text-[11px] text-slate-400 line-through">
                                  ৳{p.originalPrice.toLocaleString()}
                                </div>
                              )}
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-black">
                              {p.discount}% OFF
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              addToCart(p, 1);
                              addToast({
                                type: 'success',
                                title: 'Added to Cart',
                                message: `${p.title.slice(0, 30)}... added to your bag.`
                              });
                            }}
                            className="w-full py-2 px-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Customer Rating */}
                  <tr className="border-b border-slate-100 hover:bg-slate-50/60">
                    <td className="p-3 text-xs font-bold text-slate-500">
                      Customer Rating (১০ এ রেটিং)
                    </td>
                    {comparisonProducts.map((p) => (
                      <td key={p.id} className="p-3">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center text-amber-500">
                            <Star className="w-4 h-4 fill-amber-400" />
                          </div>
                          <span className="text-xs font-black text-slate-900">{p.rating} / 5</span>
                          <span className="text-[11px] text-slate-400">({p.reviewCount} reviews)</span>
                        </div>
                        <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                          ★ {(p.rating * 2).toFixed(1)} / 10 Buyer Score
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Brand & Category */}
                  <tr className="border-b border-slate-100 hover:bg-slate-50/60">
                    <td className="p-3 text-xs font-bold text-slate-500">Brand & Category</td>
                    {comparisonProducts.map((p) => (
                      <td key={p.id} className="p-3 text-xs font-semibold text-slate-700">
                        {p.brand} ({p.category})
                      </td>
                    ))}
                  </tr>

                  {/* Row: Delivery & Shipping */}
                  <tr className="border-b border-slate-100 hover:bg-slate-50/60">
                    <td className="p-3 text-xs font-bold text-slate-500">Shipping & Delivery</td>
                    {comparisonProducts.map((p) => (
                      <td key={p.id} className="p-3 text-xs">
                        <div className="flex items-center gap-1 text-slate-800 font-bold">
                          <Truck className="w-3.5 h-3.5 text-blue-600" />
                          <span>{p.deliveryDays || 2} Days Dispatch</span>
                        </div>
                        <span className={`text-[10px] font-bold block mt-0.5 ${p.freeDelivery ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {p.freeDelivery ? '✓ Free Delivery Eligible' : 'Standard Delivery ৳60'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Warranty */}
                  <tr className="border-b border-slate-100 hover:bg-slate-50/60">
                    <td className="p-3 text-xs font-bold text-slate-500">Official Warranty</td>
                    {comparisonProducts.map((p) => (
                      <td key={p.id} className="p-3 text-xs font-semibold text-slate-800">
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{p.warranty || '7-Day Return Guarantee'}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Stock Status */}
                  <tr className="border-b border-slate-100 hover:bg-slate-50/60">
                    <td className="p-3 text-xs font-bold text-slate-500">Stock Availability</td>
                    {comparisonProducts.map((p) => (
                      <td key={p.id} className="p-3 text-xs">
                        {p.stock > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                            <Check className="w-3 h-3" /> In Stock ({p.stock} units)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold text-[11px]">
                            Out of Stock
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Dynamic Technical Specifications */}
                  {allSpecKeys.map((key) => (
                    <tr key={key} className="border-b border-slate-100 hover:bg-slate-50/60">
                      <td className="p-3 text-xs font-bold text-slate-600">{key}</td>
                      {comparisonProducts.map((p) => {
                        const specsObj = (p.specifications || p.specs || {}) as Record<string, any>;
                        const val = specsObj[key] !== undefined ? String(specsObj[key]) : '—';
                        return (
                          <td key={p.id} className="p-3 text-xs text-slate-700 font-medium">
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>ShopNexa গ্যারান্টি: ১০০% অরিজিনাল ও ভেরিফাইড ব্র্যান্ডের পণ্য।</span>
              </div>
              <button
                type="button"
                onClick={() => setIsComparisonOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
