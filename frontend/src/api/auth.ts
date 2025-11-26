import { api } from "./client";

export type UserRole = "STUDENT" | "EXPERT" | "ADMIN";

export type ExpertVerificationStatus =
  | "UNVERIFIED"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";

export interface User {
  // id: string;
  // name: string;
  // email: string;
  // role: UserRole;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  expertProfile?: ExpertProfile | null;
}

interface AuthResponse {
  user: User;
  token: string;
}

export interface ExpertProfile {
  id: string;
  bio?: string | null;
  degrees: string[];
  subjects: string[];
  languages: string[];
  rating: number;
  completedOrders: number;
  responseTimeMin?: number | null;
  isVerified: boolean;
  verificationStatus: ExpertVerificationStatus;
  verificationRequestMessage?: string | null;
  verificationAdminNote?: string | null;
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

    async requestPasswordReset(email: string) {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data as { message: string };
  },

  async resetPassword(token: string, password: string) {
    const res = await api.post("/auth/reset-password", {
      token,
      password,
    });
    return res.data as { message: string };
  },

};
