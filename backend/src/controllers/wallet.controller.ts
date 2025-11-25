import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  getExpertWalletSummary,
  createPayoutRequest,
  listPayoutRequestsForExpert,
} from "../services/wallet.service";

export const getMyWalletSummaryHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const summary = await getExpertWalletSummary(req.user.id);
    res.json(summary);
  } catch (err) {
    next(err);
  }
};

export const listMyPayoutRequestsHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const items = await listPayoutRequestsForExpert(req.user.id);
    res.json(items);
  } catch (err) {
    next(err);
  }
};

export const createPayoutRequestHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { amount, method, accountDetails, note, currency } = req.body;

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      return res.status(400).json({ error: "Invalid payout amount" });
    }
    if (!method || typeof method !== "string") {
      return res.status(400).json({ error: "Payout method is required" });
    }
    if (!accountDetails || typeof accountDetails !== "string") {
      return res
        .status(400)
        .json({ error: "Account / wallet details are required" });
    }

    const payout = await createPayoutRequest(req.user.id, {
      amount: parsedAmount,
      method,
      accountDetails,
      note,
      currency,
    });

    res.status(201).json(payout);
  } catch (err) {
    next(err);
  }
};
