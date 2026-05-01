// src/services/auth.service.ts
// Tumhare Auth.tsx page ke liye — mockLogin ko yeh replace karega

import api from "./api";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "USER" | "ADMIN";
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message: string;
  isNewUser?: boolean;
}

const authService = {
  // ─── OTP Flow ───────────────────────────────────────────
  sendOTP: async (phone: string): Promise<{ success: boolean; message: string; otp?: string }> => {
    const { data } = await api.post("/auth/send-otp", { phone });
    return data;
  },

  verifyOTP: async (phone: string, otp: string, name?: string): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/verify-otp", { phone, otp, name });
    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  },

  // ─── Email/Password Flow ────────────────────────────────
  register: async (
    name: string,
    phone: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/register", { name, phone, email, password });
    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  },

  login: async (phone: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/login", { phone, password });
    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  },

  // ─── Helpers ────────────────────────────────────────────
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth";
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem("token");
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get("/auth/me");
    return data.user;
  },

  updateProfile: async (name: string, email: string): Promise<User> => {
    const { data } = await api.put("/auth/profile", { name, email });
    return data.user;
  },
};

export default authService;
