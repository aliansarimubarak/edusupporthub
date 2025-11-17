// admin controller placeholder

import { Request, Response, NextFunction } from "express";
import {
  getAdminStats,
  adminListUsers,
  adminListOrders,
} from "../services/admin.service";

export const getStatsHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

export const listUsersHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await adminListUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const listOrdersHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await adminListOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
