import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const DashboardCard = ({ title, value, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass-card p-6 flex items-start justify-between"
  >
    <div>
      <p className="text-sm font-medium text-muted mb-1">{title}</p>
      <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
    </div>
    <div className="p-3 bg-primary/10 rounded-lg text-primary">
      <span className="material-symbols-rounded text-2xl">{icon}</span>
    </div>
  </motion.div>
);

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalProducts: 0,
    availableGrades: 0,
    cartItems: 0,
    savedRatios: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metaRes, cartRes, ratiosRes, productsRes] = await Promise.all([
          api.get('/products/meta'),
          api.get('/cart'),
          api.get('/ratios'),
          api.get('/products?limit=1')
        ]);

        setStats({
          totalProducts: productsRes.data.total || 0,
          availableGrades: metaRes.data.grades?.length || 0,
          cartItems: cartRes.data.items?.length || 0,
          savedRatios: ratiosRes.data?.length || 0
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.displayName || 'User'}</h1>
        <p className="text-muted">Here is an overview of your catalogue and ratio configurations.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-card p-6 h-32 animate-pulse bg-surface-glass/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <DashboardCard 
            title="Total Products" 
            value={stats.totalProducts} 
            icon="inventory_2"
            delay={0.1}
          />
          <DashboardCard 
            title="Available Grades" 
            value={stats.availableGrades} 
            icon="category"
            delay={0.2}
          />
          <DashboardCard 
            title="Cart Products" 
            value={stats.cartItems} 
            icon="shopping_cart"
            delay={0.3}
          />
          <DashboardCard 
            title="Saved Ratios" 
            value={stats.savedRatios} 
            icon="tune"
            delay={0.4}
          />
        </div>
      )}
      
      <div className="glass-panel p-8 flex flex-col items-center justify-center text-center py-16">
        <span className="material-symbols-rounded text-6xl text-muted/30 mb-4">analytics</span>
        <h3 className="text-xl font-medium mb-2">Ready to configure?</h3>
        <p className="text-muted max-w-md mx-auto mb-6">
          Browse your catalogue to select products and start configuring grade-wise size ratios for your inventory.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
