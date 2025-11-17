// message controller placeholder

import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  listMessagesForOrder,
  createMessage,
} from "../services/message.service";

export const listMessagesHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const messages = await listMessagesForOrder(orderId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

export const createMessageHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });

    const { orderId, text } = req.body;
    if (!orderId || !text) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const msg = await createMessage(orderId, req.user.id, text);
    res.status(201).json(msg);
  } catch (err) {
    next(err);
  }
};
