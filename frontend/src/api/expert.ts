import { api } from "./client";
import type { ExpertProfile } from "./auth";

export interface UpdateExpertProfilePayload {
  bio?: string;
  degrees?: string[];
  subjects?: string[];
  languages?: string[];
  responseTimeMin?: number | null;
}

export const ExpertAPI = {
  async getMyProfile() {
    const res = await api.get<ExpertProfile | null>("/experts/me");
    return res.data;
  },

  async updateMyProfile(payload: UpdateExpertProfilePayload) {
    const res = await api.put<ExpertProfile>("/experts/me", payload);
    return res.data;
  },

  async requestVerification(message?: string) {
    const res = await api.post<ExpertProfile>("/experts/verification-request", {
      message,
    });
    return res.data;
  },
};
