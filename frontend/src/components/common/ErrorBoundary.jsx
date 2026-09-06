import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Logo from './Logo';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-slate-900 dark:text-slate-100">
          <div className="max-w-md w-full text-center space-y-5 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
            <div className="flex justify-center">
              <Logo size={44} />
            </div>
            <div className="w-12 h-12 mx-auto rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-brand-accent">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                We encountered an unexpected error while loading this section.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary w-full py-2.5"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Reload Threadly
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
