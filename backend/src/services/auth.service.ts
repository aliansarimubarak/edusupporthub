import { prisma } from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";
import { UserRole } from "@prisma/client";

export const registerUser = async (params: {
  name: string;
  email: string;
  password: string;
  role: "student" | "expert";
}) => {
  const existing = await prisma.user.findUnique({ where: { email: params.email } });
  if (existing) throw { status: 400, message: "Email already in use" };

  const passwordHash = await hashPassword(params.password);
  const roleEnum: UserRole = params.role === "expert" ? "EXPERT" : "STUDENT";

  const user = await prisma.user.create({
    data: {
      name: params.name,
      email: params.email,
      passwordHash,
      role: roleEnum,
    },
  });

  const token = signToken({ id: user.id, role: user.role });
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 400, message: "Invalid credentials" };

  const match = await comparePassword(password, user.passwordHash);
  if (!match) throw { status: 400, message: "Invalid credentials" };

  const token = signToken({ id: user.id, role: user.role });
  return { user, token };
};

export const getCurrentUser = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { expertProfile: true },
  });
};
