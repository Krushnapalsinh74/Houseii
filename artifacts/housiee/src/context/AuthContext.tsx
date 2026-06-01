import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  authModalOpen: boolean;
  authModalMode: "login" | "register";
}

const AuthContext = createContext<AuthContextValue | null>(null);

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts?.headers ?? {}) },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Request failed");
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  const fetchMe = useCallback(async () => {
    try {
      // Check local storage for mock session first
      const stored = localStorage.getItem("mock_user");
      if (stored) {
        setUser(JSON.parse(stored));
        setLoading(false);
        return;
      }
      
      const data = await apiFetch("/api/auth/me");
      if (data && typeof data === 'object' && 'id' in data) {
        setUser(data as AuthUser);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (email: string, password: string) => {
    // Mock authentication for frontend-only testing
    const mockUser: AuthUser = {
      id: 1,
      name: email.split('@')[0],
      email,
      phone: null,
      role: email.toLowerCase().includes("admin") ? "admin" : "user",
    };
    localStorage.setItem("mock_user", JSON.stringify(mockUser));
    setUser(mockUser);
    setAuthModalOpen(false);
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    // Mock authentication for frontend-only testing
    const mockUser: AuthUser = {
      id: Math.floor(Math.random() * 1000),
      name,
      email,
      phone,
      role: email.toLowerCase().includes("admin") ? "admin" : "user",
    };
    localStorage.setItem("mock_user", JSON.stringify(mockUser));
    setUser(mockUser);
    setAuthModalOpen(false);
  };

  const logout = async () => {
    try {
      localStorage.removeItem("mock_user");
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout to ensure local state is cleared
    } finally {
      setUser(null);
    }
  };

  const openAuthModal = (mode: "login" | "register" = "login") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => setAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, openAuthModal, closeAuthModal, authModalOpen, authModalMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
