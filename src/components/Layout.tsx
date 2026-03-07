import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";
import AuthModal from "./AuthModal";
import ProductDetailModal from "./ProductDetailModal";
import ScrollToTopButton from "./ScrollToTopButton";
import type { Product } from "../types";

export interface LayoutOutletContext {
  openProduct: (product: Product) => void;
}

export default function Layout() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openProduct = (product: Product) => setSelectedProduct(product);
  const closeProduct = () => setSelectedProduct(null);

  return (
    <div className="min-h-screen">
      {/* Global modals/drawers */}
      <AuthModal />
      <CartDrawer />
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={closeProduct} onViewProduct={openProduct} />
      )}

      {/* Navbar always visible */}
      <Navbar />

      {/* Page content */}
      <Outlet context={{ openProduct } satisfies LayoutOutletContext} />

      {/* Scroll to top */}
      <ScrollToTopButton />
    </div>
  );
}
