import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { GRADES, GRADE_CONFIG } from '../../constants/grades';
import Logo from '../common/Logo';
import {
  X,
  Trash2,
  SlidersHorizontal,
  ArrowRight,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    removeItem,
    updateItemGrade,
    updateItemSets,
    openRatioModal,
    openOrderSummary,
    getTotals
  } = useCartStore();

  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const totals = getTotals();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dim backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={closeCartDrawer}
      />

      {/* Liquid Glass Drawer Container */}
      <div className="relative z-10 w-full max-w-md h-full liquid-glass-drawer flex flex-col justify-between bg-white/85 dark:bg-slate-900/85 border-l border-white/40 dark:border-slate-800 text-slate-900 dark:text-slate-100 animate-in slide-in-from-right duration-250">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-primary" />
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              Wholesale Cart ({items.length})
            </h2>
          </div>
          <button
            onClick={closeCartDrawer}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Line Items or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center">
                <Logo size={48} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Your cart is empty
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Weave your style.
                </p>
              </div>
              <button
                onClick={() => {
                  closeCartDrawer();
                  navigate('/catalogue');
                }}
                className="btn-primary text-xs py-2 px-4 shadow-sm"
              >
                Browse Catalogue
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Ratio Planner Prompt Banner */}
              <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-brand-primary dark:text-indigo-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-accent" />
                    Configure Ratios
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Set separate size curves for Grade A, B & C
                  </p>
                </div>
                <button
                  onClick={() => openRatioModal()}
                  className="btn-primary text-xs py-1 px-2.5 shrink-0"
                >
                  <SlidersHorizontal className="w-3 h-3 mr-1" />
                  Set Ratio
                </button>
              </div>

              {/* Items List */}
              {items.map((item) => {
                const ratiosSum = Object.values(item.sizeRatios || {}).reduce(
                  (sum, v) => sum + (Number(v) || 0),
                  0
                );
                const totalItemUnits = item.sets * (ratiosSum > 0 ? ratiosSum : 1);
                const itemTotalPrice = totalItemUnits * item.mrp;

                return (
                  <div
                    key={item.itemKey}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3"
                  >
                    {/* Item Top Row */}
                    <div className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-20 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80';
                        }}
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => removeItem(item.itemKey)}
                            className="text-slate-400 hover:text-brand-accent p-0.5 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <span>{item.brick}</span>
                          <span>•</span>
                          <span>₹{item.mrp?.toLocaleString('en-IN')} / unit</span>
                        </div>

                        {/* Grade Dropdown Pill */}
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-[10px] text-slate-400 font-medium">Grade:</span>
                          <select
                            value={item.grade}
                            onChange={(e) => updateItemGrade(item.itemKey, e.target.value)}
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md border cursor-pointer ${
                              GRADE_CONFIG[item.grade]?.badgeBg || 'bg-slate-100 text-slate-800'
                            }`}
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

                    {/* Size-wise Ratio Breakdown Chips */}
                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>Size Distribution (per set):</span>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          {ratiosSum} pcs/set
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(item.sizeRatios || {})
                          .filter(([, ratioVal]) => Number(ratioVal) > 0)
                          .map(([sizeKey, ratioVal]) => (
                          <span
                            key={sizeKey}
                            className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                          >
                            <strong className="font-bold text-slate-900 dark:text-slate-100">{sizeKey}</strong>: {ratioVal}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Sets Stepper and Total Units */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Sets:</span>
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                          <button
                            onClick={() => updateItemSets(item.itemKey, item.sets - 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-bold text-slate-900 dark:text-slate-100 min-w-[1.5rem] text-center">
                            {item.sets}
                          </span>
                          <button
                            onClick={() => updateItemSets(item.itemKey, item.sets + 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">
                          {totalItemUnits} units total
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          ₹{itemTotalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer: Live Totals and Checkout Actions */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Total Wholesale Sets:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{totals.totalSets}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Total Units Calculated:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{totals.totalUnits} pcs</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1 border-t border-slate-200/60 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                <span>Total Commercial Value:</span>
                <span className="text-brand-primary dark:text-indigo-400">
                  ₹{totals.totalMRP.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => openRatioModal()}
                className="btn-secondary text-xs py-2.5 px-3 flex items-center justify-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Set Ratio
              </button>

              <button
                onClick={() => {
                  closeCartDrawer();
                  openOrderSummary();
                }}
                className="btn-accent text-xs py-2.5 px-3 flex items-center justify-center gap-1.5 shadow-md"
              >
                Order Summary <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
