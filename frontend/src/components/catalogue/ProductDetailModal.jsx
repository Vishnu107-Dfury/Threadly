import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { GRADE_CONFIG, GRADES } from '../../constants/grades';
import { X, ShoppingBag, Heart, Star, Layers, Check } from 'lucide-react';

export default function ProductDetailModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('A');
  const [setsCount, setSetsCount] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImage(quickViewProduct.image);
      setSelectedGrade(quickViewProduct.grade || 'A');
      setSetsCount(1);
      setAddedSuccess(false);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const p = quickViewProduct;
  const wishlisted = isWishlisted(p._id || p.style_code);
  const gallery = p.gallery && p.gallery.length > 0 ? p.gallery : [p.image];

  const handleAddToCart = () => {
    addToCart(p, { grade: selectedGrade, sets: setsCount });
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setQuickViewProduct(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Liquid Glass Modal Container */}
      <div className="relative z-10 w-full max-w-3xl my-8 liquid-glass-modal p-6 sm:p-8 bg-white/85 dark:bg-slate-900/85 border border-white/40 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors z-20"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left: Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-inner">
              <img
                src={selectedImage || p.image}
                alt={p.title}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80';
                }}
              />
              <button
                onClick={() => toggleWishlist(p)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-brand-accent shadow-sm transition-all"
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-brand-accent text-brand-accent' : ''}`} />
              </button>
            </div>

            {/* Thumbnail selector */}
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === imgUrl
                        ? 'border-brand-primary scale-102 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Merchandising Options */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Brand & Brick Badges */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-semibold text-brand-primary dark:text-indigo-300">
                  {p.brand || 'Threadly Signature'}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {p.brick}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {p.category}
                </span>
              </div>

              {/* Title & Style Code */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-snug">
                  {p.title}
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Style Code: {p.style_code}
                </p>
              </div>

              {/* Price & Commercial Rating */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  ₹{p.mrp?.toLocaleString('en-IN') || 1999}
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                  MRP per unit
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 ml-auto">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{p.rating || 4.5}</span>
                  <span>({p.reviewCount || 120} orders)</span>
                </div>
              </div>

              {/* Colour and Attribute Details */}
              <div className="p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Colour:</span>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span
                      className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600 inline-block shadow-sm"
                      style={{ backgroundColor: p.color_code || '#1E293B' }}
                    />
                    <span>{p.color || 'Standard'}</span>
                  </div>
                </div>
                {p.sleeve && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Sleeve:</span>
                    <span className="font-medium">{p.sleeve}</span>
                  </div>
                )}
                {p.neck && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Neck Style:</span>
                    <span className="font-medium">{p.neck}</span>
                  </div>
                )}
                {p.attributes?.material && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Material:</span>
                    <span className="font-medium">{p.attributes.material}</span>
                  </div>
                )}
              </div>

              {/* Dynamic Product Sizes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Available Sizes in Ratio Set ({p.sizes?.length || 0})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(p.sizes || ['S', 'M', 'L', 'XL']).map((sz) => (
                    <span
                      key={sz}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs"
                    >
                      {sz}
                    </span>
                  ))}
                </div>
              </div>

              {/* Grade Selector (A, B, C, D) */}
              <div className="pt-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Assign Wholesale Grade</span>
                  <span className="text-[11px] font-normal text-slate-400">Determines size curve</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {GRADES.map((g) => {
                    const cfg = GRADE_CONFIG[g];
                    const isSelected = selectedGrade === g;

                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setSelectedGrade(g)}
                        className={`p-2 rounded-xl text-center border text-xs font-semibold transition-all ${
                          isSelected
                            ? `${cfg.badgeBg} ring-2 ring-brand-primary shadow-sm`
                            : 'bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        Grade {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sets Stepper */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Sets Quantity
                  </span>
                  <span className="text-[11px] text-slate-400">Full ratio set per unit</span>
                </div>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setSetsCount((prev) => Math.max(1, prev - 1))}
                    className="px-3 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-900 dark:text-slate-100 min-w-[2rem] text-center">
                    {setsCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSetsCount((prev) => prev + 1)}
                    className="px-3 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Cart in Warm Coral */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={addedSuccess}
                className="btn-accent flex-1 py-3 text-sm font-semibold tracking-wide shadow-md flex items-center justify-center gap-2"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add {setsCount} {setsCount > 1 ? 'Sets' : 'Set'} to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
