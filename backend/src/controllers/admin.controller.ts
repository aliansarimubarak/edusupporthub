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
