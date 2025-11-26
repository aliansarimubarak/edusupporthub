import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, getCurrentUser, requestPasswordReset, resetPasswordWithToken, } from "../services/auth.service";
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
  } catch (err: any) {
    // Handle known auth errors with specific messages
    if (err instanceof Error) {
      if (err.message === "USER_NOT_FOUND") {
        return res.status(404).json({ error: "User not found" });
      }
      if (err.message === "INVALID_PASSWORD") {
        return res.status(401).json({ error: "username or password incorrect" });
      }
    }
    // Everything else goes to the global error handler
    return next(err);
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

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await requestPasswordReset(email);

    // Always return success (even if email doesn't exist)
    res.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ error: "Token and new password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    await resetPasswordWithToken(token, password);

    res.json({ message: "Password has been reset successfully." });
  } catch (err: any) {
    if (err?.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
};

