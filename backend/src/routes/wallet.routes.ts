import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { UserRole } from "@prisma/client";
import {
  getMyWalletSummaryHandler,
  listMyPayoutRequestsHandler,
  createPayoutRequestHandler,
} from "../controllers/wallet.controller";

const router = Router();

// All wallet routes require an authenticated EXPERT
router.use(authMiddleware, requireRole([UserRole.EXPERT]));

// GET /api/wallet/summary
router.get("/summary", getMyWalletSummaryHandler);

// GET /api/wallet/withdrawals (my payout requests)
router.get("/withdrawals", listMyPayoutRequestsHandler);

// POST /api/wallet/withdrawals (create a new withdrawal request)
router.post("/withdrawals", createPayoutRequestHandler);

export default router;
