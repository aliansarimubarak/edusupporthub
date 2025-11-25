
import { api } from "./client";

export interface  Assignment {
  id: string;
  title: string;
  description: string;
  faculty?: string;
  subject: string;
  academicLevel: string;
  deadline: string;
  status: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  attachmentPath?: string | null;
}

export const AssignmentsAPI = {
  /** 
   * Create assignment (with file upload)
   * Accepts FormData instead of JSON
   */
  async create(formData: FormData) {
    const res = await api.post<Assignment>("/assignments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

  // Use to update the assignment in case any problem occure
  async update(id: string, payload: any) {
    const res = await api.put(`/assignments/${id}`, payload);
    return res.data;
  },
};

