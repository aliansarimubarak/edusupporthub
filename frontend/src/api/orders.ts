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

export const OrdersAPI = {
  async listMine() {
    const res = await api.get<Order[]>("/orders/mine");
    return res.data;
  },

  async getById(id: string) {
    const res = await api.get<Order>(`/orders/${id}`);
    return res.data;
  },

  async complete(id: string) {
    const res = await api.post<Order>(`/orders/${id}/complete`);
    return res.data;
  },
};
