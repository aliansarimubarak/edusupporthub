import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  listOrdersForStudent,
  listOrdersForExpert,
  getOrderById,
  completeOrder,
} from "../services/order.service";

export const listOrdersForCurrentHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });

    if (req.user.role === "STUDENT") {
      const orders = await listOrdersForStudent(req.user.id);
      return res.json(orders);
    }

    if (req.user.role === "EXPERT") {
      const orders = await listOrdersForExpert(req.user.id);
      return res.json(orders);
    }

    return res.status(403).json({ error: "Admins have separate endpoints" });
  } catch (err) {
    next(err);
  }
};

export const getOrderHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const completeOrderHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== "STUDENT") {
      return res.status(403).json({ error: "Only students can complete orders" });
    }

    const { id } = req.params;
    const order = await completeOrder(id, req.user.id);
    res.json(order);
  } catch (err) {
    next(err);
  }
};
