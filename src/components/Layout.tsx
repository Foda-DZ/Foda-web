import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";
import AuthModal from "./AuthModal";
import ScrollToTopButton from "./ScrollToTopButton";

export default function Layout() {
  return (
    <div className="min-h-screen">
      {/* Global modals/drawers */}
      <AuthModal />
      <CartDrawer />

      {/* Navbar always visible */}
      <Navbar />

      {/* Page content */}
      <Outlet />

      {/* Scroll to top */}
      <ScrollToTopButton />
    </div>
  );
}
