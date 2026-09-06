import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const StatWidget = ({ title, value, icon, delay, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="ecommerce-card p-5 sm:p-6 flex items-start justify-between relative overflow-hidden group cursor-pointer"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
    
    <div className="relative z-10">
      <p className="text-xs sm:text-sm font-semibold text-muted mb-1.5 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{value}</h3>
    </div>
    
    <div className={`relative z-10 p-3 sm:p-3.5 bg-${color}-500/10 rounded-xl text-${color}-600 dark:text-${color}-400 group-hover:bg-${color}-500 group-hover:text-white transition-colors duration-300 shadow-sm`}>
      <span className="material-symbols-rounded text-2xl">{icon}</span>
    </div>
  </motion.div>
);

const CategoryCard = ({ title, icon, imageBg, delay, onClick }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
    onClick={onClick}
    className="relative h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-border"
  >
    <div className={`absolute inset-0 ${imageBg} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
      <h4 className="text-white font-bold text-lg">{title}</h4>
      <span className="material-symbols-rounded text-white bg-white/20 p-1.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">
        arrow_forward
      </span>
    </div>
    <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-xl backdrop-blur-md">
       <span className="material-symbols-rounded text-white text-xl">{icon}</span>
    </div>
  </motion.div>
);

const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
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
    <div className="space-y-6 sm:space-y-8 pb-10">
      
      {/* Top Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Hello, {user?.displayName || 'Shopper'} 👋
          </h1>
          <p className="text-muted mt-1 text-sm sm:text-base">
            Manage your inventory, explore new arrivals, and configure ratios effortlessly.
          </p>
        </div>
        <button onClick={() => navigate('/catalogue')} className="btn-primary py-2.5 shadow-md">
          <span className="material-symbols-rounded">storefront</span>
          Go to Catalogue
        </button>
      </div>

      {/* Main Promotional Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl bg-gradient-to-r from-meesho-pink via-purple-600 to-indigo-600 p-8 sm:p-10 text-white overflow-hidden shadow-lg"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10" />
        
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
            <span className="material-symbols-rounded text-sm">local_fire_department</span>
            Trending Now
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Exclusive Wholesale Deals & Bulk Discounts
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-md">
            Save big on your next inventory restock. Configure grade-wise size ratios and checkout directly.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => navigate('/catalogue')}
              className="bg-white text-indigo-900 font-bold py-3 px-6 rounded-xl hover:bg-slate-100 transition-colors shadow-md flex items-center gap-2"
            >
              Shop Collection
              <span className="material-symbols-rounded text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-rounded text-primary">bar_chart</span>
          <h3 className="font-bold text-lg">Your Store Overview</h3>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="ecommerce-card h-32 animate-pulse bg-surface/50 border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div onClick={() => navigate('/catalogue')}>
              <StatWidget title="Total Products" value={stats.totalProducts} icon="inventory_2" delay={0.1} color="blue" />
            </div>
            <div onClick={() => navigate('/catalogue')}>
              <StatWidget title="Grades" value={stats.availableGrades} icon="verified" delay={0.2} color="emerald" />
            </div>
            <div onClick={() => navigate('/cart')}>
              <StatWidget title="Items in Cart" value={stats.cartItems} icon="shopping_cart" delay={0.3} color="rose" />
            </div>
            <div onClick={() => navigate('/ratios')}>
              <StatWidget title="Saved Ratios" value={stats.savedRatios} icon="tune" delay={0.4} color="amber" />
            </div>
          </div>
        )}
      </div>

      {/* Featured Categories / Actions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-rounded text-primary">category</span>
          <h3 className="font-bold text-lg">Quick Access</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <CategoryCard 
            title="Browse Catalogue" 
            icon="storefront"
            imageBg="bg-gradient-to-br from-blue-400 to-blue-600"
            delay={0.1}
            onClick={() => navigate('/catalogue')}
          />
          <CategoryCard 
            title="Manage Ratios" 
            icon="calculate"
            imageBg="bg-gradient-to-br from-emerald-400 to-teal-600"
            delay={0.2}
            onClick={() => navigate('/ratios')}
          />
          <CategoryCard 
            title="View Cart & Checkout" 
            icon="shopping_bag"
            imageBg="bg-gradient-to-br from-rose-400 to-pink-600"
            delay={0.3}
            onClick={() => navigate('/cart')}
          />
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
