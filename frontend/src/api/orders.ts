import { api } from "./client";

export interface Order {
  id: string;
  agreedPrice: number;
  status: string;
  createdAt: string;
  assignment: {
    id: string;
    title: string;
  };
  student: { id: string; name: string };
  expert: { id: string; name: string };
}

export interface Deliverable {
  id: string;
  type: string;
  filePath: string;
  originalName: string;
  mimeType: string;
  size: number;
  isVerified: boolean;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
}

export interface AdminOrderDetail {
  id: string;
  status: string;
  agreedPrice: number;
  createdAt: string;
  updatedAt: string;
  assignment: {
    id: string;
    title: string;
    subject: string;
    academicLevel: string;
    deadline: string;
  };
  student: {
    id: string;
    name: string;
    email: string;
  };
  expert: {
    id: string;
    name: string;
    email: string;
  };
  deliverables: Deliverable[];
}


export const OrdersAPI = {
  async listMine() {
    const res = await api.get<Order[]>("/orders/mine");
    return res.data;
  },

  async getById(id: string) {
    const res = await api.get<Order>(`/orders/${id}`);
    return res.data;
  },

  // async complete(id: string) {
  //   const res = await api.post<Order>(`/orders/${id}/complete`);
  //   return res.data;
  // },

  async complete(id: string, rating: number, comment?: string) {
    const res = await api.post<Order>(`/orders/${id}/complete`, {
      rating,
      comment,
    });
    return res.data;
  },

  async getAdminOrder(id: string) {
    const res = await api.get<AdminOrderDetail>(`/admin/orders/${id}`);
    return res.data;
  },
};
