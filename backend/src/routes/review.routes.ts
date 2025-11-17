// review routes placeholder

import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createReviewHandler,
  listReviewsForExpertHandler,
} from "../controllers/review.controller";

const router = Router();

router.post("/", authMiddleware, createReviewHandler);
router.get("/expert/:expertId", listReviewsForExpertHandler);

export default router;
