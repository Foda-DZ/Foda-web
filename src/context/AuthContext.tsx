import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import type { SessionUser, AuthModalView, UserRole } from "../types";
import { authService } from "../services/authService";
import { cartService } from "../services/cartService";
import { sellerService } from "../services/sellerService";
import { setStoredToken, removeStoredToken, getStoredToken } from "../lib/api";
import type { ApiAuthResponse } from "../types/api";

// ─── Types ────────────────────────────────────────────────────────────────────
/** Raw user object the backend embeds in the OAuth callback fragment. */
export interface OAuthSessionUser {
  id: string;
  email: string;
  // customer
  fullName?: string;
  phoneNumber?: string | null;
  imageUrl?: { url: string } | null;
  // seller
  shopName?: string;
  phone?: number | null;
  logoUrl?: string | null;
  isActive?: boolean;
}

interface AuthContextValue {
  user: SessionUser | null;
  authReady: boolean;
  authModal: AuthModalView;
  pendingEmail: string | null;
  authCustomerOnly: boolean;
  authRedirectTo: string | null;
  openLogin: (options?: {
    customerOnly?: boolean;
    redirectTo?: string;
  }) => void;
  openRegister: (options?: {
    customerOnly?: boolean;
    redirectTo?: string;
  }) => void;
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
  completeOAuthLogin: (params: {
    accessToken: string;
    role: UserRole;
    isNew: boolean;
    user: OAuthSessionUser;
  }) => SessionUser;
  verifyEmail: (params: {
    email: string;
    verificationCode: number;
  }) => Promise<SessionUser>;
  logout: () => Promise<void>;
  updateProfile: (params: { fullName: string }) => void;
  updateSellerSettings: (params: {
    shopName?: string;
    phone?: number | null;
    logoUrl?: string | null;
    address?: { wilaya: string; commune: string } | null;
  }) => void;
  completeSellerSetup: (params: {
    wilaya: string;
    commune: string;
    deliveryCompany: string;
    seller_delivery_token?: string;
  }) => Promise<void>;
}

// ─── Session storage helpers ──────────────────────────────────────────────────
const SESSION_KEY = "foda_session";

function getSession(): SessionUser | null {
  try {
    const raw = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!raw) return null;
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

type SellerSetupStatus = "pending" | "complete";

interface SellerSetupRecord {
  status: SellerSetupStatus;
  deliveryCompany?: string;
  seller_delivery_token?: string;
  connectionLabel?: string;
  address?: { wilaya: string; commune: string };
}

const SELLER_SETUP_PREFIX = "foda_seller_setup";

function sellerSetupKey(userId: string): string {
  return `${SELLER_SETUP_PREFIX}_${userId}`;
}

function getSellerSetupRecord(userId: string): SellerSetupRecord | null {
  try {
    const raw = JSON.parse(
      localStorage.getItem(sellerSetupKey(userId)) || "null",
    );
    if (!raw || typeof raw !== "object") return null;
    return raw as SellerSetupRecord;
  } catch {
    return null;
  }
}

function saveSellerSetupRecord(
  userId: string,
  record: SellerSetupRecord,
): void {
  localStorage.setItem(sellerSetupKey(userId), JSON.stringify(record));
}

function applySellerSetup(session: SessionUser): SessionUser {
  if (session.role !== "seller") return session;
  const record = getSellerSetupRecord(session.id);
  if (!record) return session;
  return {
    ...session,
    sellerSetupStatus: record.status,
    ...(record.deliveryCompany !== undefined && {
      deliveryCompany: record.deliveryCompany,
    }),
    ...(record.seller_delivery_token !== undefined && {
      seller_delivery_token: record.seller_delivery_token,
    }),
    ...(record.connectionLabel !== undefined && {
      connectionLabel: record.connectionLabel,
    }),
    ...(record.address !== undefined && { address: record.address }),
  };
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
  const s = data.seller!;
  return {
    id: s.id,
    fullName: s.shopName,
    email: s.email,
    role: "seller",
    isActive: s.isActive,
    shopName: s.shopName,
    phone: s.phone ?? null,
    logoUrl: s.logoUrl ?? null,
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authModal, setAuthModal] = useState<AuthModalView>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [authCustomerOnly, setAuthCustomerOnly] = useState(false);
  const [authRedirectTo, setAuthRedirectTo] = useState<string | null>(null);

  // ── Rehydrate session on app boot (and silently refresh token if needed) ──
  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const stored = getSession();
      if (!stored) {
        if (active) {
          setUser(null);
          setAuthReady(true);
        }
        return;
      }

      const hydrated = applySellerSetup(stored);
      if (active) setUser(hydrated);

      const token = getStoredToken();
      if (token) {
        if (active) setAuthReady(true);
        return;
      }

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
        const response = await fetch(`${baseUrl}/auth/refresh`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("refresh failed");
        const data = (await response.json()) as { accessToken?: string };
        if (!data.accessToken) throw new Error("missing token");
        setStoredToken(data.accessToken);
      } catch {
        removeStoredToken();
        clearSession();
        if (active) setUser(null);
      } finally {
        if (active) setAuthReady(true);
      }
    };

    void restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const openLogin = useCallback(
    (options?: { customerOnly?: boolean; redirectTo?: string }) => {
      setAuthCustomerOnly(Boolean(options?.customerOnly));
      setAuthRedirectTo(options?.redirectTo ?? null);
      setAuthModal("login");
    },
    [],
  );
  const openRegister = useCallback(
    (options?: { customerOnly?: boolean; redirectTo?: string }) => {
      setAuthCustomerOnly(Boolean(options?.customerOnly));
      setAuthRedirectTo(options?.redirectTo ?? null);
      setAuthModal("register");
    },
    [],
  );
  const openReset = useCallback(() => setAuthModal("reset"), []);
  const closeAuth = useCallback(() => {
    setAuthModal(null);
    setPendingEmail(null);
    setAuthCustomerOnly(false);
    setAuthRedirectTo(null);
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
      const session = applySellerSetup(sessionFromResponse(data));
      saveSession(session);
      setUser(session);
      setAuthModal(null);
      return session;
    },
    [],
  );

  // ── Complete OAuth Login (Google) ──────────────────────────────────────────
  // Called by the /auth/callback page after the backend redirect. Mirrors the
  // session-establishing logic of login()/verifyEmail() but consumes the
  // pre-built user payload from the URL fragment instead of an API call.
  const completeOAuthLogin = useCallback(
    (params: {
      accessToken: string;
      role: UserRole;
      isNew: boolean;
      user: OAuthSessionUser;
    }): SessionUser => {
      setStoredToken(params.accessToken);

      const u = params.user;
      let session: SessionUser =
        params.role === "seller"
          ? {
              id: u.id,
              fullName: u.shopName ?? u.email,
              email: u.email,
              role: "seller",
              isActive: u.isActive ?? true,
              shopName: u.shopName,
              phone: u.phone ?? null,
              logoUrl: u.logoUrl ?? null,
            }
          : {
              id: u.id,
              fullName: u.fullName ?? u.email,
              email: u.email,
              role: "customer",
              isActive: true,
            };

      session = applySellerSetup(session);

      // New sellers still need to finish onboarding (delivery/address setup).
      if (session.role === "seller" && !getSellerSetupRecord(session.id)) {
        saveSellerSetupRecord(session.id, { status: "pending" });
        session = { ...session, sellerSetupStatus: "pending" };
      }

      saveSession(session);
      setUser(session);
      setAuthModal(null);

      // A brand-new customer gets a server-side cart, same as email signup.
      if (params.isNew && session.role === "customer") {
        cartService.createCart().catch(() => {});
      }

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
      let session = applySellerSetup(sessionFromResponse(data));
      if (session.role === "seller" && !getSellerSetupRecord(session.id)) {
        const pendingSellerSession: SessionUser = {
          ...session,
          sellerSetupStatus: "pending",
        };
        saveSellerSetupRecord(session.id, { status: "pending" });
        session = pendingSellerSession;
      }
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

  // ── Update Seller Settings (called after PUT /seller/settings succeeds) ────
  const updateSellerSettings = useCallback(
    (params: {
      shopName?: string;
      phone?: number | null;
      logoUrl?: string | null;
      address?: { wilaya: string; commune: string } | null;
    }): void => {
      if (!user || user.role !== "seller") return;
      const updated: SessionUser = {
        ...user,
        ...(params.shopName !== undefined && {
          shopName: params.shopName,
          fullName: params.shopName,
        }),
        ...(params.phone !== undefined && { phone: params.phone }),
        ...(params.logoUrl !== undefined && { logoUrl: params.logoUrl }),
        ...(params.address !== undefined && { address: params.address }),
      };
      saveSession(updated);
      setUser(updated);
    },
    [user],
  );

  const completeSellerSetup = useCallback(
    async (params: {
      wilaya: string;
      commune: string;
      deliveryCompany: string;
      seller_delivery_token?: string;
    }): Promise<void> => {
      if (!user || user.role !== "seller") return;

      // Call API to complete setup
      const response = await sellerService.completeSellerSetup(params);

      const connectionLabel = response.seller.connection_label;

      // Persist local seller setup record and update session
      saveSellerSetupRecord(user.id, {
        status: "complete",
        deliveryCompany: params.deliveryCompany,
        seller_delivery_token: params.seller_delivery_token,
        connectionLabel,
        address: { wilaya: params.wilaya, commune: params.commune },
      });

      const updated: SessionUser = {
        ...user,
        sellerSetupStatus: "complete",
        deliveryCompany: params.deliveryCompany,
        seller_delivery_token: params.seller_delivery_token,
        connectionLabel,
        address: { wilaya: params.wilaya, commune: params.commune },
      };
      saveSession(updated);
      setUser(updated);
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        authModal,
        pendingEmail,
        authCustomerOnly,
        authRedirectTo,
        openLogin,
        openRegister,
        openReset,
        closeAuth,
        registerCustomer,
        registerSeller,
        login,
        completeOAuthLogin,
        verifyEmail,
        logout,
        updateProfile,
        updateSellerSettings,
        completeSellerSetup,
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
