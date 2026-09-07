import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  X,
  ChevronRight,
  Star,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { RatingStars } from '../components/common/RatingStars';

export const ProductsPage: React.FC = () => {
  const { products, categories } = useStore();
  const location = useLocation();
  const params = useParams<{ slug?: string }>();

  // URL Query parsing
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = (queryParams.get('q') || '').trim();
  const filterQuery = (queryParams.get('filter') || '').trim();
  const categoryParam = (params.slug || queryParams.get('category') || '').trim();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState<boolean>(false);
  const [mallOnly, setMallOnly] = useState<boolean>(false);
  const [flashOnly, setFlashOnly] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // View Mode & Sort
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'match' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'sold'>('match');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category slug/param if route changes
  useEffect(() => {
    if (categoryParam) {
      const match = categories.find(
        (c) =>
          c.slug.toLowerCase() === categoryParam.toLowerCase() ||
          c.name.toLowerCase() === categoryParam.toLowerCase() ||
          c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === categoryParam.toLowerCase()
      );
      if (match) {
        setSelectedCategory(match.name);
      } else {
        setSelectedCategory(categoryParam);
      }
    } else {
      setSelectedCategory('');
    }
  }, [categoryParam, categories]);

  // Sync query filter
  useEffect(() => {
    if (filterQuery === 'flash') {
      setFlashOnly(true);
      setMallOnly(false);
    } else if (filterQuery === 'mall') {
      setMallOnly(true);
      setFlashOnly(false);
    } else if (filterQuery === 'bestseller') {
      setSortBy('sold');
    } else if (filterQuery === 'new') {
      setSortBy('newest');
    } else {
      setFlashOnly(false);
      setMallOnly(false);
    }
  }, [filterQuery]);

  // Extract all unique brands
  const allBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

  // Handle brand toggle
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedBrands([]);
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setFreeDeliveryOnly(false);
    setMallOnly(false);
    setFlashOnly(false);
    setInStockOnly(false);
    setSortBy('match');
  };

  // Main Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search text
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
        const matchesCategory = p.category ? p.category.toLowerCase().includes(q) : false;
        const matchesTag = p.tags && Array.isArray(p.tags) ? p.tags.some((t) => t.toLowerCase().includes(q)) : false;
        if (!matchesTitle && !matchesBrand && !matchesCategory && !matchesTag) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory) {
        const sel = selectedCategory.toLowerCase().trim();
        const pCat = (p.category || '').toLowerCase().trim();
        if (pCat !== sel && !pCat.includes(sel) && !sel.includes(pCat)) {
          return false;
        }
      }

      // Brand filter
      if (selectedBrands.length > 0 && (!p.brand || !selectedBrands.includes(p.brand))) {
        return false;
      }

      // Price range
      if (minPrice !== '' && p.price < minPrice) return false;
      if (maxPrice !== '' && p.price > maxPrice) return false;

      // Rating
      if (minRating > 0 && p.rating < minRating) return false;

      // Badges
      if (freeDeliveryOnly && !p.freeDelivery) return false;
      if (mallOnly && !p.isMall) return false;
      if (flashOnly && !p.isFlashSale) return false;
      if (inStockOnly && p.stock <= 0) return false;

      return true;
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedBrands,
    minPrice,
    maxPrice,
    minRating,
    freeDeliveryOnly,
    mallOnly,
    flashOnly,
    inStockOnly
  ]);

  // Main Sorting Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      case 'sold':
        return list.sort((a, b) => b.soldCount - a.soldCount);
      case 'match':
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  // Has any active filters?
  const hasActiveFilters =
    Boolean(selectedCategory) ||
    selectedBrands.length > 0 ||
    minPrice !== '' ||
    maxPrice !== '' ||
    minRating > 0 ||
    freeDeliveryOnly ||
    mallOnly ||
    flashOnly ||
    inStockOnly;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-6 pb-24 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link to="/products" className="hover:text-orange-600">All Products</Link>
          {selectedCategory && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-900 font-semibold">{selectedCategory}</span>
            </>
          )}
          {searchQuery && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-900 font-semibold">Search: "{searchQuery}"</span>
            </>
          )}
        </div>

        {/* Page Title & Mobile Filter Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategory
                ? selectedCategory
                : 'Marketplace Catalog'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {sortedProducts.length} verified products available for prompt shipping
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs"
            >
              <Filter className="w-4 h-4 text-orange-600" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-1.5 shadow-xs">
              <span className="text-xs text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-bold text-slate-800 bg-transparent outline-hidden cursor-pointer"
              >
                <option value="match">Best Match</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="sold">Most Popular</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-200/70 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-500 mr-1">Active Filters:</span>

            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-semibold">
                Category: {selectedCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
              </span>
            )}

            {selectedBrands.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-semibold"
              >
                Brand: {b}
                <X className="w-3 h-3 cursor-pointer" onClick={() => toggleBrand(b)} />
              </span>
            ))}

            {(minPrice !== '' || maxPrice !== '') && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-semibold">
                Price: ৳{minPrice || 0} - ৳{maxPrice || '∞'}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                />
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-semibold">
                {minRating}★ & Up
                <X className="w-3 h-3 cursor-pointer" onClick={() => setMinRating(0)} />
              </span>
            )}

            {freeDeliveryOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                Free Delivery
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFreeDeliveryOnly(false)} />
              </span>
            )}

            {mallOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold">
                Official Mall
                <X className="w-3 h-3 cursor-pointer" onClick={() => setMallOnly(false)} />
              </span>
            )}

            {flashOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold">
                Flash Deals
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFlashOnly(false)} />
              </span>
            )}

            <button
              onClick={resetFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              Clear All
            </button>
          </div>
        )}

        {/* Main Grid with Sidebar Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-orange-600" />
                Filter Catalog
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-orange-600 hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Categories
              </h4>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors flex justify-between items-center ${
                    selectedCategory === ''
                      ? 'bg-orange-50 font-bold text-orange-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] text-slate-400">{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-lg transition-colors flex justify-between items-center ${
                      selectedCategory === cat.name
                        ? 'bg-orange-50 font-bold text-orange-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400">{cat.productCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Price (৳)
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-orange-500"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-orange-500"
                />
              </div>
            </div>

            {/* Brands */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Popular Brands
              </h4>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {allBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Minimum Rating
              </h4>
              <div className="space-y-1.5">
                {[4, 3, 2].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                    className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition-colors ${
                      minRating === stars ? 'bg-orange-50 text-orange-600 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <RatingStars rating={stars} size="xs" />
                    <span className="text-[11px] text-slate-500">& Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Special Checkboxes */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Service & Promotion
              </h4>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={freeDeliveryOnly}
                  onChange={(e) => setFreeDeliveryOnly(e.target.checked)}
                  className="rounded border-slate-300 text-orange-600"
                />
                <span>Free Delivery</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mallOnly}
                  onChange={(e) => setMallOnly(e.target.checked)}
                  className="rounded border-slate-300 text-orange-600"
                />
                <span>ShopNexa Mall (100% Genuine)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flashOnly}
                  onChange={(e) => setFlashOnly(e.target.checked)}
                  className="rounded border-slate-300 text-orange-600"
                />
                <span>Flash Sale Deals</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-300 text-orange-600"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Listing Area */}
          <div className="lg:col-span-3">
            {sortedProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
                    : 'flex flex-col gap-3'
                }
              >
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant={viewMode === 'list' ? 'horizontal' : 'default'}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Filter}
                title="No Products Found"
                description="We couldn't find any products matching your specific filters. Try clearing or relaxing your parameters."
                actionText="Reset All Filters"
                onAction={resetFilters}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-sm text-slate-900">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Mobile Category Select */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Price */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">Price Range (৳)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Mobile Toggles */}
              <div className="space-y-2 mb-6">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={freeDeliveryOnly}
                    onChange={(e) => setFreeDeliveryOnly(e.target.checked)}
                  />
                  <span>Free Delivery</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={mallOnly}
                    onChange={(e) => setMallOnly(e.target.checked)}
                  />
                  <span>ShopNexa Mall</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={flashOnly}
                    onChange={(e) => setFlashOnly(e.target.checked)}
                  />
                  <span>Flash Deals</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
