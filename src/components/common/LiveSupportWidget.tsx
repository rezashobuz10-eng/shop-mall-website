import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  User,
  Bot,
  Truck,
  CreditCard,
  RefreshCw,
  Gift,
  HelpCircle,
  Minimize2,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export const LiveSupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'agent',
      text: 'আসসালামু আলাইকুম! 👋 আমি নাদিয়া, ShopNexa কাস্টমার সাপোর্ট এবং শপিং অ্যাসিস্ট্যান্ট। আমি কীভাবে আপনাকে সাহায্য করতে পারি?',
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { cart, cartTotal, appliedCoupon } = useStore();

  const playTone = () => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // AudioContext unavailable or blocked by browser gesture
    }
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const quickPrompts = [
    { label: '🚚 ডেলিভারি চার্জ কত?', text: 'ডেলিভারি চার্জ এবং সময় সম্পর্কে জানতে চাই।' },
    { label: '💳 পেমেন্ট পদ্ধতি', text: 'কীভাবে বিকাশ বা নগদে পেমেন্ট করব?' },
    { label: '🎟️ ডিসকাউন্ট কুপন', text: 'কোন কুপন কোড আছে কি ডিসকাউন্টের জন্য?' },
    { label: '🔄 রিটার্ন পলিসি', text: 'প্রোডাক্ট পছন্দ না হলে কীভাবে রিটার্ন করব?' }
  ];

  const generateBotReply = (userQuery: string): string => {
    const q = userQuery.toLowerCase();

    if (q.includes('ডেলিভারি') || q.includes('চার্জ') || q.includes('delivery') || q.includes('shipping')) {
      return `📦 **ডেলিভারি চার্জ ও সময়সূচী:**\n\n• **ঢাকা সিটির ভেতরে:** মাত্র ৬০ টাকা (২-৩ কার্যদিবস)\n• **ঢাকার বাইরে ও সমগ্র বাংলাদেশ:** ১২০ টাকা (৩-৪ কার্যদিবস)\n• **এক্সপ্রেস ডেলিভারি:** অতিরিক্ত ৬০ টাকায় ২৪ ঘণ্টার মধ্যে হোম ডেলিভারি।\n\n🎉 **স্পেশাল অফার:** ৮০০ টাকার বেশি অর্ডারে অথবা **FREESHIP** কুপন ব্যবহার করলে স্ট্যান্ডার্ড ডেলিভারি একদম ফ্রি!`;
    }

    if (q.includes('পেমেন্ট') || q.includes('বিকাশ') || q.includes('নগদ') || q.includes('payment') || q.includes('bkash') || q.includes('nagad') || q.includes('cod')) {
      return `💳 **পেমেন্ট অপশনসমূহ:**\n\n১. **ক্যাশ অন ডেলিভারি (COD):** পার্সেল হাতে পেয়ে চেক করে টাকা দিন।\n২. **bKash, Nagad ও Rocket:** চেকআউটে সরাসরি ওটিপি ও পিন দিয়ে ইন্সট্যান্ট ডিজিটাল পেমেন্ট সুবিধা।\n৩. **Visa / Mastercard:** যেকোনো ব্যাংকের ডেবিট বা ক্রেডিট কার্ড সাপোর্টেড।\n\nসকল লেনদেন বাংলাদেশ ব্যাংক অনুমোদিত ও ২৫৬-বিট এনক্রিপ্টেড।`;
    }

    if (q.includes('কুপন') || q.includes('ডিসকাউন্ট') || q.includes('coupon') || q.includes('voucher') || q.includes('offer')) {
      return `🎟️ **বর্তমান স্পেশাল কুপন কোডসমূহ:**\n\n• **SHOPNEXA100** - ১০০০ টাকার অর্ডারে ১০০ টাকা ফ্ল্যাট ছাড়\n• **EID2026** - যেকোনো ক্রয়ে ১৫% মেগা ডিসকাউন্ট\n• **FREESHIP** - সারা বাংলাদেশে ফ্রি ডেলিভারি\n• **TECH10** - গ্যাজেট ও অ্যাক্সেসরিজে ১০% ছাড়\n\nচেকআউট বা কার্ট পেজে কুপন কোডটি টাইপ করে 'Apply' বাটনে ক্লিক করলেই ছাড় পেয়ে যাবেন!`;
    }

    if (q.includes('রিটার্ন') || q.includes('রিফান্ড') || q.includes('return') || q.includes('refund')) {
      return `🔄 **৭ দিনের সহজ রিটার্ন ও রিফান্ড পলিসি:**\n\nপ্রোডাক্টে কোনো ত্রুটি থাকলে অথবা ছবির সাথে মিল না থাকলে ডেলিভারির ৭ দিনের মধ্যে বিনামূল্যে রিটার্ন করতে পারবেন। আমরা ৩ কর্মদিবসের মধ্যে আপনার বিকাশ বা ব্যাংক অ্যাকাউন্টে সম্পূর্ণ টাকা রিফান্ড প্রদান করি।`;
    }

    if (q.includes('কার্ট') || q.includes('cart') || q.includes('order') || q.includes('অর্ডার')) {
      return `🛒 আপনার বর্তমান কার্টে **${cart.length}টি প্রোডাক্ট** রয়েছে (মোট মূল্য: ৳${cartTotal.toLocaleString()})।\n\nঅর্ডার সম্পন্ন করতে সরাসরি কার্ট অথবা চেকআউট পেজে যেতে পারেন। কোনো আইটেম নিয়ে বিস্তারিত জানতে চাইলে জিজ্ঞেস করতে পারেন!`;
    }

    return `ধন্যবাদ আপনার বার্তার জন্য! 😊 ShopNexa-তে আপনার কেনাকাটা নিরাপদ ও আনন্দদায়ক করাই আমাদের লক্ষ্য। আপনি যেকোনো প্রোডাক্ট স্পেসিফিকেশন, অর্ডার ট্র্যাকিং, পেমেন্ট বা কুপন সংক্রান্ত যেকোনো তথ্য জানতে এখানে মেসেজ করতে পারেন।`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    playTone();
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: generateBotReply(text),
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, botMsg]);
      playTone();
    }, 800);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 hover:bg-orange-600 text-white shadow-xl shadow-slate-950/20 border-2 border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer"
          aria-label="Open Live Support"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-orange-400 group-hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-black tracking-wide leading-tight">Live Support</span>
            <span className="block text-[10px] text-orange-300 group-hover:text-orange-100 font-medium leading-none">
              Online • কাস্টমার হেল্প
            </span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] max-h-[85vh] animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-inner">
                  N
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
              </div>
              <div>
                <h3 className="font-black text-xs sm:text-sm flex items-center gap-1.5">
                  <span>Nadia (ShopNexa Agent)</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">সাধারণত ১ মিনিটের মধ্যে উত্তর দেওয়া হয়</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-7 h-7 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-tr-xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-orange-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-xs">
                <div className="w-7 h-7 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 p-2.5 rounded-2xl flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p.text)}
                className="whitespace-nowrap px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer border border-slate-200/60 shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="একটি প্রশ্ন লিখুন..."
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-orange-500 text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-slate-200 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
