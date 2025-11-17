import { api } from "./client";

export type UserRole = "STUDENT" | "EXPERT" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const AuthAPI = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    role: "student" | "expert";
  }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/register", data);
    return res.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/login", { email, password });
    return res.data;
  },

  async me() {
    const res = await api.get<{ user: User | null }>("/auth/me");
    return res.data;
  },
};
