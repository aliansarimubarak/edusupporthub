import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, getCurrentUser } from "../services/auth.service";
import { AuthRequest } from "../middlewares/authMiddleware";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!["student", "expert"].includes(role)) {
      return res.status(400).json({ error: "Role must be student or expert" });
    }
    const result = await registerUser({ name, email, password, role });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }
    const result = await loginUser(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const user = await getCurrentUser(req.user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
