import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Package,
  Truck,
  Calendar,
  CreditCard,
  ChevronRight,
  ExternalLink,
  Ban,
  ShoppingBag,
  Edit3,
  MapPin,
  Clock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { EmptyState } from '../components/common/EmptyState';
import { OrderTrackingModal } from '../components/common/OrderTrackingModal';
import { TaxInvoiceModal } from '../components/common/TaxInvoiceModal';
import { OrderEditModal } from '../components/common/OrderEditModal';
import { Order } from '../types';
import { sanitizeImageUrl, handleImageError, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';
import { extractPaymentDetails } from '../utils/paymentValidation';

export const OrdersPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { orders, cancelOrder, addToCart, getProductById, addToast } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      const match = orders.find(
        (o) =>
          o.id.toLowerCase() === id.toLowerCase() ||
          (o.orderNumber && o.orderNumber.toLowerCase() === id.toLowerCase()) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase() === id.toLowerCase())
      );
      if (match) {
        setTrackingOrder(match);
      }
    }
  }, [id, orders]);

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return (o.status || '').toLowerCase() === filterStatus.toLowerCase();
  });

  const getStatusBadge = (status: string = 'Pending') => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'shipped':
      case 'out for delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
      case 'confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'pending':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleReorder = (order: Order) => {
    let readdedCount = 0;
    order.items.forEach((item) => {
      const prod = item.product || (item.productId ? getProductById(item.productId) : undefined);
      if (prod) {
        addToCart(prod, item.quantity);
        readdedCount++;
      }
    });
    addToast({
      type: 'success',
      title: 'Items Added to Cart',
      message: `${readdedCount || order.items.length} items from order #${order.orderNumber || order.id} re-added to your cart.`
    });
  };

  const formatOrderDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    } catch {
      // fallback
    }
    return dateStr || 'Recent';
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-6 pb-24 sm:pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-semibold">My Orders & Tracking</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Order History</h1>
            <p className="text-xs text-slate-500">
              Track live shipments and review past marketplace orders
            </p>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                  filterStatus === tab
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const payment = extractPaymentDetails(order);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-900">Order #{order.orderNumber || order.id}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{formatOrderDate(order.createdAt)}</span>
                      <span className="text-slate-400 hidden sm:inline">•</span>
                      <span className="text-slate-500 font-mono hidden sm:inline">
                        Track: {order.trackingNumber || order.orderNumber || order.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {payment.trxId && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${payment.brandBg} border ${payment.brandBorder} ${payment.brandText}`}
                        >
                          {payment.providerName}: {payment.trxId}
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                {/* Items */}
                <div className="py-4 space-y-3">
                  {order.items.map((item, idx) => {
                    const itemTitle = item.product?.title || item.title || 'Marketplace Product';
                    const itemImage = item.product?.images?.[0] || item.image || FALLBACK_PRODUCT_IMAGE;
                    const itemCategory = item.product?.category || 'General';
                    const itemId = item.product?.id || item.productId || 'prod-1';

                    return (
                      <div key={idx} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={sanitizeImageUrl(itemImage, itemCategory)}
                            alt={itemTitle}
                            referrerPolicy="no-referrer"
                            onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                            className="w-12 h-12 object-cover rounded-xl bg-slate-50 border border-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <Link
                              to={`/product/${itemId}`}
                              className="text-xs font-bold text-slate-800 hover:text-orange-600 transition-colors line-clamp-1"
                            >
                              {itemTitle}
                            </Link>
                            <span className="text-[11px] text-slate-400">
                              Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-extrabold text-slate-900">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery Address & Status Notice */}
                <div className="my-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-slate-700 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span className="font-bold text-slate-900">{order.customerName || 'গ্রাহক'}:</span>
                    <span className="text-slate-600 truncate max-w-md">
                      {typeof order.shippingAddress === 'string'
                        ? order.shippingAddress
                        : `${(order.shippingAddress as Record<string, string>)?.fullAddress || ''}, ${(order.shippingAddress as Record<string, string>)?.district || ''}, ${(order.shippingAddress as Record<string, string>)?.division || ''}`}
                    </span>
                    {order.customerPhone && (
                      <span className="text-slate-400 font-mono text-[11px] shrink-0">
                        • {order.customerPhone}
                      </span>
                    )}
                  </div>

                  {order.status !== 'Shipped' &&
                    order.status !== 'Out for Delivery' &&
                    order.status !== 'Delivered' &&
                    order.status !== 'Cancelled' && (
                      <button
                        type="button"
                        onClick={() => setEditingOrder(order)}
                        className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>ঠিকানা বা অর্ডার পরিবর্তন</span>
                      </button>
                    )}
                </div>

                {/* Cancelled Reason Notice if cancelled */}
                {order.status.toLowerCase() === 'cancelled' && (
                  <div className="my-2.5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                    <Ban className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      <strong className="font-bold">অর্ডার বাতিল হয়েছে:</strong>{' '}
                      {order.cancelReason || 'গ্রাহকের অনুরোধে অর্ডারটি বাতিল করা হয়েছে।'}
                    </span>
                  </div>
                )}

                {/* Bottom Total & Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-500">Total:</span>
                    <span className="text-base font-black text-slate-900">
                      ৳{order.total.toLocaleString()}
                    </span>
                    <span className="text-slate-500 font-medium">
                      ({payment.providerName}
                      {payment.modeLabel ? ` • ${payment.modeLabel}` : ''})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTrackingOrder(order as unknown as Order)}
                      className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      Track Shipment
                    </button>

                    {order.status !== 'Shipped' &&
                      order.status !== 'Out for Delivery' &&
                      order.status !== 'Delivered' &&
                      order.status !== 'Cancelled' && (
                        <button
                          type="button"
                          onClick={() => setEditingOrder(order)}
                          className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>পরিবর্তন / বাতিল</span>
                        </button>
                      )}

                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white font-bold transition-colors cursor-pointer"
                    >
                      Buy Again
                    </button>

                    <button
                      type="button"
                      onClick={() => setInvoiceOrder(order as unknown as Order)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 font-bold transition-colors cursor-pointer"
                    >
                      Official Invoice
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title="No Orders Found"
            description="You don't have any orders under this filter status."
            actionText="Browse Marketplace"
            actionLink="/products"
          />
        )}

        {/* Live Shipment Tracking Modal */}
        {trackingOrder && (
          <OrderTrackingModal
            isOpen={!!trackingOrder}
            onClose={() => setTrackingOrder(null)}
            order={trackingOrder}
          />
        )}

        {/* Official Mushak-6.3 Commercial Tax Invoice Modal */}
        {invoiceOrder && (
          <TaxInvoiceModal
            isOpen={!!invoiceOrder}
            onClose={() => setInvoiceOrder(null)}
            order={invoiceOrder}
          />
        )}

        {/* Order Edit / Cancel Window Modal */}
        {editingOrder && (
          <OrderEditModal
            isOpen={!!editingOrder}
            onClose={() => setEditingOrder(null)}
            order={editingOrder}
          />
        )}
      </div>
    </div>
  );
};
