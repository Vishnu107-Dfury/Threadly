import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ icon, label, to, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 mb-2 rounded-lg transition-all ${
        isActive 
          ? 'bg-primary text-primary-foreground shadow-sm' 
          : 'text-foreground hover:bg-surface-glass'
      }`
    }
    title={collapsed ? label : undefined}
  >
    <span className="material-symbols-rounded text-[22px]">{icon}</span>
    {!collapsed && <span className="ml-4 font-medium">{label}</span>}
  </NavLink>
);

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    if (theme === 'light') return 'light_mode';
    if (theme === 'dark') return 'dark_mode';
    return 'contrast';
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 mb-6">
        {!collapsed && <span className="text-xl font-bold tracking-tight">Catalogue</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="hidden md:flex p-2 rounded-full hover:bg-surface-glass transition-colors text-muted hover:text-foreground"
        >
          <span className="material-symbols-rounded">{collapsed ? 'chevron_right' : 'menu'}</span>
        </button>
      </div>

      <nav className="flex-1 px-2 overflow-y-auto">
        <SidebarItem icon="dashboard" label="Dashboard" to="/" collapsed={collapsed} />
        <SidebarItem icon="inventory_2" label="Catalogue" to="/catalogue" collapsed={collapsed} />
        <SidebarItem icon="shopping_cart" label="Cart" to="/cart" collapsed={collapsed} />
        <SidebarItem icon="tune" label="Ratio Management" to="/ratios" collapsed={collapsed} />
      </nav>

      <div className="p-2 border-t border-border/50">
        <button 
          onClick={toggleTheme}
          className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg text-foreground hover:bg-surface-glass transition-colors`}
          title={collapsed ? "Toggle Theme" : undefined}
        >
          <span className="material-symbols-rounded">{getThemeIcon()}</span>
          {!collapsed && <span className="ml-4 font-medium capitalize">{theme} Mode</span>}
        </button>
        <button 
          onClick={logout}
          className={`w-full flex items-center px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors`}
          title={collapsed ? "Logout" : undefined}
        >
          <span className="material-symbols-rounded">logout</span>
          {!collapsed && <span className="ml-4 font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        className="hidden md:block glass-panel m-4 mr-0 border-r-0 rounded-r-none z-10"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="md:hidden fixed inset-y-0 left-0 w-[260px] bg-surface border-r border-border shadow-xl z-50"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden m-0 md:m-4 md:ml-4 rounded-xl md:glass-panel bg-surface md:bg-surface-glass">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border/50 bg-surface/50 backdrop-blur-md">
          <span className="text-xl font-bold">Catalogue</span>
          <button onClick={() => setMobileOpen(true)} className="p-2 -mr-2">
            <span className="material-symbols-rounded">menu</span>
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
