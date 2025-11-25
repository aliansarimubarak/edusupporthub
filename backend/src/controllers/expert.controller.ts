import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  getExpertProfileForUser,
  upsertExpertProfileForUser,
  requestExpertVerificationForUser,
} from "../services/expert.service";
import { ExpertVerificationStatus } from "@prisma/client";

export const getMyExpertProfileHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const profile = await getExpertProfileForUser(req.user.id);
    // if profile doesn't exist yet, return null (frontend will handle)
    res.json(profile ?? null);
  } catch (err) {
    next(err);
  }
};

export const updateMyExpertProfileHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });

    const { bio, degrees, subjects, languages, responseTimeMin } = req.body;

    // Simple validation – you can replace with Zod later
    if (degrees && !Array.isArray(degrees)) {
      return res.status(400).json({ error: "degrees must be an array of strings" });
    }
    if (subjects && !Array.isArray(subjects)) {
      return res.status(400).json({ error: "subjects must be an array of strings" });
    }
    if (languages && !Array.isArray(languages)) {
      return res.status(400).json({ error: "languages must be an array of strings" });
    }

    const profile = await upsertExpertProfileForUser(req.user.id, {
      bio,
      degrees,
      subjects,
      languages,
      responseTimeMin,
    });

    res.json(profile);
  } catch (err) {
    next(err);
  }
};


export const requestVerificationHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { message } = req.body as { message?: string };

    const updated = await requestExpertVerificationForUser(
      req.user.id,
      message
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
