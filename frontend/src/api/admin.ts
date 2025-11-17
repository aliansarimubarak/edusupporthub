import { api } from "./client";
import type { User } from "./auth";
import type { Order } from "./orders";

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
};
