import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { LangProvider } from "./context/LangContext";
import { SellerProvider } from "./context/SellerContext";
import { WishlistProvider } from "./context/WishlistContext";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import SellPage from "./pages/SellPage";
import SellerAuthPage from "./pages/SellerAuthPage";
import Dashboard from "./pages/seller/Dashboard";
import ProductsPage from "./pages/seller/ProductsPage";
import ProductFormPage from "./pages/seller/ProductFormPage";
import OrdersPage from "./pages/seller/OrdersPage";
import SettingsPage from "./pages/seller/SettingsPage";
import MetaAdsPage from "./pages/seller/MetaAds";
import MetaAdsCallbackPage from "./pages/seller/MetaAdsCallback";
import TrafficAnalyticsPage from "./pages/seller/TrafficAnalytics";
import InventoryPage from "./pages/seller/InventoryPage";
import PromotionsPage from "./pages/seller/PromotionsPage";
import ProductAnalyticsPage from "./pages/seller/ProductAnalyticsPage";
import RevenueAnalyticsPage from "./pages/seller/RevenueAnalyticsPage";
import ConfirmatorsPage from "./pages/seller/ConfirmatorsPage";
import CollectionsPage from "./pages/seller/CollectionsPage";
import SellerStorefrontPage from "./pages/SellerStorefrontPage";
import CollectionPage from "./pages/CollectionPage";
import ProductReviewsPage from "./pages/ProductReviewsPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";

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
  const { user, authReady } = useAuth();
  if (!authReady) return null;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/** Redirect root /seller to the dashboard */
function SellerIndexRedirect() {
  const { user, authReady } = useAuth();
  if (!authReady) return null;
  if (!user || user.role !== "seller") return <Navigate to="/" replace />;
  return <Navigate to="/seller/dashboard" replace />;
}

/** Logged-in sellers landing on "/" get sent to their dashboard */
function HomeOrSellerRedirect() {
  const { user, authReady } = useAuth();
  if (!authReady) return null;
  if (user?.role === "seller")
    return <Navigate to="/seller/dashboard" replace />;
  return <HomePage />;
}

/** Only active sellers can access seller portal pages */
function RequireActiveSeller({ children }: { children: React.ReactNode }) {
  const { user, authReady } = useAuth();
  if (!authReady) return null;
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "seller") return <Navigate to="/" replace />;
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
              <WishlistProvider>
                <Routes>
                  {/* ── Buyer routes (with buyer Navbar/Footer layout) ── */}
                  <Route element={<Layout />}>
                    <Route index element={<HomeOrSellerRedirect />} />
                    <Route path="shop" element={<ShopPage />} />
                    <Route path="sell" element={<SellPage />} />
                    <Route path="products/:id" element={<ProductPage />} />
                    <Route path="products/:id/reviews" element={<ProductReviewsPage />} />
                    <Route path="storefront/:sellerId" element={<SellerStorefrontPage />} />
                    <Route path="collections/:id" element={<CollectionPage />} />
                    <Route path="wishlist" element={<WishlistPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="privacy" element={<PrivacyPage />} />
                    <Route path="terms" element={<TermsPage />} />
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
                    <Route path="auth" element={<SellerAuthPage />} />
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
                      path="inventory"
                      element={
                        <RequireActiveSeller>
                          <InventoryPage />
                        </RequireActiveSeller>
                      }
                    />
                    <Route
                      path="promotions"
                      element={
                        <RequireActiveSeller>
                          <PromotionsPage />
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
                      path="products/:id/edit"
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
                    <Route
                      path="settings"
                      element={
                        <RequireActiveSeller>
                          <SettingsPage />
                        </RequireActiveSeller>
                      }
                    />
                    <Route
                      path="meta-ads"
                      element={
                        <RequireActiveSeller>
                          <MetaAdsPage />
                        </RequireActiveSeller>
                      }
                    />
                    <Route
                      path="meta-ads/callback"
                      element={
                        <RequireActiveSeller>
                          <MetaAdsCallbackPage />
                        </RequireActiveSeller>
                      }
                    />
                    <Route
                      path="traffic-analytics"
                      element={
                        <RequireActiveSeller>
                          <TrafficAnalyticsPage />
                        </RequireActiveSeller>
                      }
                    />
                    <Route
                      path="analytics/product/:id"
                      element={
                        <RequireActiveSeller>
                          <ProductAnalyticsPage />
                        </RequireActiveSeller>
                      }
                    />
                    <Route
                      path="analytics/revenue"
                      element={
                        <RequireActiveSeller>
                          <RevenueAnalyticsPage />
                        </RequireActiveSeller>
                      }
                    />
                    <Route
                      path="confirmators"
                      element={
                        <RequireActiveSeller>
                          <ConfirmatorsPage />
                        </RequireActiveSeller>
                      }
                    />
                    <Route
                      path="collections"
                      element={
                        <RequireActiveSeller>
                          <CollectionsPage />
                        </RequireActiveSeller>
                      }
                    />
                  </Route>

                  <Route element={<Layout />}>
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </WishlistProvider>
            </CartProvider>
          </SellerProvider>
        </AuthProvider>
      </BrowserRouter>
    </LangProvider>
  );
}
