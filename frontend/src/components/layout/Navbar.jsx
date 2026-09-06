import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Wordmark from '../common/Wordmark';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Heart,
  SlidersHorizontal,
  Sun,
  Moon,
  User,
  LogOut,
  X,
  Menu
} from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpenMobile, setSearchOpenMobile] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { items, openCartDrawer } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const totalCartCount = items.reduce((acc, i) => acc + i.sets, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpenMobile(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpenMobile(false);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 liquid-glass-nav ${
        scrolled ? 'scrolled py-2' : 'py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand Wordmark */}
        <Link to="/" className="flex items-center group transition-transform active:scale-95 shrink-0">
          <Wordmark size="default" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive('/')
                ? 'text-brand-primary bg-indigo-50/70 dark:bg-indigo-950/40 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            to="/catalogue"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive('/catalogue')
                ? 'text-brand-primary bg-indigo-50/70 dark:bg-indigo-950/40 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Catalogue
          </Link>
          <Link
            to="/ratios"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/ratios')
                ? 'text-brand-primary bg-indigo-50/70 dark:bg-indigo-950/40 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Ratio Planner
          </Link>
        </nav>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-sm relative items-center"
        >
          <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search styles, bricks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm rounded-full bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Action Controls - Fixed Single Line on Mobile */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => { setSearchOpenMobile(!searchOpenMobile); setMobileMenuOpen(false); }}
            className="md:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
            aria-label="Toggle Search"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Theme Toggle — hidden on xs, visible sm+ */}
          <button
            onClick={toggleTheme}
            className="hidden sm:flex p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Toggle Color Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Wishlist — hidden on mobile, show sm+ */}
          <Link
            to="/catalogue?wishlist=true"
            className="relative hidden sm:flex p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCartDrawer}
            className="relative flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-brand-primary dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60 text-sm font-semibold transition-all shrink-0"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Cart</span>
            {totalCartCount > 0 && (
              <span className="px-1.5 py-0.5 bg-brand-accent text-white text-[11px] font-bold rounded-full min-w-[1.25rem] text-center leading-none">
                {totalCartCount}
              </span>
            )}
          </motion.button>

          {/* User Account / Sign In */}
          <div className="relative shrink-0 flex items-center">
            {user ? (
              <button
                onClick={() => { setUserMenuOpen(!userMenuOpen); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-brand-primary text-white text-xs font-semibold flex items-center justify-center">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
              </button>
            ) : (
              <Link
                to="/login"
                className="btn-primary text-[11px] sm:text-xs py-1.5 px-2 sm:px-3 ml-1"
              >
                Sign In
              </Link>
            )}

            <AnimatePresence>
              {user && userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-10 mt-2 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/account"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Account & Profile
                  </Link>
                  <Link
                    to="/ratios"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    Saved Ratios
                  </Link>
                  <button
                    onClick={() => { setUserMenuOpen(false); logout(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-brand-accent hover:bg-orange-50 dark:hover:bg-orange-950/30 text-left border-t border-slate-100 dark:border-slate-800 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setSearchOpenMobile(false); setUserMenuOpen(false); }}
            className="md:hidden p-1.5 ml-1 border border-transparent rounded-lg text-slate-600 dark:text-slate-300 focus:border-slate-200 dark:focus:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
            aria-label="Toggle Menu"
          >
            <motion.div animate={{ rotate: mobileMenuOpen ? 90 : 0 }}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar - Animated */}
      <AnimatePresence>
        {searchOpenMobile && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden px-4 pt-2 pb-3 border-t border-slate-200/50 dark:border-slate-800"
          >
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search styles, categories, bricks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                autoFocus
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Drawer - Animated */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute w-full border-t border-slate-200/50 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-xl"
          >
            <nav className="px-4 py-3 flex flex-col gap-1">
              <Link
                to="/"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-brand-primary bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                Home
              </Link>
              <Link
                to="/catalogue"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/catalogue') ? 'text-brand-primary bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                Catalogue
              </Link>
              <Link
                to="/ratios"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/ratios') ? 'text-brand-primary bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Ratio Planner
              </Link>
              <Link
                to="/catalogue?wishlist=true"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Heart className="w-4 h-4" />
                Wishlist {wishlistCount > 0 && <span className="ml-auto text-xs bg-brand-primary text-white rounded-full px-1.5 py-0.5">{wishlistCount}</span>}
              </Link>
              <div className="flex items-center justify-between px-3 py-2.5 mt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
