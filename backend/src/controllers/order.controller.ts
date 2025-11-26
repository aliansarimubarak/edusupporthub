import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  listOrdersForStudent,
  listOrdersForExpert,
  getOrderById,
  completeOrder,
  getOrderWithDeliverablesForAdmin
} from "../services/order.service";
import { UserRole } from "@prisma/client";

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

    return res.status(403).json({ error: "Only students and experts can list their own orders" });
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
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { id } = req.params;
    const order = await getOrderById(
      id,
      req.user.id,
      req.user.role as UserRole
    );

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (err: any) {
    if (err?.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
};



// export const completeOrderHandler = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     if (!req.user || req.user.role !== "STUDENT") {
//       return res.status(403).json({ error: "Only students can complete orders" });
//     }

//     const { id } = req.params;
//     const order = await completeOrder(id, req.user.id);
//     res.json(order);
//   } catch (err: any) {
//     if (err?.status) {
//       return res.status(err.status).json({ error: err.message });
//     }
//     next(err);
//   }
// };

export const completeOrderHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== "STUDENT") {
      return res
        .status(403)
        .json({ error: "Only students can complete orders" });
    }

    const { id } = req.params;
    const { rating, comment } = req.body as {
      rating?: number;
      comment?: string;
    };

    const order = await completeOrder(id, req.user.id, rating, comment);
    res.json(order);
  } catch (err: any) {
    if (err?.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
};


export const adminGetOrderHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Only admin can view this resource" });
    }

    const { id } = req.params;

    const order = await getOrderWithDeliverablesForAdmin(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json(order);
  } catch (err: any) {
    if (err?.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
};

