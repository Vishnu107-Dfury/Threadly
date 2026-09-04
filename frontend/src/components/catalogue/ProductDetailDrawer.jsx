import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetailDrawer = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-surface border-l border-border shadow-xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="text-xl font-bold">Product Details</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-glass">
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold tracking-tight mb-2">{product.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.grade && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Grade {product.grade}
                    </span>
                  )}
                  {product.brick && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-glass border border-border">
                      {product.brick}
                    </span>
                  )}
                  {product.category && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-glass border border-border">
                      {product.category}
                    </span>
                  )}
                </div>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-muted mb-3 uppercase tracking-wider">Available Sizes</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <span key={size} className="px-3 py-1.5 bg-surface border border-border rounded-md text-sm font-medium">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted mb-3 uppercase tracking-wider">Attributes</h4>
                  <div className="space-y-3">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                        <span className="text-muted capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="font-medium text-right">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border bg-surface/50 backdrop-blur-md">
              <button 
                onClick={() => onAddToCart(product._id)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <span className="material-symbols-rounded">add_shopping_cart</span>
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
