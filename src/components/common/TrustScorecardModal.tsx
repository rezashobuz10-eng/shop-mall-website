import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Award,
  Truck,
  Headphones,
  CheckCircle2,
  Lock,
  ThumbsUp,
  Sparkles,
  Heart,
  MessageSquareQuote
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const TrustScorecardModal: React.FC = () => {
  const { isTrustScorecardOpen, setIsTrustScorecardOpen, addToast } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');

  const [userRating, setUserRating] = useState(10);
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isTrustScorecardOpen) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setSubmitted(true);
    addToast({
      type: 'success',
      title: 'ধন্যবাদ আপনার ১০/১০ রেটিংয়ের জন্য! ⭐',
      message: 'আপনার মূল্যবান মতামত শপনেক্সা প্ল্যাটফর্মে যুক্ত হয়েছে।'
    });
    setTimeout(() => {
      setSubmitted(false);
      setReviewText('');
      setReviewName('');
    }, 2500);
  };

  const METRICS = [
    {
      title: 'Product Authenticity (আসল পণ্য গ্যারান্টি)',
      score: '10 / 10',
      percentage: 100,
      desc: '১০০% জেনুইন ব্র্যান্ডের অথেন্টিক পণ্য বা দ্বিগুণ টাকা ফেরত',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      barColor: 'bg-emerald-500'
    },
    {
      title: 'On-Time Fast Delivery (দ্রুত ডেলিভারি)',
      score: '9.9 / 10',
      percentage: 99,
      desc: 'Steadfast ও Pathao লজিস্টিকসে ২৪-৪৮ ঘণ্টায় সারাদেশে হোম ডেলিভারি',
      icon: Truck,
      color: 'text-blue-600',
      barColor: 'bg-blue-500'
    },
    {
      title: 'Payment & MFS Security (নিরাপদ পেমেন্ট)',
      score: '10 / 10',
      percentage: 100,
      desc: 'বিকাশ TrxID ভেরিফিকেশন, ক্যাশ অন ডেলিভারি ও 3D সিকিউর গেটওয়ে',
      icon: Lock,
      color: 'text-pink-600',
      barColor: 'bg-pink-500'
    },
    {
      title: 'Customer Service (২৪/৭ গ্রাহক সেবা)',
      score: '9.9 / 10',
      percentage: 99,
      desc: '২৪ ঘণ্টা বাংলা ও ইংরেজিতে সার্বক্ষণিক লাইভ চ্যাট ও ফোন কল সমাধান',
      icon: Headphones,
      color: 'text-purple-600',
      barColor: 'bg-purple-500'
    },
    {
      title: '7-Day Return & Replacement (সহজ রিটার্ন)',
      score: '9.8 / 10',
      percentage: 98,
      desc: 'পণ্য পছন্দ না হলে বা ত্রুটি থাকলে ৭ দিনের মধ্যে ক্যাশ রিফান্ড',
      icon: Award,
      color: 'text-amber-600',
      barColor: 'bg-amber-500'
    }
  ];

  const CUSTOMER_TESTIMONIALS = [
    {
      name: 'Tanvir Ahmed (ধানমন্ডি, ঢাকা)',
      rating: 10,
      comment: '১০ এ ১০ রেটিং দেওয়ার মতো ওয়েবসাইট! বিকাশ পেমেন্ট করার পর মাত্র ২৪ ঘণ্টায় পণ্য হাতে পেয়েছি। কোয়ালিটি ১০০% অরিজিনাল।',
      date: 'আজকে ভেরিফাইড অর্ডার'
    },
    {
      name: 'Nusrat Jahan (পাঁচলাইশ, চট্টগ্রাম)',
      rating: 10,
      comment: 'খুবই নির্ভরযোগ্য সার্ভিস। প্যাকেজিং ছিল চমৎকার ৩-লেয়ার বাবল র‍্যাপ করা। এর আগে রিটার্ন করেছিলাম খুব সহজেই টাকা রিফান্ড পেয়েছি।',
      date: 'গতকাল ভেরিফাইড অর্ডার'
    },
    {
      name: 'Md. Kamrul Hasan (উত্তরা, ঢাকা)',
      rating: 10,
      comment: 'যেকোনো প্রশ্নের তাৎক্ষণিক লাইভ চ্যাট সমাধান পেয়েছি। বিকাশ TrxID অপশনটা একদম সিম্পল আর সহজ। ৫ এ ৫ বা ১০ এ ১০ এর যোগ্য!',
      date: '২ দিন আগে ভেরিফাইড অর্ডার'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 max-h-[92vh]">
        {/* Header with 10/10 Golden Badge */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white text-center relative select-none">
          <button
            type="button"
            onClick={() => setIsTrustScorecardOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Buyer Protection & Trust Badge</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            ১০ এ ১০ রেটিং প্ল্যাটফর্ম (10/10 Trust Score)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg mx-auto leading-relaxed">
            ১২,৫০০+ ভেরিফাইড গ্রাহকের ৯৯.৬% ইতিবাচক রিভিউ এবং বাংলাদেশ ই-কমার্স ট্রাস্ট সিল দ্বারা স্বীকৃত।
          </p>

          {/* Big Scorecard Banner */}
          <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-around">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-amber-400 flex items-center justify-center gap-1">
                <span>10</span>
                <span className="text-xl text-white/60">/10</span>
              </div>
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">
                কাস্টমার ট্রাস্ট স্কোর
              </div>
            </div>

            <div className="h-10 w-px bg-white/20" />

            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">99.6%</div>
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">
                ইতিবাচক সন্তুষ্টি
              </div>
            </div>

            <div className="h-10 w-px bg-white/20" />

            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-blue-400">12.5k+</div>
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">
                ভেরিফাইড অর্ডার
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 font-bold text-xs cursor-pointer border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            সার্ভিস স্কোরকার্ড (Service Metrics)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-4 font-bold text-xs cursor-pointer border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            গ্রাহক মতামত ও আপনার রিভিউ (Leave 10/10 Review)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'overview' ? (
            <div className="space-y-4">
              <div className="space-y-3">
                {METRICS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-xl bg-white shadow-2xs ${item.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-xs text-slate-900">{item.title}</span>
                        </div>
                        <span className="text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                          {item.score}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.barColor} rounded-full transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Guarantees Box */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-black text-sm">ShopNexa 10/10 Buyer Protection承诺</div>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    আপনার প্রতিটি অর্ডার সুরক্ষিত। পণ্যের যেকোনো সমস্যা বা অসন্তুষ্টিতে সরাসরি আমাদের সাপোর্ট টিম অথবা অ্যাডমিন পোর্টালে যোগাযোগ করলে ২৪ ঘণ্টার মধ্যে সমাধান নিশ্চিত করা হয়।
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Review Submission Form */}
              <form
                onSubmit={handleSubmitReview}
                className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-orange-950">
                    আপনার ১০ এ ১০ রেটিং ও মতামত প্রদান করুন:
                  </span>
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-orange-200 text-xs font-black text-orange-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{userRating} / 10 Rating</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 justify-center py-1 bg-white rounded-xl border border-orange-200">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setUserRating(val)}
                      className={`w-7 h-7 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        userRating >= val
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="আপনার নাম বা ঠিকানা (ঐচ্ছিক)"
                    className="p-2 bg-white rounded-xl border border-orange-200 text-xs text-slate-900 outline-hidden"
                  />
                  <input
                    type="text"
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="আপনার অভিজ্ঞতা কেমন ছিল? লিখুন..."
                    className="p-2 bg-white rounded-xl border border-orange-200 text-xs text-slate-900 outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-emerald-600"
                >
                  {submitted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>রেটিং গ্রহণ করা হয়েছে! ধন্যবাদ</span>
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Submit 10/10 Review Now</span>
                    </>
                  )}
                </button>
              </form>

              {/* Verified Customer Quotes */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  সাম্প্রতিক গ্রাহক মূল্যায়ন
                </div>

                {CUSTOMER_TESTIMONIALS.map((review, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{review.name}</span>
                      <div className="flex items-center gap-1 text-[11px] font-black text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{review.rating}/10 Score</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{review.comment}"
                    </p>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="text-[11px] font-bold">সারাদেশে বিশ্বস্ততার সাথে সেবা প্রদানে প্রতিশ্রুতিবদ্ধ</span>
          <button
            type="button"
            onClick={() => setIsTrustScorecardOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
