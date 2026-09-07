import React, { useState } from 'react';
import {
  Plus,
  Package,
  Sparkles,
  Trash2,
  Search,
  ExternalLink,
  CheckCircle2,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Layers,
  Flame,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Link } from 'react-router-dom';

const SAMPLE_PRESET_IMAGES = [
  {
    name: 'Sports Dumbbell Set',
    category: 'Sports',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Sports Football / Soccer',
    category: 'Sports',
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Running Sports Shoes',
    category: 'Sports',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Smartphone Flagship',
    category: 'Mobile Phones',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Wireless ANC Headphones',
    category: 'Electronics',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Cotton Casual Shirt',
    category: "Men's Fashion",
    url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80'
  }
];

export const ProductManager: React.FC = () => {
  const { products, addProduct, deleteProduct, categories, addToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Form State for Adding New Product
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sports');
  const [brand, setBrand] = useState('Apex Sports');
  const [price, setPrice] = useState<number | ''>(1250);
  const [originalPrice, setOriginalPrice] = useState<number | ''>(1850);
  const [stock, setStock] = useState<number | ''>(50);
  const [description, setDescription] = useState(
    'Premium high-grade performance equipment crafted for durability and comfort.'
  );
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  );
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [isMall, setIsMall] = useState(true);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [freeDelivery, setFreeDelivery] = useState(true);

  // Auto calculate discount percentage
  const discountPercent =
    price && originalPrice && Number(originalPrice) > Number(price)
      ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
      : 0;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !originalPrice || !stock) {
      addToast({
        type: 'warning',
        title: 'Missing Details',
        message: 'Please fill in all product fields.'
      });
      return;
    }

    const newProd = addProduct({
      title: title.trim(),
      description: description.trim(),
      category: category,
      brand: brand.trim() || 'ShopNexa Brand',
      price: Number(price),
      originalPrice: Number(originalPrice),
      discount: discountPercent,
      rating: 4.8,
      reviewCount: 1,
      soldCount: 0,
      stock: Number(stock),
      images: [imageUrl.trim()],
      sellerId: 'seller-1',
      sellerName: 'ShopNexa Official Mall',
      tags: [category.toLowerCase(), brand.toLowerCase(), 'official', 'verified'],
      isFlashSale,
      isMall,
      isNewArrival,
      freeDelivery,
      specifications: {
        'Quality Standard': '100% Original',
        'Warranty': '1 Year Official Warranty',
        'Shipping': 'Fast Nationwide Delivery'
      }
    });

    addToast({
      type: 'success',
      title: 'Product Published',
      message: `"${newProd.title.slice(0, 30)}..." is now live in the store!`
    });

    // Reset Form
    setTitle('');
    setPrice(1250);
    setOriginalPrice(1850);
    setStock(50);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategoryFilter === 'all' ||
      p.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8">
      {/* 1. Add New Product Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-orange-600" />
              Add New Product (নতুন পণ্য যুক্ত করুন)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly publish new merchandise directly to ShopNexa live marketplace catalog
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-800">
            Total Live Catalog: {products.length} Items
          </span>
        </div>

        <form onSubmit={handleAddProduct} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Left Column (8 cols): Details */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Product Title / Name (পণ্যের নাম) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pro Grip Rubber Dumbbell Set (Pair 10kg) with Anti-Slip Coating"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category (ক্যাটাগরি) *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Apex, Yonex, Nike, Xiaomi"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity (স্টক) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    placeholder="50"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Selling Price (বিক্রয় মূল্য ৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="1250"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-orange-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Original Regular Price (আসল দাম ৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    placeholder="1850"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Calculated Discount (ছাড় %)
                  </label>
                  <div className="w-full p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl font-black text-emerald-700 text-sm flex items-center justify-between">
                    <span>{discountPercent}% OFF</span>
                    <Tag className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description (বিবরণ)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide comprehensive details about material, specifications, sizing and usage..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              {/* Badges and Flags */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isMall}
                    onChange={(e) => setIsMall(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>100% Genuine Mall Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isFlashSale}
                    onChange={(e) => setIsFlashSale(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>Include in Flash Sale</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={freeDelivery}
                    onChange={(e) => setFreeDelivery(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Free Delivery Tag</span>
                </label>
              </div>
            </div>

            {/* Right Column (4 cols): Product Image Preview & Quick Presets */}
            <div className="md:col-span-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Product Image URL (ছবির লিংক) *
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-[11px] mb-2"
                />

                {/* Live Image Preview */}
                <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white rounded text-[9px] font-semibold backdrop-blur-xs">
                    Live Preview
                  </div>
                </div>

                {/* Quick Presets for Demo */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Quick Sample Presets (এক ক্লিকে ছবি বাছুন)
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setImageUrl(preset.url);
                          setCategory(preset.category);
                          if (!title) setTitle(preset.name);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-orange-500 bg-white text-left text-[10px] truncate hover:text-orange-600 transition-colors"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Publish Product to Live Store (পণ্যটি প্রকাশ করুন)
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 2. Existing Products Catalog Table & Stock Inspector */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-600" />
              Live Store Inventory List ({filteredProducts.length})
            </h2>
            <p className="text-xs text-slate-500">
              Inspect current stock, prices, sold volumes, and delete or manage products
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl w-44"
              />
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 uppercase tracking-wider text-[10px] font-bold text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Units Sold</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80';
                        }}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <Link
                          to={`/product/${p.id}`}
                          className="font-bold text-slate-900 hover:text-orange-600 line-clamp-1 flex items-center gap-1"
                        >
                          {p.title}
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                        </Link>
                        <span className="text-[10px] text-slate-400">{p.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{p.category}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">৳{p.price.toLocaleString()}</span>
                    {p.discount > 0 && (
                      <span className="ml-1 text-[10px] text-rose-500 font-bold">
                        -{p.discount}%
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock > 10
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.stock} in stock
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {p.soldCount || 0} sold
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove "${p.title}"?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
