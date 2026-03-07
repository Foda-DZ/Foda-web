import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { SessionUser, AuthModalView, UserRole } from "../types";
import { authService } from "../services/authService";
import { cartService } from "../services/cartService";
import { setStoredToken, removeStoredToken, getStoredToken } from "../lib/api";
import type { ApiAuthResponse } from "../types/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: SessionUser | null;
  authModal: AuthModalView;
  pendingEmail: string | null;
  openLogin: () => void;
  openRegister: () => void;
  openReset: () => void;
  closeAuth: () => void;
  registerCustomer: (params: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  registerSeller: (params: {
    shopName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (params: {
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<SessionUser>;
  verifyEmail: (params: {
    email: string;
    verificationCode: number;
  }) => Promise<SessionUser>;
  logout: () => Promise<void>;
  updateProfile: (params: { fullName: string }) => void;
}

// ─── Session storage helpers ──────────────────────────────────────────────────
const SESSION_KEY = "foda_session";

function getSession(): SessionUser | null {
  try {
    const raw = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!raw || !getStoredToken()) return null;
    return raw as SessionUser;
  } catch {
    return null;
  }
}

function saveSession(session: SessionUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

function sessionFromResponse(data: ApiAuthResponse): SessionUser {
  if (data.customer) {
    return {
      id: data.customer.id,
      fullName: data.customer.fullName,
      email: data.customer.email,
      role: "customer",
      isActive: true,
    };
  }
  return {
    id: data.seller!.id,
    fullName: data.seller!.shopName,
    email: data.seller!.email,
    role: "seller",
    isActive: data.seller!.isActive,
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(getSession);
  const [authModal, setAuthModal] = useState<AuthModalView>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const openLogin = useCallback(() => setAuthModal("login"), []);
  const openRegister = useCallback(() => setAuthModal("register"), []);
  const openReset = useCallback(() => setAuthModal("reset"), []);
  const closeAuth = useCallback(() => {
    setAuthModal(null);
    setPendingEmail(null);
  }, []);

  // ── Register Customer ──────────────────────────────────────────────────────
  const registerCustomer = useCallback(
    async (params: {
      fullName: string;
      email: string;
      password: string;
    }): Promise<void> => {
      await authService.registerCustomer(params);
      setPendingEmail(params.email);
      setAuthModal("verify");
    },
    [],
  );

  // ── Register Seller ────────────────────────────────────────────────────────
  const registerSeller = useCallback(
    async (params: {
      shopName: string;
      email: string;
      password: string;
    }): Promise<void> => {
      await authService.registerSeller(params);
      setPendingEmail(params.email);
      setAuthModal("verify");
    },
    [],
  );

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (params: {
      email: string;
      password: string;
      role: UserRole;
    }): Promise<SessionUser> => {
      const data = await authService.login({
        email: params.email,
        password: params.password,
        role: params.role,
      });
      setStoredToken(data.accessToken);
      const session = sessionFromResponse(data);
      saveSession(session);
      setUser(session);
      setAuthModal(null);
      return session;
    },
    [],
  );

  // ── Verify Email ───────────────────────────────────────────────────────────
  const verifyEmail = useCallback(
    async (params: {
      email: string;
      verificationCode: number;
    }): Promise<SessionUser> => {
      const data = await authService.verifyEmail(params);
      setStoredToken(data.accessToken);
      const session = sessionFromResponse(data);
      saveSession(session);
      setUser(session);
      setPendingEmail(null);
      setAuthModal(null);
      // Create the cart for the customer right after successful registration
      if (session.role === "customer") {
        cartService.createCart().catch(() => {});
      }
      return session;
    },
    [],
  );

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch {
      // ignore — still clear local state regardless
    } finally {
      removeStoredToken();
      clearSession();
      setUser(null);
    }
  }, []);

  // ── Update Profile (local only — no API endpoint currently) ───────────────
  const updateProfile = useCallback(
    ({ fullName }: { fullName: string }): void => {
      if (!user) return;
      const updated: SessionUser = { ...user, fullName };
      saveSession(updated);
      setUser(updated);
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        authModal,
        pendingEmail,
        openLogin,
        openRegister,
        openReset,
        closeAuth,
        registerCustomer,
        registerSeller,
        login,
        verifyEmail,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
