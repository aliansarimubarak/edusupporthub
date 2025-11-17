import { api } from "./client";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  academicLevel: string;
  deadline: string;
  status: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
}

export const AssignmentsAPI = {
  async create(payload: {
    title: string;
    description: string;
    subject: string;
    academicLevel: string;
    deadline: string;
    budgetMin?: number;
    budgetMax?: number;
  }) {
    const res = await api.post<Assignment>("/assignments", payload);
    return res.data;
  },

  async listOpen() {
    const res = await api.get<Assignment[]>("/assignments/open");
    return res.data;
  },

  async listMine() {
    const res = await api.get<Assignment[]>("/assignments/mine");
    return res.data;
  },

  async getById(id: string) {
    const res = await api.get<Assignment>(`/assignments/${id}`);
    return res.data;
  },
};
