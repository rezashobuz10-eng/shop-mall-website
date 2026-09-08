import React, { useState } from 'react';
import {
  X,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Package,
  Building,
  Navigation,
  ShieldCheck,
  RefreshCw,
  CreditCard,
  Copy,
  Check
} from 'lucide-react';
import { Order } from '../../types';
import { extractPaymentDetails } from '../../utils/paymentValidation';

export interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onAdvanceStatus?: (orderId: string, nextStatus: string) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  order,
  onAdvanceStatus
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedTrx, setCopiedTrx] = useState(false);
  const [callRiderToast, setCallRiderToast] = useState(false);

  if (!isOpen || !order) return null;

  const paymentDetails = extractPaymentDetails(order);

  const trackingSteps = [
    {
      title: 'Order Confirmed',
      desc: 'Seller accepted and confirmed the order items',
      location: 'Seller Warehouse (Gulshan Hub)',
      time: 'Today, 10:15 AM',
      done: true
    },
    {
      title: 'Quality Check & Packed',
      desc: 'Items passed physical inspection & packaging',
      location: 'ShopNexa Sorting Hub',
      time: 'Today, 01:30 PM',
      done: order.status !== 'Pending'
    },
    {
      title: 'Dispatched to Courier',
      desc: 'Handed over to Steadfast Logistics Express',
      location: 'Tejgaon Central Hub, Dhaka',
      time: 'Today, 04:00 PM',
      done: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status)
    },
    {
      title: 'Out for Delivery',
      desc: 'Courier rider assigned with OTP verification',
      location: order.shippingAddress?.district || order.shippingAddress?.city || 'Local Delivery Station',
      time: 'In Progress',
      done: ['Out for Delivery', 'Delivered'].includes(order.status)
    },
    {
      title: 'Delivered',
      desc: 'Package handed to recipient with signature',
      location: order.shippingAddress?.fullAddress || 'Customer Address',
      time: order.status === 'Delivered' ? 'Delivered' : 'Expected in 4-8 hrs',
      done: order.status === 'Delivered'
    }
  ];

  const handleCopyTracking = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(order.orderNumber || order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCallRider = () => {
    setCallRiderToast(true);
    setTimeout(() => setCallRiderToast(false), 3000);
  };

  const statusProgressPercent = {
    Pending: 20,
    Confirmed: 35,
    Processing: 50,
    Shipped: 75,
    'Out for Delivery': 90,
    Delivered: 100,
    Cancelled: 0
  }[order.status] || 40;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 relative select-none shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-wider border border-orange-500/30">
              Steadfast Express Logistics
            </span>
            <span className="text-[11px] text-slate-300 flex items-center gap-1 font-mono">
              <Navigation className="w-3 h-3 text-orange-400" /> Live GPS Simulated
            </span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-black tracking-tight">Order #{order.orderNumber || order.id}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-300 font-mono">Tracking ID:</span>
                <button
                  type="button"
                  onClick={handleCopyTracking}
                  className="text-xs font-mono text-orange-400 hover:text-orange-300 underline font-bold cursor-pointer"
                >
                  {copied ? 'Copied!' : `STF-${order.id.slice(-6).toUpperCase()}`}
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Status</span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-500 text-white shadow-xs inline-block">
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Rider Call Alert Simulation */}
          {callRiderToast && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 animate-bounce" />
                <span>Simulated call placed to Courier Rider <strong>Md. Tariqul Islam (01712-987654)</strong></span>
              </div>
            </div>
          )}

          {/* Visual Progress Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Overall Delivery Completion</span>
              <span className="text-orange-600">{statusProgressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${statusProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Courier & Assigned Rider Card */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-base shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-sm">Md. Tariqul Islam</h4>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                    Verified Courier
                  </span>
                </div>
                <p className="text-xs text-slate-400">Steadfast Priority Express (Bike #DH-HA-4982)</p>
                <p className="text-[11px] text-amber-400 font-semibold mt-0.5">Rating: ★ 4.9 (1,240+ completed trips)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCallRider}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Rider
              </button>
            </div>
          </div>

          {/* Delivery Route / Destination */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
            <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="font-bold text-slate-800 block mb-0.5">Delivery Destination:</span>
              <p className="text-slate-600 leading-relaxed">
                {order.shippingAddress?.fullName ? `${order.shippingAddress.fullName} • ` : ''}
                {order.shippingAddress?.phone ? `${order.shippingAddress.phone} • ` : ''}
                {order.shippingAddress?.fullAddress ||
                  `${order.shippingAddress?.district || 'Dhaka'}, Bangladesh`}
              </p>
            </div>
          </div>

          {/* Payment & Verification Summary */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl ${paymentDetails.brandBg} ${paymentDetails.brandText} flex items-center justify-center font-black text-xs border ${paymentDetails.brandBorder}`}
              >
                {paymentDetails.isMfs ? paymentDetails.provider.slice(0, 2).toUpperCase() : 'PAY'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900">{paymentDetails.providerName}</span>
                  {paymentDetails.modeLabel && (
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {paymentDetails.modeLabel}
                    </span>
                  )}
                </div>
                {paymentDetails.senderNumber && (
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Sender: {paymentDetails.senderNumber}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-right">
              {paymentDetails.trxId && (
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(paymentDetails.trxId!);
                      setCopiedTrx(true);
                      setTimeout(() => setCopiedTrx(false), 2000);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                  title="Copy TrxID"
                >
                  <span>Trx: {paymentDetails.trxId}</span>
                  {copiedTrx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>
              )}
              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                  paymentDetails.statusBadge === 'Paid'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {paymentDetails.statusBadge}
              </span>
            </div>
          </div>

          {/* Step Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Transit Log & Milestones
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {trackingSteps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  <div
                    className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                      step.done
                        ? 'bg-orange-600 border-orange-600 text-white shadow-xs'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {step.done ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className={`text-xs font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-mono">{step.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{step.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500">
            Estimated Delivery: <strong>Tomorrow within 6:00 PM</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
};
