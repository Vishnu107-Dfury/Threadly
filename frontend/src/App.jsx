import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Layout & Pages
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import CartPage from './pages/CartPage';
import RatioPage from './pages/RatioPage';
import AccountPage from './pages/AccountPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initializeAuth();
    initTheme();
  }, [initializeAuth, initTheme]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Authentication Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Commerce & Merchandising Pages with Shared Liquid Glass Layout */}
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/catalogue"
            element={
              <Layout>
                <CataloguePage />
              </Layout>
            }
          />
          <Route
            path="/cart"
            element={
              <Layout>
                <CartPage />
              </Layout>
            }
          />
          <Route
            path="/ratios"
            element={
              <Layout>
                <RatioPage />
              </Layout>
            }
          />
          <Route
            path="/account"
            element={
              <Layout>
                <AccountPage />
              </Layout>
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <Layout>
                <NotFoundPage />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
