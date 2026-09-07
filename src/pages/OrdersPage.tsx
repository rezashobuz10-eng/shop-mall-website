import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Truck,
  Calendar,
  CreditCard,
  ChevronRight,
  ExternalLink,
  Ban,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { EmptyState } from '../components/common/EmptyState';
import { OrderTrackingModal } from '../components/common/OrderTrackingModal';
import { TaxInvoiceModal } from '../components/common/TaxInvoiceModal';
import { Order } from '../types';
import { sanitizeImageUrl, handleImageError, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';

export const OrdersPage: React.FC = () => {
  const { orders, cancelOrder, addToCart, addToast } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'pending':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    addToast({
      type: 'success',
      title: 'Items Added to Cart',
      message: `${order.items.length} items from order ${order.id} re-added to your cart.`
    });
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
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-900">Order #{order.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{order.createdAt}</span>
                    <span className="text-slate-400 hidden sm:inline">•</span>
                    <span className="text-slate-500 font-mono hidden sm:inline">
                      Track: {order.trackingNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
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
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={sanitizeImageUrl(item.product.images[0], item.product.category)}
                          alt={item.product.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                          className="w-12 h-12 object-cover rounded-xl bg-slate-50 border border-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/product/${item.product.id}`}
                            className="text-xs font-bold text-slate-800 hover:text-orange-600 transition-colors line-clamp-1"
                          >
                            {item.product.title}
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
                  ))}
                </div>

                {/* Bottom Total & Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Total:</span>
                    <span className="text-base font-black text-slate-900">
                      ৳{order.total.toLocaleString()}
                    </span>
                    <span className="text-slate-400">({order.paymentMethod})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTrackingOrder(order as unknown as Order)}
                      className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      Track Shipment
                    </button>

                    {order.status === 'pending' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold transition-colors cursor-pointer"
                      >
                        Cancel Order
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
            ))}
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
      </div>
    </div>
  );
};
