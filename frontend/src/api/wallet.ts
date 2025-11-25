import { api } from "./client";

export interface CreateWithdrawalPayload {
  amount: number;
  method: string;
  accountDetails: string;
  note?: string;
  currency?: string;
}

export const WalletAPI = {
  async getSummary() {
    const res = await api.get("/wallet/summary");
    return res.data;
  },

  async requestWithdrawal(payload: CreateWithdrawalPayload) {
    const res = await api.post("/wallet/withdrawals", payload);
    return res.data;
  },

  async listWithdrawals() {
    const res = await api.get("/wallet/withdrawals");
    return res.data;
  },
};
