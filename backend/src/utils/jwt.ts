import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export interface JwtPayload {
  id: string;
  role: UserRole;
}

export const signToken = (payload: JwtPayload, expiresIn = "7d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
