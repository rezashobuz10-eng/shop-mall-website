import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Truck,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  Phone,
  Mail,
  MessageSquare,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HelpCenterPage: React.FC = () => {
  const { addToast } = useStore();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      q: 'How long does delivery take across Bangladesh?',
      a: 'Inside Dhaka & Chattogram metropolitan areas, standard delivery takes 1 to 2 business days. Express delivery arrives next day. For all other districts, thanas, and upazilas across Bangladesh, delivery typically takes 2 to 4 business days via our courier partners (Steadfast, Pathao, RedX).'
    },
    {
      q: 'How does Cash on Delivery (COD) work?',
      a: 'With Cash on Delivery, you pay cash in Bangladeshi Taka (৳) directly to the delivery rider once your parcel arrives at your doorstep. You can inspect the outer packaging and seal before making the payment.'
    },
    {
      q: 'How do I pay using bKash or Nagad?',
      a: 'During checkout, choose either bKash or Nagad under the Payment Options. You can complete the payment seamlessly through the MFS gateway. You will receive an instant payment confirmation SMS and email receipt.'
    },
    {
      q: 'What is the ShopNexa 7 & 14-Day Return Policy?',
      a: 'If you receive a defective, wrong, damaged, or counterfeit product, you can initiate a return within 7 days (or 14 days for ShopNexa Mall items) through your Orders dashboard. Our courier partner will pick up the parcel from your address free of charge.'
    },
    {
      q: 'How do I track my order status in real time?',
      a: 'Every confirmed order is assigned a unique tracking number (e.g. SN-849204). You can visit "My Orders" from your account dropdown to view live step-by-step dispatch checkpoints: Pending, Processing, Shipped, and Delivered.'
    },
    {
      q: 'Are all products on ShopNexa authentic?',
      a: 'Items marked with the "ShopNexa Mall" badge are 100% genuine and sourced directly from certified brand manufacturers or authorized distributors (such as Walton, Apex, Yellow, PRAN, Xiaomi). All other marketplace sellers are verified with Trade Licenses and NID.'
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-semibold">Customer Support & Help Center</span>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center mb-10 shadow-xl relative overflow-hidden">
          <h1 className="text-2xl sm:text-3xl font-black mb-3">How can we help you today?</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-6">
            Find answers to frequently asked questions regarding order tracking, deliveries, and payment methods in Bangladesh.
          </p>

          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics (e.g. refund, delivery, bKash)..."
              className="w-full py-3 pl-11 pr-4 rounded-2xl bg-white text-slate-800 text-xs font-semibold outline-hidden shadow-lg focus:ring-2 focus:ring-orange-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* 3 Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs text-center">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Fast Delivery</h3>
            <p className="text-xs text-slate-500 mb-4">
              Tracking, delivery timeframes, and shipping charges across 64 districts.
            </p>
            <Link
              to="/orders"
              className="text-xs font-bold text-orange-600 hover:underline inline-flex items-center gap-1"
            >
              Track Active Order &rarr;
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Returns & Refunds</h3>
            <p className="text-xs text-slate-500 mb-4">
              Hassle-free doorstep collection within 7-14 days and fast bKash refund.
            </p>
            <button
              onClick={() => {
                addToast({
                  type: 'info',
                  title: 'Return Guidelines',
                  message: 'You can initiate returns directly from your order history invoice.'
                });
              }}
              className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1"
            >
              Return Instructions &rarr;
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Payment Options</h3>
            <p className="text-xs text-slate-500 mb-4">
              bKash, Nagad, Rocket, Visa, Mastercard, and Cash on Delivery guidelines.
            </p>
            <button
              onClick={() => {
                addToast({
                  type: 'info',
                  title: 'Payment Security',
                  message: 'All online transactions are encrypted via 256-bit SSL protocols.'
                });
              }}
              className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Payment FAQs &rarr;
            </button>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs mb-10">
          <h2 className="text-lg font-black text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="divide-y divide-slate-100">
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <span className="font-bold text-xs sm:text-sm text-slate-900">{faq.q}</span>
                  {activeFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-orange-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {activeFaq === idx && (
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="bg-orange-50 rounded-3xl border border-orange-200/70 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-black text-slate-900">Still need assistance?</h3>
            <p className="text-xs text-slate-600 mt-1">
              Our 24/7 dedicated customer care team in Dhaka is ready to assist you.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+8809612000000"
              className="px-4 py-2.5 bg-white text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs hover:bg-slate-50 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-orange-600" />
              <span>09612-SHOPNEXA</span>
            </a>
            <button
              onClick={() => {
                addToast({
                  type: 'info',
                  title: 'Live Chat Connected',
                  message: 'Support Agent Sadia has joined the chat session.'
                });
              }}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Start Live Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
