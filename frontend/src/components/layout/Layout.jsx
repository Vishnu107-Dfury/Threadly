import React from 'react';
import Navbar from './Navbar';
import Wordmark from '../common/Wordmark';
import CartDrawer from '../cart/CartDrawer';
import ProductDetailModal from '../catalogue/ProductDetailModal';
import InputRatioModal from '../ratio/InputRatioModal';
import OrderSummaryModal from '../cart/OrderSummaryModal';
import ToastContainer from '../common/ToastContainer';
import { Link } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Sticky Liquid Glass Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-4 sm:pt-6">
        {children}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <Wordmark size="sm" withTagline={true} />
            <p className="text-[11px] text-slate-400 mt-1">
              Wholesale apparel catalogue & size-ratio merchandising platform.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <Link to="/catalogue" className="hover:text-brand-primary transition-colors">Catalogue</Link>
            <Link to="/ratios" className="hover:text-brand-primary transition-colors">Ratio Planner</Link>
            <Link to="/cart" className="hover:text-brand-primary transition-colors">Cart</Link>
          </div>

          <div className="text-[11px] text-slate-400 text-center sm:text-right">
            © {new Date().getFullYear()} Threadly Inc. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Global Drawers, Modals & Toast Notifications (Liquid Glass surfaces) */}
      <CartDrawer />
      <ProductDetailModal />
      <InputRatioModal />
      <OrderSummaryModal />
      <ToastContainer />
    </div>
  );
}
