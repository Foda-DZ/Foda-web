import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { LangProvider } from "./context/LangContext";
import { SellerProvider } from "./context/SellerContext";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import PendingPage from "./pages/seller/PendingPage";
import Dashboard from "./pages/seller/Dashboard";
import ProductsPage from "./pages/seller/ProductsPage";
import ProductFormPage from "./pages/seller/ProductFormPage";
import OrdersPage from "./pages/seller/OrdersPage";

// ─── Scroll Restoration ────────────────────────────────────────────────────────

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

// ─── Route Guards ─────────────────────────────────────────────────────────────

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/** Redirect root /seller to the right sub-page based on isActive */
function SellerIndexRedirect() {
  const { user } = useAuth();
  if (!user || user.role !== "seller") return <Navigate to="/" replace />;
  return <Navigate to={user.isActive ? "/seller/dashboard" : "/seller/pending"} replace />;
}

/** Any seller (active or pending) */
function RequireSeller({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "seller") return <Navigate to="/" replace />;
  return <>{children}</>;
}

/** Only active (approved) sellers */
function RequireActiveSeller({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "seller") return <Navigate to="/" replace />;
  if (!user.isActive) return <Navigate to="/seller/pending" replace />;
  return <>{children}</>;
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <SellerProvider>
            <CartProvider>
              <Routes>
                {/* ── Buyer routes (with buyer Navbar/Footer layout) ── */}
                <Route element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="shop" element={<ShopPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route
                    path="profile"
                    element={
                      <RequireAuth>
                        <ProfilePage />
                      </RequireAuth>
                    }
                  />
                </Route>

                {/* ── Seller routes (own SellerLayout, no buyer navbar) ── */}
                <Route path="seller">
                  <Route index element={<SellerIndexRedirect />} />
                  <Route
                    path="pending"
                    element={
                      <RequireSeller>
                        <PendingPage />
                      </RequireSeller>
                    }
                  />
                  <Route
                    path="dashboard"
                    element={
                      <RequireActiveSeller>
                        <Dashboard />
                      </RequireActiveSeller>
                    }
                  />
                  <Route
                    path="products"
                    element={
                      <RequireActiveSeller>
                        <ProductsPage />
                      </RequireActiveSeller>
                    }
                  />
                  <Route
                    path="products/new"
                    element={
                      <RequireActiveSeller>
                        <ProductFormPage />
                      </RequireActiveSeller>
                    }
                  />
                  <Route
                    path="orders"
                    element={
                      <RequireActiveSeller>
                        <OrdersPage />
                      </RequireActiveSeller>
                    }
                  />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </CartProvider>
          </SellerProvider>
        </AuthProvider>
      </BrowserRouter>
    </LangProvider>
  );
}
