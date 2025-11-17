// admin routes placeholder

import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { UserRole } from "@prisma/client";
import {
  getStatsHandler,
  listUsersHandler,
  listOrdersHandler,
} from "../controllers/admin.controller";

const router = Router();

router.use(authMiddleware, requireRole([UserRole.ADMIN]));

router.get("/stats", getStatsHandler);
router.get("/users", listUsersHandler);
router.get("/orders", listOrdersHandler);

export default router;
