import { api } from "./client";

// Preview of expert's recent completed assignments
export interface ExpertRecentAssignmentPreview {
  id: string;
  assignmentId: string;
  title: string;
  subject: string;
  completedAt: string;
  solutionPdfPath: string | null; // first-page PDF preview
}

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

  // NEW FIELD: last 10 completed assignments + PDF previews
  expertRecentAssignments?: ExpertRecentAssignmentPreview[];
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
