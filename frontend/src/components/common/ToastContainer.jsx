import React from 'react';
import { useToastStore } from '../../store/toastStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <aside aria-label="Notifications" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';

        return (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg text-sm font-medium transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 ${
              isSuccess
                ? 'bg-slate-900 text-white border-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:border-white'
                : isError
                ? 'bg-slate-900 text-white border-brand-accent dark:bg-slate-950 dark:text-white dark:border-brand-accent'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />}

            <div className="flex-1 leading-snug">{t.message}</div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white dark:hover:text-slate-900 transition-colors p-0.5"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </aside>
  );
}
