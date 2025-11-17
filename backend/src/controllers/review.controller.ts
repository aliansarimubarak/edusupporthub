// review controller placeholder

import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  createReview,
  listReviewsForExpert,
} from "../services/review.service";

export const createReviewHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== "STUDENT") {
      return res.status(403).json({ error: "Only students can leave reviews" });
    }

    const { orderId, expertId, rating, comment } = req.body;
    if (!orderId || !expertId || typeof rating !== "number") {
      return res.status(400).json({ error: "Missing fields" });
    }

    const review = await createReview({
      orderId,
      studentId: req.user.id,
      expertId,
      rating,
      comment: comment || "",
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

export const listReviewsForExpertHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { expertId } = req.params;
    const reviews = await listReviewsForExpert(expertId);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};
