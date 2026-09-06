import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Heart,
  Eye,
  ShieldCheck,
  TrendingUp,
  Layers
} from 'lucide-react';

const HERO_SLIDES = [
  {
    title: 'Spring / Summer 2026 Collection',
    subtitle: 'High-density wholesale merchandising with precision grade-wise ratios.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=85&auto=format&fit=crop',
    brick: 'Dresses',
    cta: 'Explore Collection'
  },
  {
    title: 'Precision Size Ratio Allocation',
    subtitle: 'Configure separate size curves for Grade A, B, and C across any Brick or Category.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=85&auto=format&fit=crop',
    brick: 'Shirts',
    cta: 'Launch Ratio Planner'
  },
  {
    title: 'Tailored Men & Women Essentials',
    subtitle: 'From slim-fit trousers to premium cotton shirts, ready for immediate dispatch.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1600&q=85&auto=format&fit=crop',
    brick: 'Trousers',
    cta: 'Browse All Styles'
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bricks, setBricks] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { addToCart, setQuickViewProduct } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  useEffect(() => {
    // Autoplay hero carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [metaRes, prodRes] = await Promise.all([
          api.get('/products/meta'),
          api.get('/products?limit=8&sort=rating')
        ]);
        setBricks(metaRes.data.bricks || []);
        setTrendingProducts(prodRes.data.products || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Banner Carousel */}
      <section className="relative w-full h-[400px] sm:h-[460px] md:h-[500px] overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 mx-auto max-w-7xl shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
        </AnimatePresence>
        
        {/* Subtle dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent flex items-center" />

        <div className="relative z-10 h-full flex flex-col justify-center max-w-2xl px-6 sm:px-12 text-white space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                Featured Merchandising
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white drop-shadow-sm">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed font-normal max-w-lg drop-shadow-sm">
                {slide.subtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (currentSlide === 1) {
                      navigate('/ratios');
                    } else {
                      navigate(`/catalogue?brick=${encodeURIComponent(slide.brick)}`);
                    }
                  }}
                  className="btn-accent text-sm py-2.5 px-5 shadow-lg flex items-center gap-2"
                >
                  {slide.cta} <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/catalogue"
                    className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-sm font-semibold border border-white/30 transition-colors inline-block"
                  >
                    View All Catalogue
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Slide Indicators & Controls */}
        <div className="absolute bottom-5 right-6 z-10 flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <div className="flex gap-1.5 px-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === i ? 'w-6 bg-brand-accent' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </section>

      {/* 2. Dynamic Category Rail */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Explore dynamic apparel bricks curated from the dataset
            </p>
          </div>
        </div>

        <motion.div 
          className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {bricks.map((brick) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={brick}
              onClick={() => navigate(`/catalogue?brick=${encodeURIComponent(brick)}`)}
              className="group flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-primary dark:hover:border-brand-primary shadow-sm hover:shadow transition-all text-left"
            >
              <span className="w-2 h-2 rounded-full bg-brand-primary group-hover:bg-brand-accent transition-colors" />
              <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-brand-primary dark:group-hover:text-indigo-300 whitespace-nowrap">
                {brick}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* 3. Promotional Merchandising Strip */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6"
      >
        <div className="p-6 sm:p-8 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          {/* Background animation element */}
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -right-20 -top-20 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"
          />

          <div className="space-y-2 text-center md:text-left max-w-xl relative z-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary dark:text-indigo-300 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              Grade-Wise Ratio Engine
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              Set Custom Size Ratios for Grades A, B & C
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Configure tailored size allocation curves at the Brick, Category, or Neck/Sleeve level. Automatically compute units per set across all styles.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10 w-full md:w-auto">
            <Link to="/ratios" className="btn-accent text-sm py-2.5 px-5 shadow-sm w-full sm:w-auto text-center flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 mr-1.5" />
              Open Planner
            </Link>
            <Link to="/catalogue" className="btn-secondary text-sm py-2.5 px-4 w-full sm:w-auto text-center">
              Explore Products
            </Link>
          </div>
        </div>
      </motion.section>

      {/* 4. Trending / New Arrivals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-brand-primary">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Trending Catalogue Styles
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Top rated styles dynamically pulled from the dataset
              </p>
            </div>
          </div>
          <Link
            to="/catalogue"
            className="text-xs sm:text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            All styles <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 animate-pulse">
                <div className="w-full aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
          >
            {trendingProducts.map((p) => {
              const wishlisted = isWishlisted(p._id || p.style_code);

              return (
                <motion.div
                  variants={itemVariants}
                  key={p._id || p.style_code}
                  className="group product-card overflow-hidden flex flex-col justify-between"
                >
                  {/* Card Image Area */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                         e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80';
                      }}
                    />

                    {/* Wishlist Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p);
                      }}
                      className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 p-1.5 sm:p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-brand-accent shadow-sm backdrop-blur-sm transition-all"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlisted ? 'fill-brand-accent text-brand-accent' : ''}`}
                      />
                    </motion.button>

                    {/* Brick Badge */}
                    <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-[9px] sm:text-[10px] font-semibold text-white tracking-wide">
                      {p.brick}
                    </div>

                    {/* Quick View Button Hover Overlay */}
                    <div className="absolute inset-x-0 bottom-2 px-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:flex items-center gap-2">
                      <button
                        onClick={() => setQuickViewProduct(p)}
                        className="w-full py-2 rounded-lg bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 text-xs font-bold shadow-md flex items-center justify-center gap-1.5 hover:bg-brand-primary hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Quick View
                      </button>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <span className="font-medium text-slate-600 dark:text-slate-300 truncate">
                          {p.brand || 'Threadly'}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-500" />
                          <span className="font-bold">{p.rating || 4.5}</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => setQuickViewProduct(p)}
                        className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 sm:line-clamp-2 cursor-pointer hover:text-brand-primary transition-colors leading-tight"
                        title={p.title}
                      >
                        {p.title}
                      </h3>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="pt-2 flex items-end justify-between border-t border-slate-100 dark:border-slate-800/60 mt-2">
                      <div>
                        <span className="text-sm sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-none block">
                          ₹{p.mrp?.toLocaleString('en-IN') || 1999}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-slate-400">Retail / Unit</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addToCart(p, { size: p.sizes?.[0] || 'M', sets: 1 })}
                        className="btn-accent py-1.5 px-2.5 sm:py-2 sm:px-3 text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center shrink-0"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* 5. Trust / Merchandising Highlights Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-center sm:text-left">
          <motion.div whileHover={{ y: -5 }} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-3 transition-shadow hover:shadow-md">
            <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-brand-primary shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-0.5">
                Verified Quality
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Guaranteed authentic merchandise directly from manufacturers.
              </p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-3 transition-shadow hover:shadow-md">
            <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/50 text-brand-accent shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-0.5">
                AI Driven Discovery
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Intelligent recommendations and dynamic catalogue sorting.
              </p>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-3 transition-shadow hover:shadow-md">
            <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-brand-primary shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-0.5">
                Retail & Wholesale
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Buy individual pieces or configure massive wholesale grade sets.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
