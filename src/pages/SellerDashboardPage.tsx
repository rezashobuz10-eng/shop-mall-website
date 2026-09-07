import React, { useState } from 'react';
import {
  DollarSign,
  Package,
  ShoppingBag,
  Star,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  X,
  Store,
  Filter
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { sanitizeImageUrl, handleImageError, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';

export const SellerDashboardPage: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    categories,
    currentUser,
    addToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('products');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    brand: 'Apex Footwear',
    category: 'Shoes',
    price: 2490,
    originalPrice: 3200,
    discount: 22,
    stock: 50,
    images: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    description: 'High quality genuine craftsmanship designed for maximum comfort and durability.',
    isMall: true,
    isFlashSale: false
  });

  // Calculate Metrics
  const sellerOrders = orders; // for demo show all orders or seller orders
  const totalRevenue = sellerOrders.reduce((sum, o) => sum + o.total, 0);
  const totalItemsSold = sellerOrders.reduce((sum, o) => sum + o.items.length, 0);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      brand: 'Apex Footwear',
      category: 'Shoes',
      price: 1990,
      originalPrice: 2500,
      discount: 20,
      stock: 45,
      images: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      description: 'Official authentic store product with brand warranty.',
      isMall: true,
      isFlashSale: false
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      title: p.title,
      brand: p.brand,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      discount: p.discount,
      stock: p.stock,
      images: p.images[0] || '',
      description: p.description,
      isMall: p.isMall,
      isFlashSale: p.isFlashSale
    });
    setShowAddModal(true);
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      addToast({
        type: 'error',
        title: 'Title Required',
        message: 'Please provide a product title.'
      });
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...editingProduct,
        ...formData,
        images: [formData.images]
      });
      addToast({
        type: 'success',
        title: 'Product Updated',
        message: `${formData.title} has been updated.`
      });
    } else {
      addProduct({
        title: formData.title,
        brand: formData.brand,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discount: Number(formData.discount),
        stock: Number(formData.stock),
        images: [formData.images],
        description: formData.description,
        rating: 4.8,
        reviewCount: 1,
        soldCount: 0,
        sellerId: currentUser?.sellerId || 'seller-1',
        isMall: formData.isMall,
        isFlashSale: formData.isFlashSale,
        freeDelivery: true,
        tags: [formData.category.toLowerCase(), formData.brand.toLowerCase()],
        reviews: []
      });
      addToast({
        type: 'success',
        title: 'Product Listed',
        message: 'Your product is now active in the ShopNexa marketplace!'
      });
    }

    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                <Store className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black text-slate-900">Seller Merchant Portal</h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage inventory, process customer orders, and inspect your sales analytics
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Revenue
            </span>
            <span className="text-2xl font-black text-slate-900">
              ৳{totalRevenue.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              +14.2% from last week
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Orders
            </span>
            <span className="text-2xl font-black text-slate-900">{sellerOrders.length}</span>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              {sellerOrders.filter((o) => o.status === 'pending').length} pending dispatch
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Catalog Items
            </span>
            <span className="text-2xl font-black text-slate-900">{products.length}</span>
            <span className="text-[11px] text-orange-600 font-medium block mt-1">
              All active & searchable
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Merchant Rating
            </span>
            <span className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
              4.9 <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              98% positive reviews
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'products'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Product Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Fulfillment Orders ({sellerOrders.length})
          </button>
        </div>

        {/* Tab 1: Product Inventory Management Table */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">All Listed Items</h2>
              <span className="text-xs text-slate-500">Live on marketplace</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (৳)</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Sold</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={sanitizeImageUrl(p.images[0], p.category)}
                          alt={p.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                          className="w-10 h-10 object-cover rounded-xl bg-slate-50 border border-slate-100 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-slate-900 truncate">{p.title}</p>
                          <span className="text-[10px] text-slate-400">{p.brand}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{p.category}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ৳{p.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            p.stock > 10
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {p.soldCount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this product from your store?')) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Orders Fulfillment Table */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Customer Order Queue</h2>
              <span className="text-xs text-slate-500">Update status to notify customer</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status & Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sellerOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        #{order.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">
                          {order.shippingAddress.fullName}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          {order.shippingAddress.city}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700">
                          {order.items.length} item(s)
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900">
                        ৳{order.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700">{order.paymentMethod}</span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold uppercase cursor-pointer border ${
                            order.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : order.status === 'shipped'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : order.status === 'processing'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Inventory Item'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Apex Men's Genuine Leather Casual Loafers"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (৳)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, originalPrice: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-orange-500"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isMall}
                    onChange={(e) => setFormData({ ...formData, isMall: e.target.checked })}
                  />
                  <span>ShopNexa Mall Brand</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isFlashSale}
                    onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
                  />
                  <span>Feature in Flash Sale</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white font-bold shadow-md shadow-orange-600/20"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
