import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { User, LogOut, Package, SlidersHorizontal, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold">Please sign in to view your account</h2>
        <p className="text-xs text-slate-500">Access your saved ratio curves and wholesale order history.</p>
        <Link to="/login" className="btn-primary text-xs py-2 px-4 inline-flex">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 pb-20 pt-4">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary text-white text-xl font-bold flex items-center justify-center shadow-md">
            {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {user.displayName || 'Wholesale Merchandiser'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {user.email}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-brand-primary dark:text-indigo-400 font-semibold pt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Commercial Partner
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="btn-secondary text-xs py-2 px-3 text-slate-600 hover:text-brand-accent flex items-center gap-1.5 self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Cart Summary
            </h3>
            <Package className="w-4 h-4 text-brand-primary" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {items.length} Selected Styles
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ready to configure size ratios and submit for production.
          </p>
          <Link
            to="/cart"
            className="text-xs font-semibold text-brand-primary hover:underline inline-flex items-center gap-1 pt-1"
          >
            Go to Cart <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ratio Management
            </h3>
            <SlidersHorizontal className="w-4 h-4 text-brand-accent" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Multi-Level Matrix
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure Grade A/B/C/D size curves at Brick, Category, or Neck/Sleeve level.
          </p>
          <Link
            to="/ratios"
            className="text-xs font-semibold text-brand-accent hover:underline inline-flex items-center gap-1 pt-1"
          >
            Open Ratio Planner <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
