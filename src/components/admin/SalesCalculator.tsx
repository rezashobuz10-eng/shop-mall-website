import React, { useState, useMemo } from 'react';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Save,
  Trash2,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Percent,
  Layers,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SavedLedgerEntry {
  id: string;
  date: string;
  itemName: string;
  costPrice: number;
  sellingPrice: number;
  units: number;
  totalCost: number;
  revenue: number;
  netProfit: number;
  marginPercent: number;
}

export const SalesCalculator: React.FC = () => {
  const { products, orders, addToast } = useStore();

  // Calculator Form State
  const [itemName, setItemName] = useState('Sports Equipment & Gym Gear Batch');
  const [costPrice, setCostPrice] = useState<number>(650);
  const [sellingPrice, setSellingPrice] = useState<number>(1200);
  const [unitsSold, setUnitsSold] = useState<number>(45);
  const [courierFee, setCourierFee] = useState<number>(60);
  const [adSpendPerUnit, setAdSpendPerUnit] = useState<number>(40);

  // Saved Ledger History
  const [savedEntries, setSavedEntries] = useState<SavedLedgerEntry[]>(() => {
    try {
      const stored = localStorage.getItem('sn_sales_ledger');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [
      {
        id: 'ledg-1',
        date: 'Today, 02:45 PM',
        itemName: 'Sports Dumbbell Set 10kg',
        costPrice: 850,
        sellingPrice: 1550,
        units: 32,
        totalCost: 30400,
        revenue: 49600,
        netProfit: 19200,
        marginPercent: 38.7
      },
      {
        id: 'ledg-2',
        date: 'Yesterday',
        itemName: 'Wireless Gaming Earbuds ANC',
        costPrice: 1100,
        sellingPrice: 2190,
        units: 24,
        totalCost: 28800,
        revenue: 52560,
        netProfit: 23760,
        marginPercent: 45.2
      }
    ];
  });

  // Calculate live numbers
  const grossRevenue = (sellingPrice || 0) * (unitsSold || 0);
  const unitTotalCost = (costPrice || 0) + (courierFee || 0) + (adSpendPerUnit || 0);
  const totalCost = unitTotalCost * (unitsSold || 0);
  const netProfit = grossRevenue - totalCost;
  const marginPercent = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100) : 0;
  const roiPercent = totalCost > 0 ? ((netProfit / totalCost) * 100) : 0;
  const netProfitPerUnit = unitsSold > 0 ? Math.round(netProfit / unitsSold) : 0;

  // Real store sales breakdown from actual orders + products
  const storeSalesAnalytics = useMemo(() => {
    // Calculate how many products sold from actual store orders
    const itemSalesMap = new Map<string, { title: string; image: string; count: number; revenue: number; stock: number }>();

    // Initial products soldCount
    products.forEach((p) => {
      itemSalesMap.set(p.id, {
        title: p.title,
        image: p.images[0] || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80',
        count: p.soldCount || 0,
        revenue: (p.soldCount || 0) * p.price,
        stock: p.stock
      });
    });

    // Add actual completed customer orders in the system
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const existing = itemSalesMap.get(item.productId);
        if (existing) {
          existing.count += item.quantity;
          existing.revenue += item.price * item.quantity;
        }
      });
    });

    const list = Array.from(itemSalesMap.entries()).map(([id, val]) => ({
      id,
      ...val
    }));

    list.sort((a, b) => b.count - a.count);

    const totalStoreUnitsSold = list.reduce((sum, item) => sum + item.count, 0);
    const totalStoreSalesRevenue = list.reduce((sum, item) => sum + item.revenue, 0);

    return {
      topSoldItems: list,
      totalStoreUnitsSold,
      totalStoreSalesRevenue
    };
  }, [products, orders]);

  // Handle saving to ledger
  const handleSaveCalculation = () => {
    if (!itemName.trim() || unitsSold <= 0) {
      addToast({
        type: 'warning',
        title: 'Invalid Calculation',
        message: 'Please enter item name and units sold.'
      });
      return;
    }

    const newEntry: SavedLedgerEntry = {
      id: 'ledg-' + Date.now(),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      itemName: itemName.trim(),
      costPrice,
      sellingPrice,
      units: unitsSold,
      totalCost,
      revenue: grossRevenue,
      netProfit,
      marginPercent: Math.round(marginPercent * 10) / 10
    };

    const updated = [newEntry, ...savedEntries];
    setSavedEntries(updated);
    localStorage.setItem('sn_sales_ledger', JSON.stringify(updated));

    addToast({
      type: 'success',
      title: 'Hishab Saved (হিসাব সংরক্ষিত)',
      message: `Profit of ৳${netProfit.toLocaleString()} logged in sales ledger.`
    });
  };

  const handleDeleteEntry = (id: string) => {
    const updated = savedEntries.filter((e) => e.id !== id);
    setSavedEntries(updated);
    localStorage.setItem('sn_sales_ledger', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear the sales ledger history?')) {
      setSavedEntries([]);
      localStorage.removeItem('sn_sales_ledger');
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Real Store Sales Ledger Summary (হিসেব রাখুন কত প্রোডাক্ট সেল হলো) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <TrendingUp className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-black text-slate-900">
                Product Sales Ledger (কত প্রোডাক্ট বিক্রি হলো তার লাইভ হিসাব)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time synchronization across completed customer orders, units dispatched, and gross collections
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-orange-50 border border-orange-200 text-right">
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                Total Units Sold (মোট বিক্রি)
              </span>
              <span className="text-xl font-black text-orange-700">
                {storeSalesAnalytics.totalStoreUnitsSold.toLocaleString()} Pieces
              </span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-right">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                Total Store Revenue (মোট বিক্রয় মূল্য)
              </span>
              <span className="text-xl font-black text-emerald-700">
                ৳{storeSalesAnalytics.totalStoreSalesRevenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Product-by-Product Sales Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 uppercase tracking-wider text-[10px] font-bold text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Units Sold (কয়টি বিক্রি হয়েছে)</th>
                <th className="py-3 px-4">Remaining Stock</th>
                <th className="py-3 px-4">Gross Collected (মোট টাকা)</th>
                <th className="py-3 px-4 text-right">Sales Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {storeSalesAnalytics.topSoldItems.slice(0, 10).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80';
                        }}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <span className="font-bold text-slate-900 line-clamp-1 max-w-sm">
                        {item.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-black text-sm text-slate-900">
                      {item.count.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-slate-400">pcs</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.stock > 10 ? 'bg-slate-100 text-slate-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {item.stock} left
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-emerald-700">
                      ৳{item.revenue.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {item.count > 150 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        🔥 Top Best-Seller
                      </span>
                    ) : item.count > 50 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        ⚡ High Velocity
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        Steady
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Interactive Profit & Margin Calculator (ইন্টারেক্টিভ লাভ ও মার্জিন ক্যালকুলেটর) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
          <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
            <Calculator className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Interactive Profit, Cost & Margin Calculator (লাভ ও খরচের ক্যালকুলেটর)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Input sourcing cost, selling price and quantity to instantly compute net profit and profit margin percentage
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Item / Product Batch Name (পণ্যের নাম বা ব্যাচ)
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Sports Equipment Batch #1"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Cost / Buying Price (ক্রয়মূল্য ৳) *
                </label>
                <input
                  type="number"
                  min={0}
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Selling Price (বিক্রয়মূল্য ৳) *
                </label>
                <input
                  type="number"
                  min={0}
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-orange-600 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Units Sold (বিক্রির সংখ্যা) *
                </label>
                <input
                  type="number"
                  min={1}
                  value={unitsSold}
                  onChange={(e) => setUnitsSold(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Packaging / Courier Fee per unit (ডেলিভারি খরচ ৳)
                </label>
                <input
                  type="number"
                  min={0}
                  value={courierFee}
                  onChange={(e) => setCourierFee(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Marketing & Ad Spend per unit (বিজ্ঞাপনী খরচ ৳)
                </label>
                <input
                  type="number"
                  min={0}
                  value={adSpendPerUnit}
                  onChange={(e) => setAdSpendPerUnit(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveCalculation}
              className="w-full py-3 mt-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save to Hishab Ledger (হিসাবে যুক্ত করুন)
            </button>
          </div>

          {/* Results Display Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Instant Profit Summary
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  Live Calculation
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Gross Sales Revenue:</span>
                  <span className="font-bold text-base text-white">
                    ৳{grossRevenue.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Sourcing & Op Cost:</span>
                  <span className="font-semibold text-rose-300">
                    ৳{totalCost.toLocaleString()}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Net Calculated Profit:</span>
                  <span
                    className={`font-black text-2xl ${
                      netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    ৳{netProfit.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">Margin</span>
                    <span className="text-sm font-black text-amber-400">
                      {marginPercent.toFixed(1)}%
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">ROI</span>
                    <span className="text-sm font-black text-sky-400">
                      {roiPercent.toFixed(1)}%
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">Per Unit</span>
                    <span className="text-sm font-black text-emerald-400">
                      ৳{netProfitPerUnit}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-4 text-center">
              Formula: Net Profit = (Selling Price × Qty) - (Cost + Fees + Ads) × Qty
            </p>
          </div>
        </div>
      </div>

      {/* 3. Saved Calculation History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              Saved Hishab Logs (সংরক্ষিত হিসেব খাতা)
            </h3>
            <p className="text-xs text-slate-500">
              Auditable records of previous profit margin calculations
            </p>
          </div>

          {savedEntries.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All Logs
            </button>
          )}
        </div>

        {savedEntries.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No saved calculation logs yet. Calculate and click "Save to Hishab Ledger" above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 uppercase tracking-wider text-[10px] font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Logged Time</th>
                  <th className="py-3 px-4">Batch / Product</th>
                  <th className="py-3 px-4">Units Sold</th>
                  <th className="py-3 px-4">Gross Revenue</th>
                  <th className="py-3 px-4">Total Cost</th>
                  <th className="py-3 px-4">Net Profit</th>
                  <th className="py-3 px-4">Margin %</th>
                  <th className="py-3 px-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {savedEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{entry.date}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{entry.itemName}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {entry.units} pcs
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ৳{entry.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-rose-600">
                      ৳{entry.totalCost.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-black text-emerald-600">
                      ৳{entry.netProfit.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {entry.marginPercent}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
