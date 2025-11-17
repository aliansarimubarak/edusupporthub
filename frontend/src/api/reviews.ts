import { api } from "./client";

export interface Review {
  id: string;
  orderId: string;
  studentId: string;
  expertId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const ReviewsAPI = {
  async create(payload: {
    orderId: string;
    expertId: string;
    rating: number;
    comment: string;
  }) {
    const res = await api.post<Review>("/reviews", payload);
    return res.data;
  },

  async listForExpert(expertId: string) {
    const res = await api.get<Review[]>(`/reviews/expert/${expertId}`);
    return res.data;
  },
};
