import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { deliverableUpload } from "../middlewares/uploadMiddleware";
import {
  uploadDeliverableHandler,
  listDeliverablesHandler,
  verifyDeliverableHandler,
} from "../controllers/deliverable.controller";
import { UserRole } from "@prisma/client";

const router = Router();

// Expert: upload file for order
router.post(
  "/order/:orderId",
  authMiddleware,
  requireRole([UserRole.EXPERT]),
  deliverableUpload.single("file"),
  uploadDeliverableHandler
);

// Student/Expert/Admin: list deliverables for order
router.get("/order/:orderId", authMiddleware, listDeliverablesHandler);

// Admin: verify a deliverable
router.patch(
  "/:deliverableId/verify",
  authMiddleware,
  requireRole([UserRole.ADMIN]),
  verifyDeliverableHandler
);

export default router;
