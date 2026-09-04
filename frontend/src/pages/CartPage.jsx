import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';

const CartPage = () => {
  const { cart, fetchCart, removeFromCart, clearCart, loading } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const items = cart?.items || [];
  
  // Calculate summary stats
  const uniqueGrades = new Set(items.map(item => item.productId?.grade).filter(Boolean));

  if (loading && items.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 glass-card animate-pulse bg-surface-glass/50" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] glass-panel text-center p-8">
        <span className="material-symbols-rounded text-6xl text-muted/30 mb-4">shopping_cart</span>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted mb-8 max-w-md">
          Select products from the catalogue to begin configuring your grade-wise size ratios.
        </p>
        <button 
          onClick={() => navigate('/catalogue')}
          className="btn-primary"
        >
          Browse Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Selected Products</h1>
          <p className="text-muted">
            {items.length} products selected across {uniqueGrades.size} grades.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if(window.confirm('Are you sure you want to clear the cart?')) {
                clearCart();
              }
            }}
            className="btn-secondary text-red-500 hover:bg-red-500/10 hover:text-red-600"
          >
            Clear Cart
          </button>
          <button 
            onClick={() => navigate('/ratios')}
            className="btn-primary flex items-center gap-2"
          >
            Configure Ratios
            <span className="material-symbols-rounded text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface/50 border-b border-border text-muted uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Grade</th>
                <th className="px-6 py-4 font-medium">Brick</th>
                <th className="px-6 py-4 font-medium">Sizes</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {items.map((item) => {
                const p = item.productId;
                if (!p) return null; // Defensive check
                return (
                  <tr key={item._id || p._id} className="hover:bg-surface-glass transition-colors">
                    <td className="px-6 py-4 font-medium">{p.title}</td>
                    <td className="px-6 py-4">
                      {p.grade && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {p.grade}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{p.brick || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="text-muted text-sm">{p.sizes?.join(', ') || '-'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => removeFromCart(p._id)}
                        className="p-2 rounded-full hover:bg-red-500/10 text-muted hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <span className="material-symbols-rounded text-xl">delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
