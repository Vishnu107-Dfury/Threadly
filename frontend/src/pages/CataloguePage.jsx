import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { GRADE_CONFIG, GRADES } from '../constants/grades';
import { toast } from '../store/toastStore';
import {
  Filter,
  SlidersHorizontal,
  Search,
  X,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Heart,
  Eye,
  ShoppingBag,
  RotateCcw,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(24);

  // Metadata from backend
  const [meta, setMeta] = useState({
    bricks: [],
    categories: [],
    sleeves: [],
    necks: [],
    grades: ['A', 'B', 'C', 'D'],
    sizes: [],
    minPrice: 0,
    maxPrice: 5000,
  });

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedBrick, setSelectedBrick] = useState(searchParams.get('brick') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSleeve, setSelectedSleeve] = useState(searchParams.get('sleeve') || '');
  const [selectedNeck, setSelectedNeck] = useState(searchParams.get('neck') || '');
  const [selectedGrade, setSelectedGrade] = useState(searchParams.get('grade') || '');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [maxPriceFilter, setMaxPriceFilter] = useState(5000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Catalogue Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Stores
  const { addToCart, setQuickViewProduct } = useCartStore();
  const { toggleWishlist, isWishlisted, items: wishlistItems } = useWishlistStore();
  const isWishlistOnly = searchParams.get('wishlist') === 'true';

  // Load Metadata once
  useEffect(() => {
    api.get('/products/meta')
      .then((res) => {
        setMeta(res.data);
        if (res.data.maxPrice) setMaxPriceFilter(res.data.maxPrice);
      })
      .catch((err) => console.error('Failed to fetch metadata:', err));
  }, []);

  // Synchronize URL query params
  useEffect(() => {
    const s = searchParams.get('search');
    const b = searchParams.get('brick');
    const c = searchParams.get('category');
    if (s !== null) setSearch(s);
    if (b !== null) setSelectedBrick(b);
    if (c !== null) setSelectedCategory(c);
  }, [searchParams]);

  // Fetch Products based on current filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sort: sortBy,
      };
      if (search) params.search = search;
      if (selectedBrick) params.brick = selectedBrick;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedSleeve) params.sleeve = selectedSleeve;
      if (selectedNeck) params.neck = selectedNeck;
      if (selectedGrade) params.grade = selectedGrade;
      if (selectedSize) params.size = selectedSize;
      if (maxPriceFilter) params.maxPrice = maxPriceFilter;

      const res = await api.get('/products', { params });
      let list = res.data.products || [];

      if (isWishlistOnly) {
        list = list.filter((p) => isWishlisted(p._id || p.style_code));
      }

      setProducts(list);
      setTotal(res.data.total || list.length);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, search, selectedBrick, selectedCategory, selectedSleeve, selectedNeck, selectedGrade, selectedSize, maxPriceFilter, isWishlistOnly, isWishlisted]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedBrick('');
    setSelectedCategory('');
    setSelectedSleeve('');
    setSelectedNeck('');
    setSelectedGrade('');
    setSelectedSize('');
    setMaxPriceFilter(meta.maxPrice || 5000);
    setPage(1);
    setSearchParams({});
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append('file', uploadFile);

    setUploading(true);
    try {
      const res = await api.post('/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res.data.message || 'Catalogue uploaded successfully!');
      setUploadModalOpen(false);
      setUploadFile(null);
      // Refresh products and meta
      fetchProducts();
      api.get('/products/meta').then((r) => setMeta(r.data));
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error(err.response?.data?.message || 'Failed to upload catalogue.');
    } finally {
      setUploading(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pb-20">
      {/* 1. Header Toolbar */}
      <div className="pt-2 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              {isWishlistOnly ? 'Your Wishlist' : 'Wholesale Catalogue'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {total} styles · dynamic grade curves
            </p>
          </div>

          {/* Mobile Filter Toggle — top-right on mobile */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 shrink-0"
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>

        {/* Second row: Upload + Sort — always horizontal, wraps gracefully */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Upload Catalogue CTA */}
          <button
            onClick={() => setUploadModalOpen(true)}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 shadow-2xs"
          >
            <UploadCloud className="w-3.5 h-3.5 text-brand-primary" />
            <span className="hidden xs:inline">Upload</span>
            <span className="hidden sm:inline"> Catalogue</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs shadow-2xs">
            <span className="text-slate-400 font-medium hidden xs:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none"
            >
              <option value="newest" className="bg-white dark:bg-slate-900">Newest</option>
              <option value="price_asc" className="bg-white dark:bg-slate-900">Price ↑</option>
              <option value="price_desc" className="bg-white dark:bg-slate-900">Price ↓</option>
              <option value="rating" className="bg-white dark:bg-slate-900">Top Rated</option>
              <option value="title_asc" className="bg-white dark:bg-slate-900">A → Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Main Layout: Filter Sidebar + Product Grid (Max 2 levels nesting) */}
      <div className="flex gap-8 items-start">
        {/* Filter Sidebar (Desktop & Mobile Drawer) */}
        <aside
          aria-label="Catalogue filters"
          className={`${
            mobileFilterOpen
              ? 'fixed inset-0 z-50 p-6 bg-white dark:bg-slate-900 overflow-y-auto block'
              : 'hidden lg:block w-64 shrink-0'
          }`}
        >
          {mobileFilterOpen && (
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800 lg:hidden">
              <span className="font-bold text-base">Filter Catalogue</span>
              <button onClick={() => setMobileFilterOpen(false)} aria-label="Close filters">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          )}

          {/* Clean Flat Sidebar Container (NOT glass, high contrast base) */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-2xs">
            {/* Header & Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Filters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-semibold text-brand-primary dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Brick Category Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Brick ({meta.bricks?.length || 0})
              </label>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-xs">
                <button
                  onClick={() => setSelectedBrick('')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                    selectedBrick === ''
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  All Bricks
                </button>
                {meta.bricks?.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrick(selectedBrick === b ? '' : b)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      selectedBrick === b
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{b}</span>
                    {selectedBrick === b && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            {meta.categories?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Category
                </label>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                      selectedCategory === ''
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    All Categories
                  </button>
                  {meta.categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(selectedCategory === c ? '' : c)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === c
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{c}</span>
                      {selectedCategory === c && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Grade Filter (A, B, C, D) */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Grade
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {GRADES.map((g) => {
                  const cfg = GRADE_CONFIG[g];
                  const isSelected = selectedGrade === g;

                  return (
                    <button
                      key={g}
                      onClick={() => setSelectedGrade(isSelected ? '' : g)}
                      className={`py-1.5 px-2 rounded-lg font-bold border transition-all text-center ${
                        isSelected
                          ? `${cfg.badgeBg} ring-2 ring-brand-primary shadow-xs`
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Sizes Chips */}
            {meta.sizes?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Size ({meta.sizes.length})
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {meta.sizes.map((sz) => {
                    const isSelected = selectedSize === sz;

                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(isSelected ? '' : sz)}
                        className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                          isSelected
                            ? 'bg-brand-primary text-white border-brand-primary shadow-2xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price Range Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Max MRP:</span>
                <span className="font-bold text-brand-primary">₹{maxPriceFilter.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={meta.minPrice || 399}
                max={meta.maxPrice || 5000}
                step={100}
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>

            {mobileFilterOpen && (
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="btn-primary w-full text-xs py-2 mt-4 lg:hidden"
              >
                Apply Filters
              </button>
            )}
          </div>
        </aside>

        {/* Product Grid Area (High-contrast clean base layer) */}
        <main className="flex-1 min-w-0 space-y-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 space-y-3 animate-pulse"
                >
                  <div className="w-full aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  No styles matched your criteria
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Try clearing or broadening your filters, or upload a new catalogue spreadsheet.
                </p>
              </div>
              <button onClick={handleResetFilters} className="btn-secondary text-xs py-2 px-4">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p) => {
                const wishlisted = isWishlisted(p._id || p.style_code);

                return (
                  <div
                    key={p._id || p.style_code}
                    className="group product-card overflow-hidden flex flex-col justify-between"
                  >
                    {/* Card Image */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80';
                        }}
                      />

                      {/* Wishlist toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p);
                        }}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-brand-accent shadow-sm backdrop-blur-sm transition-all active:scale-90"
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${wishlisted ? 'fill-brand-accent text-brand-accent' : ''}`} />
                      </button>

                      {/* Brick Category Badge */}
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-[10px] font-semibold text-white tracking-wide">
                        {p.brick}
                      </div>

                      {/* Quick-view hover button */}
                      <div className="absolute inset-x-0 bottom-2 px-3 hidden group-hover:flex items-center gap-2 transition-all">
                        <button
                          onClick={() => setQuickViewProduct(p)}
                          className="w-full py-1.5 rounded-lg bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Quick View
                        </button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-2.5 sm:p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Grade badge on its own line to avoid overlap on 2-col mobile */}
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                            {p.brand || 'Threadly'}
                          </span>
                          <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                            {p.grade || 'A'}
                          </span>
                        </div>

                        <h3
                          onClick={() => setQuickViewProduct(p)}
                          className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 cursor-pointer hover:text-brand-primary transition-colors leading-snug"
                          title={p.title}
                        >
                          {p.title}
                        </h3>
                      </div>

                      {/* Size Chips */}
                      <div className="flex flex-wrap gap-1">
                        {(p.sizes || []).slice(0, 4).map((sz) => (
                          <span
                            key={sz}
                            className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
                          >
                            {sz}
                          </span>
                        ))}
                        {(p.sizes || []).length > 4 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{p.sizes.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Pricing & Add to Cart */}
                      <div className="pt-1.5 sm:pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 gap-1">
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                            ₹{p.mrp?.toLocaleString('en-IN') || 1999}
                          </span>
                          <span className="block text-[9px] sm:text-[10px] text-slate-400">MRP/Unit</span>
                        </div>

                        <button
                          onClick={() => addToCart(p, { grade: p.grade || 'A', sets: 1 })}
                          className="btn-accent py-1 px-2 sm:py-1.5 sm:px-3 text-xs font-semibold shrink-0"
                          aria-label="Add to cart"
                        >
                          <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Page {page} of {totalPages}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                  className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </button>
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                  className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 4. Catalogue Upload Modal (Liquid Glass Modal) */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setUploadModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg liquid-glass-modal p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 border border-white/50 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-brand-primary" />
                  <h3 className="text-lg font-bold">Upload Catalogue</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload an Excel (.xlsx) or CSV catalogue file to update the products dynamically.
                </p>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 pt-4">
              <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/40">
                <UploadCloud className="w-10 h-10 mx-auto text-brand-primary/80" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Drag and drop your spreadsheet, or browse
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Supports .xlsx and .csv files up to 15MB
                  </p>
                </div>
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary-hover cursor-pointer"
                />
              </div>

              {uploadFile && (
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 text-xs flex items-center justify-between text-brand-primary">
                  <span className="truncate font-medium">{uploadFile.name}</span>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {(uploadFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile || uploading}
                  className="btn-primary text-xs py-2 px-4 shadow-sm"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Parsing & Upserting...
                    </>
                  ) : (
                    'Upload & Process Catalogue'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
