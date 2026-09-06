import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import useAuthStore from '../store/authStore';
import { toast } from '../store/toastStore';
import Wordmark from '../components/common/Wordmark';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { user } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in successfully!');
    } catch (err) {
      console.error('Google Sign In error:', err);
      setError(err.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back to Threadly!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!');
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password combination.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Try signing in.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Full-bleed fashion photography background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2000&q=85&auto=format&fit=crop')`,
        }}
      />

      {/* Tasteful dark overlay gradient — the single intentional gradient use in the application */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/65 to-slate-950/40 backdrop-blur-[2px]" />

      {/* Centered Liquid Glass Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-2xl border border-white/20 bg-white/75 dark:bg-slate-900/80 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.7)] text-slate-900 dark:text-slate-100">
        
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex justify-center">
            <Wordmark size="lg" withTagline={true} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            {isLogin
              ? 'Access wholesale catalogue and size-wise ratio planning.'
              : 'Create your merchandising profile to configure Grade ratios.'}
          </p>
        </div>

        {/* Inline Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-orange-500/10 border border-orange-500/25 text-brand-accent text-xs font-medium flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm font-semibold shadow-sm transition-all active:scale-98 mb-5"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="w-full border-t border-slate-200/80 dark:border-slate-800" />
          <span className="absolute px-3 bg-white/70 dark:bg-slate-900/70 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            or with email
          </span>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="buyer@threadly.com"
              required
              className="form-input text-sm"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="form-input text-sm"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 text-sm font-semibold tracking-wide"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isLogin ? 'Sign In to Threadly' : 'Create Account'}
          </button>
        </form>

        {/* Toggle between Sign In / Sign Up */}
        <div className="text-center pt-6 mt-6 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          {isLogin ? "Don't have a merchandising account? " : 'Already registered? '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="font-semibold text-brand-primary hover:underline ml-1"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>

        {/* Direct Guest Link to Catalogue */}
        <div className="text-center mt-3">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            Browse catalogue as guest <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
