import React, { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { GRADE_CONFIG } from '../../constants/grades';
import { toast } from '../../store/toastStore';
import {
  X,
  ArrowLeft,
  CheckCircle2,
  Package,
  Layers,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OrderSummaryModal() {
  const {
    items,
    isOrderSummaryOpen,
    closeOrderSummary,
    openCartDrawer,
    clearCart,
    getTotals
  } = useCartStore();

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderReference, setOrderReference] = useState('');
  const navigate = useNavigate();

  if (!isOrderSummaryOpen) return null;

  const totals = getTotals();

  const handleConfirmOrder = () => {
    const ref = `TH-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderReference(ref);
    setOrderConfirmed(true);
    toast.success(`Wholesale order ${ref} placed successfully!`);
    clearCart();
  };

  const handleFinish = () => {
    setOrderConfirmed(false);
    closeOrderSummary();
    navigate('/catalogue');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={closeOrderSummary}
      />

      {/* Liquid Glass Modal Container */}
      <div className="relative z-10 w-full max-w-2xl my-6 liquid-glass-modal p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 border border-white/50 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-brand-accent">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Wholesale Order Summary
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verify grade-wise size allocations and total commercial units.
              </p>
            </div>
          </div>

          <button
            onClick={closeOrderSummary}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close summary modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderConfirmed ? (
          /* Confirmation Success View */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-brand-accent">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight">
                Order Placed Successfully!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Order Reference:{' '}
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                  {orderReference}
                </span>
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Your grade-wise size ratio specifications have been dispatched to manufacturing & logistics.
            </p>
            <div className="pt-4">
              <button onClick={handleFinish} className="btn-primary text-xs py-2.5 px-6">
                Back to Catalogue
              </button>
            </div>
          </div>
        ) : (
          /* Order Breakdown Content */
          <div className="space-y-4 py-4">
            {/* Grouped Line Items Breakdown */}
            <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
              {items.map((item) => {
                const ratiosSum = Object.values(item.sizeRatios || {}).reduce(
                  (sum, v) => sum + (Number(v) || 0),
                  0
                );
                const totalUnits = item.sets * (ratiosSum > 0 ? ratiosSum : 1);
                const itemTotal = totalUnits * item.mrp;
                const cfg = GRADE_CONFIG[item.grade] || GRADE_CONFIG.A;

                return (
                  <div
                    key={item.itemKey}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cfg.badgeBg}`}>
                          Grade {item.grade}
                        </span>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-xs">
                          {item.title}
                        </h4>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Size breakdown calculation */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{item.sets} Sets × {ratiosSum} pcs = <strong>{totalUnits} Units</strong></span>
                      <span>(</span>
                      {Object.entries(item.sizeRatios || {}).map(([sz, rVal], i) => (
                        <span key={sz}>
                          {i > 0 && ', '}
                          {sz}: {item.sets * Number(rVal)} pcs
                        </span>
                      ))}
                      <span>)</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Counters Summary Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Total Wholesale Sets:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{totals.totalSets} Sets</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Total Pieces / Units:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{totals.totalUnits} pcs</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Applicable GST Slab:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">Included in MRP (18%)</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                <span>Grand Commercial Total:</span>
                <span className="text-brand-accent text-base">
                  ₹{totals.totalMRP.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Actions: Confirm (Warm Coral) and Back */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  closeOrderSummary();
                  openCartDrawer();
                }}
                className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
              </button>

              <button
                type="button"
                onClick={handleConfirmOrder}
                className="btn-accent text-xs py-2.5 px-6 flex items-center gap-2 shadow-md font-semibold tracking-wide"
              >
                <ShoppingBag className="w-4 h-4" /> Place Wholesale Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
