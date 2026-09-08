import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  Printer,
  ArrowRight,
  ShieldCheck,
  Navigation,
  FileText
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderTrackingModal } from '../components/common/OrderTrackingModal';
import { TaxInvoiceModal } from '../components/common/TaxInvoiceModal';
import { SmsNotificationToast } from '../components/common/SmsNotificationToast';
import { soundEngine } from '../utils/audioFeedback';
import { Order } from '../types';
import { sanitizeImageUrl, handleImageError, FALLBACK_PRODUCT_IMAGE } from '../utils/imageUtils';
import { extractPaymentDetails } from '../utils/paymentValidation';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useStore();
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showSmsToast, setShowSmsToast] = useState(true);

  const order = orders.find((o) => o.id === id) || orders[0];

  useEffect(() => {
    soundEngine.playOrderSuccess();
  }, []);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Not Found</h2>
        <Link to="/" className="text-orange-600 font-bold hover:underline">
          Return to Marketplace Home
        </Link>
      </div>
    );
  }

  const paymentDetails = extractPaymentDetails(order);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-lg mb-6 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            Thank you for shopping with ShopNexa. We have notified the verified seller to prepare your package for courier pickup.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-8 text-left">
            <div>
              <span className="text-slate-400 block">Order ID</span>
              <span className="font-extrabold text-slate-900">{order.orderNumber || order.id}</span>
            </div>
            <div className="border-l border-slate-200 pl-3">
              <span className="text-slate-400 block">Tracking Number</span>
              <span className="font-extrabold text-orange-600 font-mono">
                {order.trackingNumber || `STF-${(order.orderNumber || order.id).slice(-6).toUpperCase()}`}
              </span>
            </div>
            <div className="border-l border-slate-200 pl-3">
              <span className="text-slate-400 block">Payment</span>
              <span className="font-extrabold text-slate-900 truncate block">
                {paymentDetails.providerName}
              </span>
              {paymentDetails.trxId ? (
                <span className={`text-[10px] font-mono font-bold ${paymentDetails.brandText} block`}>
                  Trx: {paymentDetails.trxId}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 block font-medium">
                  {paymentDetails.modeLabel || paymentDetails.statusBadge}
                </span>
              )}
            </div>
            <div className="border-l border-slate-200 pl-3">
              <span className="text-slate-400 block">Estimated Arrival</span>
              <span className="font-extrabold text-slate-900">
                {order.estimatedDelivery || '2 - 3 Days'}
              </span>
            </div>
          </div>

          {/* Timeline Status */}
          <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 text-left mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-600" />
                Delivery Progress
              </h3>
              <button
                type="button"
                onClick={() => setShowTrackingModal(true)}
                className="px-3 py-1 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Navigation className="w-3 h-3" />
                Live Courier Tracking
              </button>
            </div>

            <div className="flex items-center justify-between relative text-xs">
              {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                const isCurrent = order.status.toLowerCase() === step.toLowerCase();
                const isPassed =
                  (order.status === 'processing' && idx === 0) ||
                  (order.status === 'shipped' && idx <= 1) ||
                  (order.status === 'delivered');

                return (
                  <div key={step} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                        isCurrent
                          ? 'bg-orange-600 text-white ring-4 ring-orange-100'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`font-semibold text-[11px] ${
                        isCurrent ? 'text-orange-600 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary */}
          <div className="text-left border-t border-slate-100 pt-6 mb-8">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Purchased Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => {
                const itemTitle = item.product?.title || item.title || 'Marketplace Product';
                const itemImage = item.product?.images?.[0] || item.image || FALLBACK_PRODUCT_IMAGE;
                const itemCategory = item.product?.category || 'General';

                return (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={sanitizeImageUrl(itemImage, itemCategory)}
                        alt={itemTitle}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                        className="w-12 h-12 object-cover rounded-xl bg-slate-50 border border-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{itemTitle}</p>
                        <span className="text-slate-400 text-[11px]">
                          Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="font-black text-slate-900 shrink-0">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Total breakdown */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery</span>
                <span>৳{order.shippingFee.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Total</span>
                <span className="text-orange-600">৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address Display */}
          <div className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-900 block mb-1">Delivering To:</span>
            <p className="font-semibold text-slate-800">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
            <p>
              Payment: <span className="font-semibold text-slate-800">{paymentDetails.providerName}</span>
              {paymentDetails.trxId && (
                <span className="font-mono text-slate-700 font-semibold"> (Trx: {paymentDetails.trxId})</span>
              )}
              <span className={`ml-1 font-bold ${paymentDetails.statusBadge === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                • {paymentDetails.statusBadge}
              </span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="flex-1 py-3 px-4 rounded-2xl border border-slate-300 hover:border-slate-400 text-slate-800 bg-white hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <FileText className="w-4 h-4 text-orange-600" />
              <span>Official Tax Invoice (রসিদ)</span>
            </button>
            <Link
              to="/orders"
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>View All Orders</span>
            </Link>
            <Link
              to="/"
              className="flex-1 py-3 px-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-colors"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Interactive Order Tracking Modal */}
        {order && (
          <OrderTrackingModal
            isOpen={showTrackingModal}
            onClose={() => setShowTrackingModal(false)}
            order={order as unknown as Order}
          />
        )}

        {/* Official Mushak-6.3 Commercial Tax Invoice Modal */}
        {order && (
          <TaxInvoiceModal
            isOpen={showInvoiceModal}
            onClose={() => setShowInvoiceModal(false)}
            order={order as unknown as Order}
          />
        )}

        {/* Simulated Instant Mobile SMS Confirmation Notification */}
        {showSmsToast && order && (
          <SmsNotificationToast
            orderId={order.id}
            trackingNumber={order.trackingNumber}
            amount={order.total}
            phone={order.shippingAddress.phone}
            customerName={order.shippingAddress.fullName}
            onClose={() => setShowSmsToast(false)}
          />
        )}
      </div>
    </div>
  );
};
