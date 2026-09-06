import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { GRADES, GRADE_CONFIG } from '../constants/grades';
import Logo from '../components/common/Logo';
import {
  ShoppingBag,
  Trash2,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateItemGrade,
    updateItemSets,
    clearCart,
    openRatioModal,
    openOrderSummary,
    getTotals
  } = useCartStore();

  const navigate = useNavigate();
  const totals = getTotals();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 inline-flex items-center justify-center">
          <Logo size={56} />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Weave your style.
          </p>
        </div>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Add products with Grade A, B, or C from the catalogue to begin building your wholesale order and configuring size ratios.
        </p>
        <div className="pt-2">
          <Link to="/catalogue" className="btn-primary text-xs sm:text-sm py-2.5 px-6 shadow-sm">
            Browse Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 pb-24 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Wholesale Cart & Size Ratios
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {items.length} selected styles ({totals.totalSets} sets, {totals.totalUnits} calculated units)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={clearCart}
            className="btn-secondary text-xs py-2 px-3 text-slate-500 hover:text-brand-accent"
          >
            Clear Cart
          </button>
          <button
            onClick={openRatioModal}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-primary" />
            Set Ratio
          </button>
          <button
            onClick={openOrderSummary}
            className="btn-accent text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm"
          >
            Review Order <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Cart Line Items (Clean Flat Card Design) */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const ratiosSum = Object.values(item.sizeRatios || {}).reduce(
              (s, v) => s + Number(v || 0),
              0
            );
            const itemUnits = item.sets * (ratiosSum > 0 ? ratiosSum : 1);
            const itemTotal = itemUnits * item.mrp;
            const cfg = GRADE_CONFIG[item.grade] || GRADE_CONFIG.A;

            return (
              <div
                key={item.itemKey}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
              >
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80';
                    }}
                  />

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-semibold text-brand-primary dark:text-indigo-300">
                          {item.brand || 'Threadly'}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                          {item.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeItem(item.itemKey)}
                        className="text-slate-400 hover:text-brand-accent p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <span>{item.brick}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>₹{item.mrp?.toLocaleString('en-IN')} MRP/unit</span>
                    </div>

                    {/* Grade Selector Dropdown Pill */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Assigned Grade:
                      </span>
                      <select
                        value={item.grade}
                        onChange={(e) => updateItemGrade(item.itemKey, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${cfg.badgeBg}`}
                      >
                        {GRADES.map((g) => (
                          <option key={g} value={g} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                            Grade {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Size-wise Ratio Breakdown */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Size Allocation (Curve per Set):</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{ratiosSum} pieces/set</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(item.sizeRatios || {}).map(([sz, rVal]) => (
                      <span
                        key={sz}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        <strong className="font-bold text-slate-900 dark:text-slate-100">{sz}</strong>: {rVal} pcs
                        <span className="text-[10px] text-slate-400 ml-1">
                          ({item.sets * Number(rVal)} total)
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sets Stepper & Computed Item MRP */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Wholesale Sets:
                    </span>
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                      <button
                        onClick={() => updateItemSets(item.itemKey, item.sets - 1)}
                        className="px-3 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-slate-900 dark:text-slate-100 min-w-[2rem] text-center">
                        {item.sets}
                      </span>
                      <button
                        onClick={() => updateItemSets(item.itemKey, item.sets + 1)}
                        className="px-3 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">
                      {itemUnits} units total
                    </span>
                    <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Summary & Order Confirmation Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-2xs sticky top-24">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Commercial Order Summary
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aggregate unit totals across all grade size allocations.
            </p>
          </div>

          <div className="space-y-2.5 text-xs border-t border-b border-slate-100 dark:border-slate-800 py-3">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Selected Product Styles:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{items.length} styles</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Total Wholesale Sets:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{totals.totalSets} sets</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Total Units / Pieces:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{totals.totalUnits} pcs</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Standard Logistics:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">Calculated on dispatch</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100">
              <span>Grand Total MRP:</span>
              <span className="text-brand-accent text-base">
                ₹{totals.totalMRP.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={openOrderSummary}
              className="btn-accent w-full py-3 text-sm font-semibold tracking-wide shadow-md flex items-center justify-center gap-2"
            >
              Proceed to Order Breakdown <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={openRatioModal}
              className="btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-primary" />
              Adjust Size Ratios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
