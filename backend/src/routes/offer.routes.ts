// offer routes placeholder

import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import {
  createOfferHandler,
  listOffersForAssignmentHandler,
  acceptOfferHandler,
} from "../controllers/offer.controller";
import { UserRole } from "@prisma/client";

const router = Router();

// Expert creates offer
router.post(
  "/",
  authMiddleware,
  requireRole([UserRole.EXPERT]),
  createOfferHandler
);

// Student lists offers for a given assignment
router.get(
  "/assignment/:assignmentId",
  authMiddleware,
  requireRole([UserRole.STUDENT]),
  listOffersForAssignmentHandler
);

// Student accepts offer
router.post(
  "/accept",
  authMiddleware,
  requireRole([UserRole.STUDENT]),
  acceptOfferHandler
);

export default router;
