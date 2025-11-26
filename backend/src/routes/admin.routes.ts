// admin routes placeholder

import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { UserRole } from "@prisma/client";
import {
  getStatsHandler,
  listUsersHandler,
  listOrdersHandler,
  listPayoutRequestsHandler,
  updatePayoutRequestStatusHandler,
  listExpertVerificationHandler,
  updateExpertVerificationHandler,
  adminReturnOrderForRevisionHandler,
} from "../controllers/admin.controller";

const router = Router();

router.use(authMiddleware, requireRole([UserRole.ADMIN]));

router.get("/stats", getStatsHandler);
router.get("/users", listUsersHandler);
router.get("/orders", listOrdersHandler);
router.get("/payout-requests", listPayoutRequestsHandler);
router.put("/payout-requests/:id", updatePayoutRequestStatusHandler);

// NEW: expert profile verification
router.get("/experts/verification", listExpertVerificationHandler);
router.put("/experts/:userId/verification", updateExpertVerificationHandler);
router.patch("/orders/:id/return-for-revision", adminReturnOrderForRevisionHandler);


export default router;
