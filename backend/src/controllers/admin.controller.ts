// admin controller placeholder

import { Request, Response, NextFunction } from "express";
import {
  getAdminStats,
  adminListUsers,
  adminListOrders,
  adminListExpertsForVerification,
  adminUpdateExpertVerification,
} from "../services/admin.service";
import {
  adminListPayoutRequests,
  adminUpdatePayoutRequestStatus,
} from "../services/wallet.service";
import { PayoutRequestStatus, ExpertVerificationStatus } from "@prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";
import { returnOrderForRevision } from "../services/order.service";


export const getStatsHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

export const listUsersHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await adminListUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const listOrdersHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await adminListOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const listPayoutRequestsHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await adminListPayoutRequests();
    res.json(items);
  } catch (err) {
    next(err);
  }
};



export const updatePayoutRequestStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: PayoutRequestStatus };

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const updated = await adminUpdatePayoutRequestStatus(id, status);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};



export const listExpertVerificationHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const experts = await adminListExpertsForVerification();
    res.json(experts);
  } catch (err) {
    next(err);
  }
};

export const updateExpertVerificationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { status, adminNote } = req.body as {
      status: ExpertVerificationStatus;
      adminNote?: string;
    };

    if (!status) {
      return res.status(400).json({ error: "Verification status is required" });
    }

    const updated = await adminUpdateExpertVerification({
      userId,
      status,
      adminNote,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};


export const adminReturnOrderForRevisionHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { id } = req.params;
    const { reason } = req.body as { reason?: string };

    const updated = await returnOrderForRevision(id, req.user.id, reason);

    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updated);
  } catch (err: any) {
    if (err?.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
};
