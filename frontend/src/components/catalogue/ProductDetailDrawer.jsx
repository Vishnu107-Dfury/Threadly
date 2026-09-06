import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetailDrawer = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Reset state when product changes or drawer opens
    if (isOpen && product) {
      setSelectedSize('');
      setQuantity(1);
      setShowError(false);
    }
  }, [isOpen, product]);

  const handleAddToCart = () => {
    const hasSizes = product?.sizes && product.sizes.length > 0;
    if (hasSizes && !selectedSize) {
      setShowError(true);
      return;
    }
    
    setShowError(false);
    // Send selected size (if any) and quantity
    onAddToCart(product._id, selectedSize || null, quantity);
  };

  if (!product) return null;

  const hasSizes = product.sizes && product.sizes.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-surface border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-surface/90 backdrop-blur-md sticky top-0 z-10">
              <h2 className="text-lg font-bold">Product Details</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-background text-muted hover:text-foreground transition-colors">
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              
              {/* Product Image Hero */}
              <div className="relative h-72 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-rounded text-7xl text-white/20">checkroom</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {product.grade && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg">
                      Grade: {product.grade}
                    </span>
                  </div>
                )}
                {/* Title overlay on image */}
                <div className="absolute bottom-4 left-5 right-5">
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">{product.brick || product.category}</p>
                  <h3 className="text-white text-xl font-extrabold leading-tight line-clamp-2">{product.title}</h3>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Ratings + Price */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    {product.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} className={`w-4 h-4 ${s <= Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm font-bold text-amber-500">{product.rating}</span>
                        <span className="text-xs text-muted">({(product.reviewCount || 0).toLocaleString()} reviews)</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold gradient-text">₹{(product.price || 0).toLocaleString()}</div>
                    {product.price && <div className="text-xs text-muted line-through">₹{Math.round(product.price * 1.35).toLocaleString()}</div>}
                  </div>
                </div>

                {/* Free delivery badge */}
                <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="material-symbols-rounded text-emerald-500">local_shipping</span>
                  <div>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Free Delivery</p>
                    <p className="text-xs text-muted">Delivered within 3-5 business days</p>
                  </div>
                </div>

              {/* Size Selection */}
              {hasSizes && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold uppercase tracking-wide text-foreground">Select Size</h4>
                    <button className="text-xs text-primary font-semibold hover:underline">Size Chart</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => {
                      const isSelected = selectedSize === size;
                      return (
                        <button 
                          key={size} 
                          onClick={() => {
                            setSelectedSize(size);
                            setShowError(false);
                          }}
                          className={`min-w-[3rem] px-4 py-2 rounded-lg border-2 text-sm font-bold transition-all duration-200 ${
                            isSelected 
                              ? 'border-primary bg-primary/10 text-primary scale-105 shadow-sm' 
                              : 'border-border bg-surface text-muted hover:border-primary/50 hover:text-foreground'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {showError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                      className="text-rose-500 text-xs font-semibold mt-2 flex items-center gap-1"
                    >
                      <span className="material-symbols-rounded text-sm">error</span>
                      Please select a size to continue.
                    </motion.p>
                  )}
                </div>
              )}

              {/* Quantity Selection */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wide text-foreground mb-3">Quantity</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-border rounded-lg bg-surface overflow-hidden">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-4 py-2 hover:bg-background text-muted hover:text-foreground transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <span className="material-symbols-rounded text-sm">remove</span>
                    </button>
                    <span className="px-4 py-2 font-bold w-12 text-center border-x-2 border-border">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-4 py-2 hover:bg-background text-muted hover:text-foreground transition-colors"
                    >
                      <span className="material-symbols-rounded text-sm">add</span>
                    </button>
                  </div>
                </div>
              </div>

              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-foreground mb-3">Product Specifications</h4>
                  <div className="bg-background rounded-xl border border-border overflow-hidden">
                    {Object.entries(product.attributes).map(([key, value], i, arr) => (
                      <div key={key} className={`flex justify-between p-3 text-sm ${i !== arr.length -1 ? 'border-b border-border' : ''}`}>
                        <span className="text-muted capitalize font-medium">{key.replace(/_/g, ' ')}</span>
                        <span className="font-bold text-foreground text-right">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>{/* close p-6 */}
            </div>{/* close scrollable */}


            {/* Bottom Action Bar */}
            <div className="p-5 border-t border-border bg-surface/90 backdrop-blur-md sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button 
                onClick={handleAddToCart}
                className="btn-primary w-full py-3.5 text-base rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span className="material-symbols-rounded">shopping_bag</span>
                Add to Cart
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailDrawer;
