import { api } from "./client";

export interface Message {
  id: string;
  orderId: string;
  text: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
  };
}

export const MessagesAPI = {
  async listForOrder(orderId: string) {
    const res = await api.get<Message[]>(`/messages/order/${orderId}`);
    return res.data;
  },

  async send(orderId: string, text: string) {
    const res = await api.post<Message>("/messages", { orderId, text });
    return res.data;
  },
};
