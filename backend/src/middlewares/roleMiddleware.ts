import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { UserRole } from "@prisma/client";

export const requireRole =
  (roles: UserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
