import { api } from "./client";

export interface Offer {
  id: string;
  assignmentId: string;
  price: number;
  deliveryDays: number;
  message: string;
  status: string;
  createdAt: string;
  expert: {
    id: string;
    name: string;
    expertProfile?: {
      rating: number;
      completedOrders: number;
    } | null;
  };
}

export const OffersAPI = {
  async create(payload: {
    assignmentId: string;
    price: number;
    deliveryDays: number;
    message: string;
  }) {
    const res = await api.post<Offer>("/offers", payload);
    return res.data;
  },

  async listForAssignment(assignmentId: string) {
    const res = await api.get<Offer[]>(`/offers/assignment/${assignmentId}`);
    return res.data;
  },

  async accept(offerId: string) {
    const res = await api.post("/offers/accept", { offerId });
    return res.data;
  },
};
