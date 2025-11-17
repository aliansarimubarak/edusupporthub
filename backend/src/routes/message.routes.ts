// message routes placeholder

import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  listMessagesHandler,
  createMessageHandler,
} from "../controllers/message.controller";

const router = Router();

router.get("/order/:orderId", authMiddleware, listMessagesHandler);
router.post("/", authMiddleware, createMessageHandler);

export default router;
