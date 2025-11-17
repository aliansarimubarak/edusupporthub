import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  listOrdersForCurrentHandler,
  getOrderHandler,
  completeOrderHandler,
} from "../controllers/order.controller";

const router = Router();

router.get("/mine", authMiddleware, listOrdersForCurrentHandler);
router.get("/:id", authMiddleware, getOrderHandler);
router.post("/:id/complete", authMiddleware, completeOrderHandler);

export default router;
