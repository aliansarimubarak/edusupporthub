import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { UserRole } from "@prisma/client";
import {
  getMyExpertProfileHandler,
  updateMyExpertProfileHandler,
  requestVerificationHandler,
} from "../controllers/expert.controller";

const router = Router();

// GET /api/experts/me
router.get(
  "/me",
  authMiddleware,
  requireRole([UserRole.EXPERT]),
  getMyExpertProfileHandler
);

// PUT /api/experts/me
router.put(
  "/me",
  authMiddleware,
  requireRole([UserRole.EXPERT]),
  updateMyExpertProfileHandler
);

// POST /api/experts/verification-request
router.post(
  "/verification-request",
  authMiddleware,
  requireRole([UserRole.EXPERT]),
  requestVerificationHandler
);

export default router;
