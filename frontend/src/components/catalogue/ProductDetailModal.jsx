import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { GRADE_CONFIG, GRADES } from '../../constants/grades';
import { X, ShoppingBag, Heart, Star, Package, Truck, ShieldCheck, ChevronRight } from 'lucide-react';

// Dummy data for Amazon-like features
const DUMMY_COLORS = [
  { name: 'Midnight Black', code: '#1E293B' },
  { name: 'Crimson Red', code: '#991B1B' },
  { name: 'Navy Blue', code: '#1E3A8A' },
];

const DUMMY_REVIEWS = [
  { user: 'Sarah M.', rating: 5, date: '2 days ago', text: 'Amazing quality! The material feels very premium and the fit is perfect. Highly recommend.' },
  { user: 'John D.', rating: 4, date: '1 week ago', text: 'Great product for the price. Fast shipping too.' },
  { user: 'Priya K.', rating: 5, date: '2 weeks ago', text: 'Exactly as described. The color is vibrant and it washes well.' },
];

export default function ProductDetailModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  const [selectedImage, setSelectedImage] = useState('');
  const [purchaseMode, setPurchaseMode] = useState('retail'); // 'retail' or 'wholesale'
  
  // Retail State
  const [selectedColor, setSelectedColor] = useState(DUMMY_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState('');
  const [retailQuantity, setRetailQuantity] = useState(1);
  const [showSizeError, setShowSizeError] = useState(false);
  
  // Wholesale State
  const [selectedGrade, setSelectedGrade] = useState('A');
  const [setsCount, setSetsCount] = useState(1);
  
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'reviews'

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImage(quickViewProduct.image);
      setSelectedGrade(quickViewProduct.grade || 'A');
      setSetsCount(1);
      setRetailQuantity(1);
      setSelectedSize('');
      setShowSizeError(false);
      setSelectedColor(
        quickViewProduct.color_code 
          ? { name: quickViewProduct.color || 'Standard', code: quickViewProduct.color_code } 
          : DUMMY_COLORS[0]
      );
      setAddedSuccess(false);
      setActiveTab('details');
      setPurchaseMode('retail'); // Default to retail for the amazon-like experience
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const p = quickViewProduct;
  const wishlisted = isWishlisted(p._id || p.style_code);
  const gallery = p.gallery && p.gallery.length > 0 ? p.gallery : [p.image];
  const sizes = p.sizes || ['S', 'M', 'L', 'XL'];

  const handleAddToCart = () => {
    if (purchaseMode === 'retail') {
      if (!selectedSize) {
        setShowSizeError(true);
        return;
      }
      addToCart(p, { size: selectedSize, color: selectedColor.name, sets: retailQuantity });
    } else {
      addToCart(p, { grade: selectedGrade, sets: setsCount });
    }
    
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setQuickViewProduct(null);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-slate-900">
      {/* Main Full-Screen Container */}
      <div className="relative z-10 w-full min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col pt-12 sm:pt-4">
        
        {/* Header / Close button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setQuickViewProduct(null)}
            className="p-3 rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors shadow-sm"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 p-4 sm:p-8">
            
            {/* Left Column: Image Gallery (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 group">
                <img
                  src={selectedImage || p.image}
                  alt={p.title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80';
                  }}
                />
                <button
                  onClick={() => toggleWishlist(p)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-brand-accent shadow-sm transition-all active:scale-95"
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-brand-accent text-brand-accent' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {gallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImage === imgUrl
                          ? 'border-brand-primary shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Info & Commerce (7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-5 pt-4 lg:pt-0">
              
              {/* Brand & Title */}
              <div>
                <a href="#" className="text-sm font-semibold text-brand-primary dark:text-indigo-400 hover:underline">
                  Visit the {p.brand || 'Threadly'} Store
                </a>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight mt-1">
                  {p.title}
                </h1>
                
                {/* Amazon-style Reviews Summary */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(star => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= Math.floor(p.rating || 4.5) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'}`} 
                      />
                    ))}
                    <span className="text-sm font-semibold ml-1">{p.rating || 4.5}</span>
                  </div>
                  <span className="text-sm text-brand-primary hover:underline cursor-pointer" onClick={() => setActiveTab('reviews')}>
                    {p.reviewCount || 128} ratings
                  </span>
                  <span className="text-sm text-slate-400">|</span>
                  <span className="text-sm text-slate-500">{p.style_code}</span>
                </div>
              </div>

              <hr className="border-slate-200 dark:border-slate-800" />

              {/* Price & Stock */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                    ₹{p.mrp?.toLocaleString('en-IN') || 1999}
                  </span>
                  <span className="text-sm text-slate-500 line-through">
                    ₹{Math.round((p.mrp || 1999) * 1.4).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded">
                    -28%
                  </span>
                </div>
                
                {/* Delivery & Stock Urgency */}
                <div className="text-sm space-y-1">
                  <p><span className="font-semibold text-sky-600 dark:text-sky-400">FREE Delivery</span> Tomorrow by 9 PM.</p>
                  <p className="text-green-600 dark:text-green-400 font-bold text-lg mt-2">In Stock</p>
                  <p className="text-slate-500 text-xs">Ships from and sold by Threadly.</p>
                </div>
              </div>

              {/* Purchase Mode Toggle (Retail vs Wholesale) */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full max-w-sm">
                <button
                  onClick={() => setPurchaseMode('retail')}
                  className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                    purchaseMode === 'retail' 
                      ? 'bg-white dark:bg-slate-900 text-brand-primary shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Buy Single Size
                </button>
                <button
                  onClick={() => setPurchaseMode('wholesale')}
                  className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                    purchaseMode === 'wholesale' 
                      ? 'bg-white dark:bg-slate-900 text-brand-primary shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Buy Wholesale Set
                </button>
              </div>

              {/* DYNAMIC FORM AREA: Retail vs Wholesale */}
              <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 space-y-5">
                
                {/* 1. Color Selection (Always visible) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Color: <span className="font-normal text-slate-600 dark:text-slate-400">{selectedColor.name}</span>
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {DUMMY_COLORS.map(c => (
                      <button
                        key={c.code}
                        onClick={() => setSelectedColor(c)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor.code === c.code 
                            ? 'border-brand-primary scale-110 shadow-md ring-2 ring-brand-primary/20' 
                            : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.code }}
                        title={c.name}
                        aria-label={`Select color ${c.name}`}
                      />
                    ))}
                  </div>
                </div>

                {purchaseMode === 'retail' ? (
                  <>
                    {/* Retail: Clickable Sizes */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Size: <span className="font-normal text-slate-600 dark:text-slate-400">{selectedSize || 'Select a size'}</span>
                        </span>
                        <span className="text-xs text-brand-primary hover:underline cursor-pointer">Size Chart</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((sz) => (
                          <button
                            key={sz}
                            onClick={() => { setSelectedSize(sz); setShowSizeError(false); }}
                            className={`min-w-[3.5rem] py-2 px-3 rounded-xl border text-sm font-bold transition-all ${
                              selectedSize === sz
                                ? 'bg-indigo-50 border-brand-primary text-brand-primary dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-300 shadow-sm ring-1 ring-brand-primary/20'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-400'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                      {showSizeError && (
                        <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1 animate-pulse">
                          <X className="w-3 h-3" /> Please select a size to add to cart.
                        </p>
                      )}
                    </div>

                    {/* Retail: Quantity */}
                    <div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 block">Quantity</span>
                      <div className="inline-flex items-center border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
                        <button
                          onClick={() => setRetailQuantity(Math.max(1, retailQuantity - 1))}
                          className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 py-1.5 text-sm font-bold min-w-[2.5rem] text-center border-x border-slate-200 dark:border-slate-700">
                          {retailQuantity}
                        </span>
                        <button
                          onClick={() => setRetailQuantity(retailQuantity + 1)}
                          className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Wholesale: Grade & Sets */}
                    <div className="space-y-4">
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-800 dark:text-amber-400 flex gap-2">
                        <Package className="w-4 h-4 shrink-0" />
                        <p>You are buying a wholesale bundle. Select a grade to determine the size ratio curve per set.</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 block">Wholesale Grade</span>
                        <div className="grid grid-cols-4 gap-2">
                          {GRADES.map((g) => {
                            const cfg = GRADE_CONFIG[g];
                            const isSelected = selectedGrade === g;
                            return (
                              <button
                                key={g}
                                onClick={() => setSelectedGrade(g)}
                                className={`py-2 rounded-xl text-center border text-xs font-bold transition-all ${
                                  isSelected
                                    ? `${cfg.badgeBg} ring-2 ring-brand-primary shadow-sm`
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300'
                                }`}
                              >
                                Grade {g}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 block">Number of Sets</span>
                        <div className="inline-flex items-center border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
                          <button
                            onClick={() => setSetsCount(Math.max(1, setsCount - 1))}
                            className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold transition-colors"
                          >
                            -
                          </button>
                          <span className="px-4 py-1.5 text-sm font-bold min-w-[2.5rem] text-center border-x border-slate-200 dark:border-slate-700">
                            {setsCount}
                          </span>
                          <button
                            onClick={() => setSetsCount(setsCount + 1)}
                            className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Main Action Button */}
                <div className="pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={addedSuccess}
                    className="w-full btn-accent py-3.5 text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 rounded-xl"
                  >
                    {addedSuccess ? (
                      <>
                        <ShieldCheck className="w-5 h-5" /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" /> 
                        Add to Cart {purchaseMode === 'wholesale' && `(${setsCount} Sets)`}
                      </>
                    )}
                  </button>
                  <button className="w-full mt-3 py-3.5 text-sm font-bold bg-orange-400 hover:bg-orange-500 text-slate-900 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-2 py-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-slate-400"/> Secure transaction</div>
                <div className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-slate-400"/> Ships from Threadly</div>
                <div className="flex items-center gap-1.5"><Package className="w-4 h-4 text-slate-400"/> Sold by Threadly</div>
              </div>

            </div>
          </div>

          {/* Bottom Tabs: Details vs Reviews */}
          <div className="mt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
              <button 
                onClick={() => setActiveTab('details')}
                className={`py-4 px-6 text-sm font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Product Details
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-6 text-sm font-bold border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Customer Reviews <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px]">{DUMMY_REVIEWS.length}</span>
              </button>
            </div>

            <div className="p-4 sm:p-8">
              {activeTab === 'details' ? (
                <div className="max-w-3xl space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-3">About this item</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li>Premium quality {p.attributes?.material || 'Cotton blend'} suitable for all seasons.</li>
                      <li>Features a comfortable {p.neck || 'Standard'} neck design and {p.sleeve || 'regular'} sleeves.</li>
                      <li>Care Instructions: Machine wash cold, tumble dry low.</li>
                      <li>Imported. Authentic {p.brand || 'Threadly'} merchandise.</li>
                    </ul>
                  </div>
                  
                  {p.attributes && Object.keys(p.attributes).length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-3">Specifications</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                        {Object.entries(p.attributes).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-sm">
                            <span className="text-slate-500 capitalize font-medium">{key.replace(/_/g, ' ')}</span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-w-4xl flex flex-col md:flex-row gap-8">
                  {/* Reviews Summary */}
                  <div className="w-full md:w-64 shrink-0 space-y-4">
                    <h3 className="text-lg font-bold">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-lg font-bold">4.8 out of 5</span>
                    </div>
                    <p className="text-sm text-slate-500">{p.reviewCount || 128} global ratings</p>
                    
                    {/* Rating bars */}
                    <div className="space-y-2 pt-2">
                      {[
                        { s: '5 star', p: 85 },
                        { s: '4 star', p: 10 },
                        { s: '3 star', p: 3 },
                        { s: '2 star', p: 1 },
                        { s: '1 star', p: 1 }
                      ].map(bar => (
                        <div key={bar.s} className="flex items-center gap-2 text-xs">
                          <span className="w-12 text-slate-500 hover:text-brand-primary cursor-pointer">{bar.s}</span>
                          <div className="flex-1 h-3.5 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                            <div className="h-full bg-amber-400 rounded" style={{ width: `${bar.p}%` }} />
                          </div>
                          <span className="w-8 text-right text-slate-500">{bar.p}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="flex-1 space-y-6">
                    {DUMMY_REVIEWS.map((rev, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                            {rev.user.charAt(0)}
                          </div>
                          <span className="font-semibold">{rev.user}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, idx) => (
                              <Star key={idx} className={`w-3.5 h-3.5 ${idx < rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'}`} />
                            ))}
                          </div>
                          <span className="text-xs font-bold">Verified Purchase</span>
                        </div>
                        <p className="text-xs text-slate-500">Reviewed in India on {rev.date}</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{rev.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Related Products Carousel (Mock) */}
            <div className="p-4 sm:p-8 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold mb-4">Frequently bought together</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-36 shrink-0 space-y-2 group cursor-pointer">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                      <img src={`https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80&auto=format&fit=crop&sig=${i}`} alt="Related" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div>
                      <p className="text-brand-primary text-xs font-bold hover:underline">Threadly Essentials</p>
                      <p className="text-sm font-bold">₹{(1499 + i * 200).toLocaleString()}</p>
                      <div className="flex">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><Star className="w-3 h-3 fill-slate-300 text-slate-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
