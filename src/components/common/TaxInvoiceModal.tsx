import React from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Building,
  QrCode,
  FileText
} from 'lucide-react';
import { Order } from '../../types';
import { extractPaymentDetails } from '../../utils/paymentValidation';

export interface TaxInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export const TaxInvoiceModal: React.FC<TaxInvoiceModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const vatAmount = Math.round((order.subtotal || 0) * 0.05); // 5% standard retail VAT
  const paymentDetails = extractPaymentDetails(order);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:border-none print:shadow-none print:max-w-none print:rounded-none">
        {/* Modal Top Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-400" />
            <span className="font-bold text-sm">Official Commercial Tax Invoice (চালান রসিদ)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close invoice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Sheet */}
        <div id="printable-tax-invoice" className="p-6 sm:p-10 text-slate-800 bg-white text-xs">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black text-base">
                  SN
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    ShopNexa Bangladesh Ltd.
                  </h1>
                  <span className="text-[10px] text-slate-500 font-semibold block">
                    Premier Multi-Vendor Digital Marketplace
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Level 7, Lotus Kamal Tower, Gulshan-2, Dhaka-1212<br />
                Helpline: 09612-SHOPNEXA • Email: support@shopnexa.com<br />
                <span className="font-semibold text-slate-700">
                  BIN: 002918271-0101 • Digital Commerce Reg: 98124/DCA
                </span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-mono font-bold text-[11px] border border-slate-200 inline-block mb-1">
                FORM MUSHAK-6.3
              </span>
              <p className="text-base font-black text-slate-900 mt-1">
                INVOICE #{order.orderNumber || order.id}
              </p>
              <p className="text-[11px] text-slate-500">
                Date: <span className="font-semibold text-slate-800">{invoiceDate}</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Tracking No:{' '}
                <span className="font-mono font-bold text-orange-600">
                  {order.trackingNumber || `STF-${(order.orderNumber || order.id).slice(-6).toUpperCase()}`}
                </span>
              </p>
            </div>
          </div>

          {/* Billing & Shipping Section */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Customer / Bill To
              </span>
              <p className="font-bold text-slate-900 text-sm">
                {(order.shippingAddress as any)?.fullName || order.customerName || 'Customer'}
              </p>
              <p className="text-slate-600 mt-0.5">
                {(order.shippingAddress as any)?.fullAddress || (order.shippingAddress as any)?.address || 'Standard Shipping Address'}
              </p>
              <p className="text-slate-600">
                {[
                  (order.shippingAddress as any)?.area,
                  (order.shippingAddress as any)?.district || (order.shippingAddress as any)?.city,
                  (order.shippingAddress as any)?.division
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <p className="text-slate-600 font-semibold mt-0.5">
                Phone: {(order.shippingAddress as any)?.phone || order.customerPhone || 'N/A'}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Payment & Fulfillment
              </span>
              <p className="font-bold text-slate-900">
                Method: <span className="uppercase text-orange-600">{paymentDetails.providerName}</span>
              </p>
              {paymentDetails.modeLabel && (
                <p className="text-[11px] text-slate-500 font-medium">
                  Mode: <span className="font-semibold text-slate-800">{paymentDetails.modeLabel}</span>
                </p>
              )}
              {paymentDetails.trxId && (
                <p className="text-[11px] font-mono font-bold mt-0.5">
                  <span className="text-slate-500 font-normal">{paymentDetails.providerName} TrxID: </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-900">
                    {paymentDetails.trxId}
                  </span>
                </p>
              )}
              {paymentDetails.senderNumber && (
                <p className="text-[10px] text-slate-500 font-mono">
                  Sender: {paymentDetails.senderNumber}
                </p>
              )}
              <p className="text-slate-600 mt-0.5">
                Payment Status:{' '}
                <span
                  className={`font-bold ${
                    paymentDetails.statusBadge === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {paymentDetails.statusBadge}
                </span>
              </p>
              <p className="text-slate-600">Courier: Steadfast Express Logistics</p>
              <p className="text-slate-600">
                Estimated Delivery: {order.estimatedDelivery || '2 - 3 Days'}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-[10px] font-bold uppercase text-slate-500 bg-slate-50">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Item Description</th>
                  <th className="py-2 px-2 text-center">Qty</th>
                  <th className="py-2 px-2 text-right">Unit Price</th>
                  <th className="py-2 px-2 text-right">Total (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => {
                  const itemTitle = item.product?.title || item.title || 'Marketplace Product';
                  const itemCategory = item.product?.category || 'General';

                  return (
                    <tr key={idx}>
                      <td className="py-2.5 px-2 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-2">
                        <p className="font-bold text-slate-800">{itemTitle}</p>
                        <span className="text-[10px] text-slate-400">
                          Category: {itemCategory}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-700">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-2 text-right text-slate-700">
                        ৳{item.price.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold text-slate-900">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex flex-col sm:flex-row justify-between items-start pt-3 border-t-2 border-slate-200 gap-4">
            <div className="space-y-2 max-w-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>This digital invoice is system-generated and verified under Digital Commerce Act.</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Return policy: 7 days unconditional replacement from delivery date.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated VAT (5% incl.)</span>
                <span>৳{vatAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span>৳{order.shippingFee.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-300">
                <span>Net Total Payable</span>
                <span className="text-orange-600">৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Official Verification Seal & Signature */}
          <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 border border-dashed border-slate-300 rounded-lg flex items-center justify-center p-1 bg-slate-50">
                <QrCode className="w-12 h-12 text-slate-700" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Scan to Verify Authenticity</span>
                <span className="font-mono text-[11px] font-bold text-slate-700">
                  verify.shopnexa.com/inv/{order.id}
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="w-28 border-b border-slate-800 pb-1 mb-1 mx-auto text-[11px] font-script font-bold text-slate-800 italic">
                Reza Shobuz
              </div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Authorized Signatory
              </span>
              <span className="text-[9px] text-slate-400">ShopNexa Finance & Auditing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
