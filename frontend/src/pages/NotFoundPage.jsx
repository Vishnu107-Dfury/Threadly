import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div className="flex justify-center">
          <Logo size={48} />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">
            404 Error
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The page or category you are looking for might have been moved or does not exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <Link to="/" className="btn-primary text-xs py-2 px-4 flex items-center justify-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <Link to="/catalogue" className="btn-secondary text-xs py-2 px-4 flex items-center justify-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5" /> View Catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}
