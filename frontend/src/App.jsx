import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';

// Layouts & Pages
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CataloguePage from './pages/CataloguePage';
import CartPage from './pages/CartPage';
import RatioPage from './pages/RatioPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="catalogue" element={<CataloguePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="ratios" element={<RatioPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
