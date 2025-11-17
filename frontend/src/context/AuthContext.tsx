import {
  createContext,
  useContext,
  useEffect,
  useState,
  } from "react";
import type { ReactNode } from "react"
import type { User, UserRole } from "../api/auth";
import { AuthAPI } from "../api/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: "student" | "expert";
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const getDashboardPathForRole = (role: UserRole) => {
  if (role === "STUDENT") return "/student";
  if (role === "EXPERT") return "/expert";
  if (role === "ADMIN") return "/admin";
  return "/";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    AuthAPI.me()
      .then((res) => {
        setUser(res.user ?? null);
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await AuthAPI.login(email, password);
    localStorage.setItem("authToken", res.token);
    setUser(res.user);
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role: "student" | "expert";
  }) => {
    const res = await AuthAPI.register(data);
    localStorage.setItem("authToken", res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    //window.location.href = "/";
    // navigate("/", { replace: true }); // 👈 redirect to homepage
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
