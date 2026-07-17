import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import AuthModal from "./AuthModal";

export default function Layout() {
  return (
    <div className="min-h-screen">
      {/* Global modals/drawers */}
      <AuthModal />

      {/* Navbar always visible */}
      <Navbar />

      {/* Page content */}
      <Outlet />
    </div>
  );
}
