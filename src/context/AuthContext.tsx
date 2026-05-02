// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import authService, { User } from "../services/auth.service";
import api from "../services/api";

export type SelectedRole = "user" | "contractor" | null;

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  selectedRole: SelectedRole;
  setSelectedRole: (role: SelectedRole) => void;
  isContractor: boolean;
  isUser: boolean;
  isAdmin: boolean;
  login: (phone: string, password: string) => Promise<void>;
  loginWithOTP: (phone: string, otp: string, name?: string) => Promise<void>;
  register: (name: string, phone: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  sendOTP: (phone: string) => Promise<{ otp?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ✅ Backend se check karo — phone se contractor hai ya nahi
async function checkIfContractor(phone: string): Promise<boolean> {
  try {
    const { data } = await api.get(`/contractors/check?phone=${phone}`);
    return !!data.isContractor;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRoleState] = useState<SelectedRole>(() => {
    return (localStorage.getItem("selectedRole") as SelectedRole) || null;
  });

  useEffect(() => {
    const stored = authService.getCurrentUser();
    if (stored && authService.isLoggedIn()) {
      setUser(stored);
      if (stored.role === "ADMIN") {
        setSelectedRoleState("user");
      }
      authService.getProfile().then(setUser).catch(() => authService.logout());
    }
    setIsLoading(false);
  }, []);

  const setSelectedRole = (role: SelectedRole) => {
    setSelectedRoleState(role);
    if (role) localStorage.setItem("selectedRole", role);
    else localStorage.removeItem("selectedRole");
  };

  // ✅ FIX: Login ke baad HAMESHA database se check karo
  const login = async (phone: string, password: string) => {
    const result = await authService.login(phone, password);
    if (result.success) {
      setUser(result.user);

      // Admin
      if (result.user.role === "ADMIN") {
        setSelectedRole("user");
        return;
      }

      // ✅ FIX: localStorage ignore karo — hamesha fresh database check karo
      const isContractorUser = await checkIfContractor(phone);
      if (isContractorUser) {
        setSelectedRole("contractor");
      } else {
        setSelectedRole("user");
      }
    } else {
      throw new Error(result.message);
    }
  };

  const loginWithOTP = async (identifier: string, otp: string, name?: string) => {
    const result = await authService.verifyOTP(identifier, otp, name);
    if (result.success) {
      setUser(result.user);

      if (result.user.role === "ADMIN") {
        setSelectedRole("user");
        return;
      }

      // ✅ FIX: OTP login mein bhi fresh check karo
      const isContractorUser = await checkIfContractor(result.user.phone);
      if (isContractorUser) {
        setSelectedRole("contractor");
      } else {
        setSelectedRole("user");
      }
    } else {
      throw new Error(result.message);
    }
  };

  const register = async (name: string, phone: string, email: string, password: string) => {
    const result = await authService.register(name, phone, email, password);
    if (result.success) {
      setUser(result.user);
      // ✅ FIX: Register ke baad role clear karo — user hai contractor nahi
      setSelectedRole("user");
    } else {
      throw new Error(result.message);
    }
  };

  const sendOTP = async (phone: string) => {
    const result = await authService.sendOTP(phone);
    if (!result.success) throw new Error(result.message);
    return { otp: result.otp };
  };

  // ✅ FIX: Logout pe localStorage bhi clear karo
  const logout = () => {
    authService.logout();
    setUser(null);
    setSelectedRoleState(null);
    localStorage.removeItem("selectedRole");
  };

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn: !!user, isLoading,
      selectedRole, setSelectedRole,
      isContractor: selectedRole === "contractor",
      isUser: selectedRole === "user",
      isAdmin: user?.role === "ADMIN",
      login, loginWithOTP, register, logout, sendOTP,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}