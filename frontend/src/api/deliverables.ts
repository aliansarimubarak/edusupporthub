import { api } from "./client";

export interface Deliverable {
  id: string;
  orderId: string;
  uploaderId: string;
  type: string;
  filePath: string;
  originalName: string;
  mimeType: string;
  size: number;
  isVerified: boolean;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
  uploader?: {
    id: string;
    name: string;
  };
}

export const DeliverablesAPI = {
  async upload(
    orderId: string, 
    file: File, 
    type: "DRAFT" | "FINAL" = "FINAL"
  ) {
    const form = new FormData();
    form.append("file", file);
    form.append("type", type);

    const res = await api.post<Deliverable>(
      `/deliverables/order/${orderId}`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  },

  async listForOrder(orderId: string) {
    const res = await api.get<Deliverable[]>(`/deliverables/order/${orderId}`);
    return res.data;
  },

  async verify(deliverableId: string) {
    const res = await api.patch<Deliverable>(
      `/deliverables/${deliverableId}/verify`,
      {}
    );
    return res.data;
  },
};
