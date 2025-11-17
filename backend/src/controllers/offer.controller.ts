// offer controller placeholder

import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  createOffer,
  listOffersForAssignment,
  acceptOffer,
} from "../services/offer.service";

export const createOfferHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== "EXPERT") {
      return res.status(403).json({ error: "Only experts can send offers" });
    }

    const { assignmentId, price, deliveryDays, message } = req.body;

    if (!assignmentId || !price || !deliveryDays || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const offer = await createOffer({
      assignmentId,
      expertId: req.user.id,
      price,
      deliveryDays,
      message,
    });

    res.status(201).json(offer);
  } catch (err) {
    next(err);
  }
};

export const listOffersForAssignmentHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assignmentId } = req.params;
    const offers = await listOffersForAssignment(assignmentId);
    res.json(offers);
  } catch (err) {
    next(err);
  }
};

export const acceptOfferHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== "STUDENT") {
      return res.status(403).json({ error: "Only students can accept offers" });
    }
    const { offerId } = req.body;
    if (!offerId) {
      return res.status(400).json({ error: "Missing offerId" });
    }
    const order = await acceptOffer(offerId, req.user.id);
    res.json(order);
  } catch (err) {
    next(err);
  }
};
