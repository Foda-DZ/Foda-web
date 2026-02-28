import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { SessionUser, StoredUser, AuthModalView, UserRole } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PendingVerification {
  userId: number;
  email: string;
  code: string;
}

interface AuthContextValue {
  user: SessionUser | null;
  authModal: AuthModalView;
  pendingVerification: PendingVerification | null;
  openLogin: () => void;
  openRegister: () => void;
  openReset: () => void;
  closeAuth: () => void;
  register: (params: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole;
  }) => { success: true } | { error: string };
  login: (params: {
    email: string;
    password: string;
  }) => { success: true; session: SessionUser } | { error: string };
  verifyEmail: (code: string) => { success: true; session: SessionUser } | { error: string };
  resendCode: () => void;
  logout: () => void;
  updateProfile: (params: {
    firstName: string;
    lastName: string;
  }) => { success: true } | { error: string };
  changePassword: (params: {
    currentPassword: string;
    newPassword: string;
  }) => { success: true } | { error: string };
  sendReset: (params: { email: string }) => { success: true; exists: boolean };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const USERS_KEY = "foda_users";
const SESSION_KEY = "foda_session";

function getUsers(): StoredUser[] {
  try {
    const raw = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as StoredUser[];
    // Backward-compat: existing users without role/isActive default to buyer/true
    return raw.map((u) => ({ role: "buyer" as UserRole, isActive: true, ...u }));
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): SessionUser | null {
  try {
    const raw = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!raw) return null;
    // Backward-compat: existing sessions without role/isActive default to buyer/true
    return { role: "buyer" as UserRole, isActive: true, ...raw } as SessionUser;
  } catch {
    return null;
  }
}

function makeCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(getSession);
  const [authModal, setAuthModal] = useState<AuthModalView>(null);
  const [pendingVerification, setPendingVerification] = useState<PendingVerification | null>(null);

  const openLogin = useCallback(() => setAuthModal("login"), []);
  const openRegister = useCallback(() => setAuthModal("register"), []);
  const openReset = useCallback(() => setAuthModal("reset"), []);
  const closeAuth = useCallback(() => {
    setAuthModal(null);
    setPendingVerification(null);
  }, []);

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(
    ({ firstName, lastName, email, password, role = "buyer" }: {
      firstName: string; lastName: string; email: string; password: string; role?: UserRole;
    }) => {
      const users = getUsers();
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { error: "An account with this email already exists." };
      }
      const newUser: StoredUser = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        password, // demo only — never store plain-text passwords in production
        emailVerified: false,
        createdAt: new Date().toISOString(),
        role,
        isActive: role === "seller" ? false : true,
      };
      saveUsers([...users, newUser]);
      const code = makeCode();
      setPendingVerification({ userId: newUser.id, email, code });
      setAuthModal("verify");
      return { success: true as const };
    },
    [],
  );

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(
    ({ email, password }: { email: string; password: string }) => {
      const users = getUsers();
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      );
      if (!found) return { error: "Incorrect email or password." };

      const session: SessionUser = {
        id: found.id,
        firstName: found.firstName,
        lastName: found.lastName,
        email: found.email,
        role: found.role,
        isActive: found.isActive,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      setAuthModal(null);
      return { success: true as const, session };
    },
    [],
  );

  // ── Verify email with the 6-digit code ────────────────────────────────────
  const verifyEmail = useCallback(
    (inputCode: string) => {
      if (!pendingVerification) return { error: "No pending verification." };
      if (inputCode.trim() !== pendingVerification.code) {
        return { error: "invalid" };
      }
      const users = getUsers();
      const idx = users.findIndex((u) => u.id === pendingVerification.userId);
      if (idx === -1) return { error: "User not found." };

      users[idx] = { ...users[idx], emailVerified: true };
      saveUsers(users);

      const u = users[idx];
      const session: SessionUser = {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      setPendingVerification(null);
      setAuthModal(null);
      return { success: true as const, session };
    },
    [pendingVerification],
  );

  // ── Resend: generate a fresh code ─────────────────────────────────────────
  const resendCode = useCallback(() => {
    if (!pendingVerification) return;
    setPendingVerification({ ...pendingVerification, code: makeCode() });
  }, [pendingVerification]);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    ({ firstName, lastName }: { firstName: string; lastName: string }) => {
      const users = getUsers();
      const idx = users.findIndex((u) => u.id === user?.id);
      if (idx === -1) return { error: "User not found." };
      users[idx] = { ...users[idx], firstName, lastName };
      saveUsers(users);
      const session: SessionUser = { ...user!, firstName, lastName };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      return { success: true as const };
    },
    [user],
  );

  const changePassword = useCallback(
    ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      const users = getUsers();
      const idx = users.findIndex((u) => u.id === user?.id);
      if (idx === -1) return { error: "User not found." };
      if (users[idx].password !== currentPassword)
        return { error: "Current password is incorrect." };
      users[idx] = { ...users[idx], password: newPassword };
      saveUsers(users);
      return { success: true as const };
    },
    [user],
  );

  const sendReset = useCallback(({ email }: { email: string }) => {
    const users = getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    return { success: true as const, exists };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authModal,
        pendingVerification,
        openLogin,
        openRegister,
        openReset,
        closeAuth,
        register,
        login,
        verifyEmail,
        resendCode,
        logout,
        updateProfile,
        changePassword,
        sendReset,
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
