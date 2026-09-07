import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Store,
  CheckCircle2,
  Star,
  Users,
  MessageSquare,
  Search,
  ChevronRight,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';

export const SellerStorePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { sellers, products, addToast } = useStore();

  const seller = sellers.find((s) => s.id === id) || sellers[0];

  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(seller?.followers || 12000);
  const [searchFilter, setSearchFilter] = useState('');
  const [storeTab, setStoreTab] = useState<'all' | 'popular' | 'flash'>('all');

  if (!seller) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Store Not Found</h2>
        <Link to="/" className="text-orange-600 font-bold hover:underline">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowerCount((prev) => prev - 1);
      addToast({
        type: 'info',
        title: 'Unfollowed',
        message: `You will no longer receive alerts from ${seller.name}.`
      });
    } else {
      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
      addToast({
        type: 'success',
        title: 'Following ' + seller.name,
        message: 'You will now receive exclusive store vouchers and product launches.'
      });
    }
  };

  // Products belonging to this seller
  const sellerProducts = products.filter((p) => p.sellerId === seller.id);

  const displayedProducts = sellerProducts.filter((p) => {
    if (searchFilter && !p.title.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
    if (storeTab === 'flash' && !p.isFlashSale) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 overflow-hidden bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900">
        <img
          src={seller.banner}
          alt={seller.name}
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Store Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <img
              src={seller.logo}
              alt={seller.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-md"
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{seller.name}</h1>
                {seller.isVerified && (
                  <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{seller.description}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 mt-3 font-semibold">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {seller.rating} / 5.0 Rating
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-700">
                  <Users className="w-3.5 h-3.5" />
                  {followerCount.toLocaleString()} Followers
                </span>
                <span className="text-slate-300">•</span>
                <span>{seller.responseRate}% Response Rate</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600">● Verified Merchant</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleFollowToggle}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
                isFollowing
                  ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  : 'bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-600/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFollowing ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isFollowing ? 'Following' : 'Follow Store'}</span>
            </button>

            <button
              onClick={() => {
                addToast({
                  type: 'info',
                  title: 'Chat Initiated',
                  message: `Connecting with merchant agent at ${seller.name}...`
                });
              }}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
          </div>
        </div>

        {/* Store Tabs & Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Store Items' },
              { id: 'popular', label: 'Top Sellers' },
              { id: 'flash', label: 'Flash Deals' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStoreTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  storeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search inside store */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={`Search in ${seller.name}...`}
              className="w-full px-3.5 py-2 pl-9 bg-white border border-slate-200 rounded-xl text-xs outline-hidden focus:border-orange-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Product Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 text-sm">No items found matching your search in this store.</p>
          </div>
        )}
      </div>
    </div>
  );
};
