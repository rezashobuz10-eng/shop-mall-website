import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Star,
  Store,
  MessageSquare,
  Share2,
  ThumbsUp,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { RatingStars } from '../components/common/RatingStars';
import { ProductCard } from '../components/common/ProductCard';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { sanitizeImageUrl, handleImageError, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';
import { soundEngine } from '../utils/audioFeedback';

const ProductDetailContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const store = useStore();
  const {
    products = [],
    sellers = [],
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToRecentlyViewed,
    trackRecentlyViewed,
    addReview,
    getProductReviews,
    markReviewHelpful,
    currentUser,
    addToast
  } = store;

  // Robust product lookup by id (handles prod-1, 1, or title slugs)
  const product = React.useMemo(() => {
    if (!id || !Array.isArray(products)) return undefined;
    const cleanId = String(id).trim().toLowerCase();
    return products.find((p) => {
      if (!p || !p.id) return false;
      const pid = String(p.id).toLowerCase();
      return (
        pid === cleanId ||
        pid === `prod-${cleanId}` ||
        pid.replace(/^prod-/, '') === cleanId ||
        (p.title && String(p.title).toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanId)
      );
    });
  }, [id, products]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedDivision, setSelectedDivision] = useState<
    'Dhaka' | 'Chattogram' | 'Sylhet' | 'Rajshahi' | 'Khulna' | 'Barishal' | 'Rangpur' | 'Mymensingh'
  >('Dhaka');
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'reviews'>('specs');

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Chat with seller modal
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Scroll to top and track recently viewed safely
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      // Fallback
    }

    if (product) {
      const tracker = addToRecentlyViewed || trackRecentlyViewed;
      if (typeof tracker === 'function') {
        try {
          tracker(product);
        } catch (e) {
          console.warn('Could not record recently viewed:', e);
        }
      }
      setActiveImageIndex(0);
      if (Array.isArray(product.colors) && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (Array.isArray(product.sizes) && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product?.id]);

  if (!product) {
    const popularProducts = Array.isArray(products) ? products.slice(0, 4) : [];
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto mb-8 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-slate-500 text-xs mb-6">
            The item you requested does not exist or may have been updated.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
            >
              Browse All Products
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {popularProducts.length > 0 && (
          <div className="text-left mt-12">
            <h3 className="text-base font-bold text-slate-900 mb-4">Trending Products Today</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {popularProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const seller = Array.isArray(sellers) ? sellers.find((s) => s.id === product.sellerId) : undefined;
  const inWishlist = typeof isInWishlist === 'function' ? isInWishlist(product.id) : false;
  const productReviews = typeof getProductReviews === 'function' ? getProductReviews(product.id) : [];
  const totalReviewsCount = Array.isArray(productReviews) && productReviews.length > 0
    ? productReviews.length
    : (product.reviewCount || 0);

  const rawSpecs = product.specifications || product.specs;
  const specifications: Record<string, string> =
    typeof rawSpecs === 'object' && rawSpecs !== null ? rawSpecs : {};

  const rawImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [FALLBACK_PRODUCT_IMAGE];
  const productImages = rawImages.map((img) => sanitizeImageUrl(img, product.category));

  const currentImage = productImages[activeImageIndex] || productImages[0] || FALLBACK_PRODUCT_IMAGE;
  const categoryName = product.category || 'General';
  const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const handleAddToCart = () => {
    soundEngine.playAddToCart();
    if (typeof addToCart === 'function') {
      addToCart(product, quantity, selectedColor || undefined, selectedSize || undefined);
    }
  };

  const handleBuyNow = () => {
    soundEngine.playAddToCart();
    if (typeof addToCart === 'function') {
      addToCart(product, quantity, selectedColor || undefined, selectedSize || undefined);
    }
    navigate('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      if (typeof addToast === 'function') {
        addToast({
          type: 'error',
          title: 'Review Required',
          message: 'Please write your thoughts about this product.'
        });
      }
      return;
    }

    if (typeof addReview === 'function') {
      addReview({
        productId: product.id,
        userId: currentUser?.id || 'guest',
        userName: currentUser?.name || 'Verified Buyer',
        rating: reviewRating,
        comment: reviewComment.trim()
      });
    }

    setReviewComment('');
    setShowReviewForm(false);
  };

  const handleSendSellerChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    if (typeof addToast === 'function') {
      addToast({
        type: 'success',
        title: 'Message Sent to ' + (seller?.name || 'Seller'),
        message: 'The seller usually responds within 15 minutes.'
      });
    }
    setChatMessage('');
    setShowChatModal(false);
  };

  // Related products in same category
  const relatedProducts = Array.isArray(products)
    ? products
        .filter((p) => p && p.id !== product.id && (p.category === product.category || !product.category))
        .slice(0, 5)
    : [];

  return (
    <div className="min-h-screen bg-slate-50/50 pt-6 pb-28 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link to="/products" className="hover:text-orange-600">Catalog</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link to={`/category/${categorySlug}`} className="hover:text-orange-600">
            {categoryName}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate max-w-xs">{product.title}</span>
        </div>

        {/* Top Product Overview Grid */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Gallery Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group">
                <img
                  src={currentImage}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, productImages[1] || FALLBACK_PRODUCT_IMAGE)}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {(product.discount || 0) > 0 && (
                  <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-lg text-xs font-black bg-rose-500 text-white shadow-md">
                    -{product.discount}% OFF
                  </span>
                )}
                {product.isMall && (
                  <span className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-900 text-amber-300 shadow-md">
                    OFFICIAL MALL
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-18 h-18 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
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

            {/* Product Purchase Details (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Brand & Category badges */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-600 text-[11px] font-bold uppercase tracking-wider">
                    {categoryName}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Brand:</span>
                  <span className="text-xs font-bold text-slate-800">{product.brand || 'Original Brand'}</span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-3">
                  {product.title}
                </h1>

                {/* Ratings & Social Proof */}
                <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-slate-100 mb-4">
                  <RatingStars
                    rating={product.rating || 5}
                    size="sm"
                    showNumber
                    reviewCount={totalReviewsCount}
                  />
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-600 font-semibold">
                    {(product.soldCount || 0).toLocaleString()} units sold
                  </span>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                      }
                      if (typeof addToast === 'function') {
                        addToast({
                          type: 'info',
                          title: 'Link Copied',
                          message: 'Product link copied to clipboard!'
                        });
                      }
                    }}
                    className="text-xs text-slate-500 hover:text-orange-600 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>

                {/* Price Bar */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-5 flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-black text-slate-900">
                    ৳{(product.price || 0).toLocaleString()}
                  </span>
                  {(product.originalPrice || 0) > (product.price || 0) && (
                    <span className="text-sm text-slate-400 line-through">
                      ৳{(product.originalPrice || 0).toLocaleString()}
                    </span>
                  )}
                  {(product.discount || 0) > 0 && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      Save ৳{Math.max(0, (product.originalPrice || 0) - (product.price || 0)).toLocaleString()} ({product.discount}%)
                    </span>
                  )}
                  <span className="ml-auto text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> In Stock ({product.stock ?? 10} available)
                  </span>
                </div>

                {/* Color Variants (if any) */}
                {Array.isArray(product.colors) && product.colors.length > 0 && (
                  <div className="mb-4">
                    <span className="block text-xs font-bold text-slate-700 mb-2">
                      Color Family: <span className="font-normal text-slate-600">{selectedColor}</span>
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            selectedColor === c
                              ? 'border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-500/20'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Variants (if any) */}
                {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                  <div className="mb-5">
                    <span className="block text-xs font-bold text-slate-700 mb-2">
                      Size: <span className="font-normal text-slate-600">{selectedSize}</span>
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            selectedSize === s
                              ? 'border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-500/20'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector & Wishlist */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-slate-900 min-w-[2.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stock ?? 99, q + 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleWishlist && toggleWishlist(product)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-colors ${
                      inWishlist
                        ? 'border-rose-200 bg-rose-50 text-rose-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full py-3.5 px-6 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Dynamic Nationwide Delivery & Assurance Engine */}
                <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-800">
                        Delivery Options for:
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <select
                        value={selectedDivision}
                        onChange={(e) =>
                          setSelectedDivision(
                            e.target.value as
                              | 'Dhaka'
                              | 'Chattogram'
                              | 'Sylhet'
                              | 'Rajshahi'
                              | 'Khulna'
                              | 'Barishal'
                              | 'Rangpur'
                              | 'Mymensingh'
                          )
                        }
                        className="px-2.5 py-1 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 outline-hidden focus:border-orange-500 cursor-pointer shadow-2xs"
                      >
                        <option value="Dhaka">Dhaka Division (ঢাকা)</option>
                        <option value="Chattogram">Chattogram Division (চট্টগ্রাম)</option>
                        <option value="Sylhet">Sylhet Division (সিলেট)</option>
                        <option value="Rajshahi">Rajshahi Division (রাজশাহী)</option>
                        <option value="Khulna">Khulna Division (খুলনা)</option>
                        <option value="Barishal">Barishal Division (বরিশাল)</option>
                        <option value="Rangpur">Rangpur Division (রংপুর)</option>
                        <option value="Mymensingh">Mymensingh Division (ময়মনসিংহ)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
                      <Truck className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <span>
                            {selectedDivision === 'Dhaka'
                              ? 'Dhaka Metro: ৳60'
                              : `${selectedDivision}: ৳120`}
                          </span>
                          {(product.price || 0) >= 800 && selectedDivision === 'Dhaka' && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-bold">
                              FREE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {selectedDivision === 'Dhaka'
                            ? '⚡ Express Delivery in 24 Hours'
                            : '📦 Delivery in 2-3 Days via Steadfast Express'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800">Cash on Delivery</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Pay upon delivery • bKash/Nagad also accepted
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 px-1">
                    <span className="flex items-center gap-1">
                      <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
                      7 Days Easy Return Policy
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      100% Authentic Guaranteed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Info Card & Specifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Seller Information (4 cols) */}
          {seller && (
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Sold by Merchant
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600">
                    Verified Seller
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={seller.logo}
                    alt={seller.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-100 p-0.5"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{seller.name}</h3>
                    <p className="text-xs text-slate-500">{seller.location}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{seller.rating} / 5.0 Seller Rating</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl text-center mb-5">
                  <div>
                    <span className="block text-xs text-slate-400">Response</span>
                    <span className="font-extrabold text-xs text-slate-800">
                      {seller.responseRate ? (String(seller.responseRate).includes('%') ? seller.responseRate : `${seller.responseRate}%`) : '98%'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Followers</span>
                    <span className="font-extrabold text-xs text-slate-800">
                      {(seller.followers || 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Products</span>
                    <span className="font-extrabold text-xs text-slate-800">
                      {(seller.productCount || 24)}+
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowChatModal(true)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  Chat with Seller
                </button>
                <Link
                  to={`/store/${seller.id}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Store className="w-4 h-4" />
                  Visit Store
                </Link>
              </div>
            </div>
          )}

          {/* Tabbed Specs, Description & Reviews (8 cols) */}
          <div className={seller ? 'lg:col-span-8' : 'lg:col-span-12'}>
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
              {/* Tab Navigation */}
              <div className="flex border-b border-slate-200 bg-slate-50/50">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-bold transition-all text-center border-b-2 ${
                    activeTab === 'specs'
                      ? 'border-orange-600 text-orange-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-bold transition-all text-center border-b-2 ${
                    activeTab === 'description'
                      ? 'border-orange-600 text-orange-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-bold transition-all text-center border-b-2 ${
                    activeTab === 'reviews'
                      ? 'border-orange-600 text-orange-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Customer Reviews ({totalReviewsCount})
                </button>
              </div>

              <div className="p-6">
                {/* 1. Specifications Tab */}
                {activeTab === 'specs' && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                      Technical Specifications
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {Object.keys(specifications).length > 0 ? (
                        Object.entries(specifications).map(([key, val]) => (
                          <div
                            key={key}
                            className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                          >
                            <span className="text-slate-500 font-medium">{key}</span>
                            <span className="font-bold text-slate-900 text-right">{val}</span>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                          Official manufacturer warranty and standards apply.
                        </div>
                      )}
                      {product.warranty && (
                        <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-slate-500 font-medium">Warranty</span>
                          <span className="font-bold text-slate-900 text-right">{product.warranty}</span>
                        </div>
                      )}
                      {product.deliveryDays && (
                        <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-slate-500 font-medium">Estimated Delivery</span>
                          <span className="font-bold text-emerald-600 text-right">{product.deliveryDays} Business Days</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Description Tab */}
                {activeTab === 'description' && (
                  <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <p>{product.description}</p>
                    <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
                      <h4 className="font-bold text-orange-900 mb-1">Authenticity & Quality Guarantee</h4>
                      <p className="text-orange-800 text-xs">
                        Every item sold on ShopNexa undergoes thorough quality inspection before dispatch. If you find any discrepancies or manufacturing defects, our 7-day unconditional replacement covers your purchase.
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. Customer Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    {/* Reviews Summary Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <span className="text-3xl font-black text-slate-900">{(product.rating || 5.0).toFixed(1)}</span>
                          <span className="text-xs text-slate-400 block">out of 5.0</span>
                        </div>
                        <div className="border-l border-slate-200 pl-4">
                          <RatingStars rating={product.rating || 5} size="sm" />
                          <span className="text-xs text-slate-500 block mt-1">
                            Based on {totalReviewsCount} customer reviews
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                      </button>
                    </div>

                    {/* Write Review Form */}
                    {showReviewForm && (
                      <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl border border-orange-200 bg-orange-50/40 mb-6 space-y-3">
                        <h4 className="text-xs font-bold text-slate-900">Your Experience</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600">Rating:</span>
                          <div className="flex gap-1 text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setReviewRating(s)}
                                className="p-1 cursor-pointer"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    s <= reviewRating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="How is the product quality, packaging, and performance? Share details to help other buyers..."
                            rows={3}
                            className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs outline-hidden focus:border-orange-500"
                          />
                        </div>

                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                        >
                          Submit Review
                        </button>
                      </form>
                    )}

                    {/* Review List */}
                    <div className="space-y-4 divide-y divide-slate-100">
                      {productReviews && productReviews.length > 0 ? (
                        productReviews.map((rev) => (
                          <div key={rev.id || Math.random()} className="pt-4 first:pt-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                                  {(rev.userName || 'U').charAt(0).toUpperCase()}
                                </div>
                                <span className="font-bold text-xs text-slate-800">{rev.userName || 'Verified Buyer'}</span>
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                                  Verified Purchase
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400">{rev.date || 'Recent'}</span>
                            </div>

                            <RatingStars rating={rev.rating || 5} size="xs" className="mb-2" />
                            <p className="text-xs text-slate-700 leading-relaxed mb-2">{rev.comment}</p>

                            <button
                              type="button"
                              onClick={() => markReviewHelpful && markReviewHelpful(rev.id)}
                              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-orange-600 transition-colors cursor-pointer"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>Helpful ({rev.helpfulCount || 0})</span>
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-6 text-xs text-slate-500">
                          No customer reviews yet for this product. Be the first to share your experience!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Similar Products You May Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Chat Modal with Seller */}
      {showChatModal && seller && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-4">
              <img src={seller.logo} alt={seller.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <h3 className="font-bold text-sm text-slate-900">{seller.name}</h3>
                <span className="text-[11px] text-emerald-600 font-semibold">● Online Now</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 mb-4 text-xs text-slate-600">
              <span className="font-bold text-slate-900 block mb-0.5">Regarding item:</span>
              <p className="truncate text-slate-500">{product.title}</p>
            </div>

            <form onSubmit={handleSendSellerChat} className="space-y-3">
              <textarea
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about sizing, warranty, stock, or bulk order..."
                rows={4}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowChatModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-600/20"
                >
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 px-3 py-2.5 shadow-2xl flex items-center gap-2 safe-area-bottom">
        {seller && (
          <button
            onClick={() => setShowChatModal(true)}
            aria-label="Chat with seller"
            className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center shrink-0 min-w-[42px]"
          >
            <MessageSquare className="w-4 h-4 text-slate-600" />
            <span className="text-[9px] font-bold text-slate-500 mt-0.5">Chat</span>
          </button>
        )}

        <button
          onClick={() => toggleWishlist(product)}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`p-2 rounded-xl border transition-colors flex flex-col items-center justify-center shrink-0 min-w-[42px] ${
            inWishlist
              ? 'border-rose-200 bg-rose-50 text-rose-600'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span className="text-[9px] font-bold mt-0.5">{inWishlist ? 'Saved' : 'Wish'}</span>
        </button>

        <button
          onClick={handleAddToCart}
          className="flex-1 py-2.5 px-3 rounded-xl bg-orange-50 text-orange-600 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-orange-100 transition-colors active:scale-98"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 py-2.5 px-3 rounded-xl bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-orange-500 shadow-md shadow-orange-600/20 transition-colors active:scale-98"
        >
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
};

export const ProductDetailPage: React.FC = () => {
  return (
    <ErrorBoundary fallbackTitle="Product Could Not Be Loaded">
      <ProductDetailContent />
    </ErrorBoundary>
  );
};

