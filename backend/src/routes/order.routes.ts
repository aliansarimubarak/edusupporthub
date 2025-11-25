import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  listOrdersForCurrentHandler,
  getOrderHandler,
  completeOrderHandler,
  adminGetOrderHandler
} from "../controllers/order.controller";
import { requireRole } from "../middlewares/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/mine", authMiddleware, listOrdersForCurrentHandler);
router.get("/:id", authMiddleware, getOrderHandler);
router.post("/:id/complete", authMiddleware, completeOrderHandler);
// Admin: view order with deliverables
router.get(
  "/admin/orders/:id",
  authMiddleware,
  requireRole([UserRole.ADMIN]),
  adminGetOrderHandler
);

export default router;
