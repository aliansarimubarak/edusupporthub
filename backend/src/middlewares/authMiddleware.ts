import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  let token: string | null = null;

  if (header?.startsWith("Bearer ")) {
    token = header.substring(7);
  }

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
