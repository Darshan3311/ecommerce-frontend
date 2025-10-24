import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import useAuthStore from './store/useAuthStore';
import { useNavigate } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SellerRegisterPage from './pages/auth/SellerRegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import CreateProductPage from './pages/seller/CreateProductPage';
import ProductsListPage from './pages/seller/ProductsListPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import WishlistPage from './pages/WishlistPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  // Initialize auth session on app mount so cookie-based sessions are
  // reconciled before protected routes decide to redirect.
  const init = useAuthStore((s) => s.init);
  const navigate = useNavigate();

  React.useEffect(() => {
    init();

    // Listen for unauthorized events emitted by the API layer
    let unauthHandled = false;
    const onUnauth = () => {
      if (unauthHandled) return;
      unauthHandled = true;
      // Clear session toast flag so a future login attempt can show it again
      window.dispatchEvent(new CustomEvent('app:clearSessionToast'));
      // Use react-router navigation to avoid full page reloads which can
      // cause 404s when hosting an SPA on platforms like Render.
      navigate('/login', { replace: true });
    };

    window.addEventListener('app:unauthorized', onUnauth);
    return () => window.removeEventListener('app:unauthorized', onUnauth);
  }, [init, navigate]);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="seller/register" element={<SellerRegisterPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          
          {/* Protected Routes */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="seller/dashboard"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="seller/products"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <ProductsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="seller/orders"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="seller/products/new"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <CreateProductPage />
              </ProtectedRoute>
            }
          />
          <Route path="cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />
          <Route path="checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="orders/:id" element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          } />
          <Route path="wishlist" element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
