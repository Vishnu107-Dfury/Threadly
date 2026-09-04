import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import useAuthStore from '../store/authStore';

const LoginPage = () => {
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <div className="relative z-10 p-12 max-w-lg">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Catalogue & Ratio Management</h1>
          <p className="text-muted text-lg">
            A premium, modern platform to seamlessly browse your extensive catalogue, 
            build carts, and precisely configure grade-wise size ratios.
          </p>
          <div className="mt-12 flex gap-4 opacity-50">
            <span className="material-symbols-rounded text-6xl">inventory_2</span>
            <span className="material-symbols-rounded text-6xl">shopping_cart</span>
            <span className="material-symbols-rounded text-6xl">tune</span>
          </div>
        </div>
      </div>

      {/* Right side Auth */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md glass-panel p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-muted text-sm">
              {isLogin ? 'Enter your credentials to access your catalogue.' : 'Sign up to start configuring ratios.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
              <span className="material-symbols-rounded text-sm">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field" 
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field" 
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary w-full flex justify-center items-center gap-2"
              disabled={loading}
            >
              {loading ? <span className="material-symbols-rounded animate-spin">progress_activity</span> : null}
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface-glass text-muted">Or continue with</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn-secondary w-full flex items-center justify-center gap-3 mb-6"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Google
          </button>

          <p className="text-center text-sm text-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
