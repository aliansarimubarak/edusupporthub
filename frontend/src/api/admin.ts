import { api } from "./client";
import type { User } from "./auth";
import type { Order } from "./orders";

export type PayoutRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "PAID";

export type ExpertVerificationStatus =
  | "UNVERIFIED"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";

export interface PayoutRequest {
  id: string;
  amount: number;
  currency: string;
  method: string;
  accountDetails: string;
  note?: string | null;
  status: PayoutRequestStatus;
  createdAt: string;
  updatedAt: string;
  expert: {
    id: string;
    name: string;
    email: string;
  };
}


export interface AdminExpertProfileForVerification {
  id: string;
  bio?: string | null;
  degrees: string[];
  subjects: string[];
  languages: string[];
  verificationStatus: ExpertVerificationStatus;
  verificationRequestMessage?: string | null;
  verificationAdminNote?: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const AdminAPI = {
  async stats() {
    const res = await api.get<{
      activeUsers: number;
      orders: number;
      revenue: number;
      averageRating: number;
    }>("/admin/stats");
    return res.data;
  },

  async users() {
    const res = await api.get<User[]>("/admin/users");
    return res.data;
  },

  async orders() {
    const res = await api.get<Order[]>("/admin/orders");
    return res.data;
  },

  async payoutRequests() {
    const res = await api.get<PayoutRequest[]>("/admin/payout-requests");
    return res.data;
  },
  
  async updatePayoutRequestStatus(id: string, status: PayoutRequestStatus) {
    const res = await api.put<PayoutRequest>(`/admin/payout-requests/${id}`, {
      status,
    });
    return res.data;
  },

  async returnOrderForRevision(orderId: string, reason?: string) {
    const res = await api.patch<Order>(
      `/admin/orders/${orderId}/return-for-revision`,
      { reason }
    );
    return res.data;
  },

  async expertVerificationList() {
    const res = await api.get<AdminExpertProfileForVerification[]>(
      "/admin/experts/verification"
    );
    return res.data;
  },

  async updateExpertVerification(
    userId: string,
    status: ExpertVerificationStatus,
    adminNote?: string
  ) {
    const res = await api.put<AdminExpertProfileForVerification>(
      `/admin/experts/${userId}/verification`,
      { status, adminNote }
    );
    return res.data;
  },
};
