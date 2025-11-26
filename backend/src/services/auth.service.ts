import { prisma } from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";
import { UserRole } from "@prisma/client";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/email";

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
  const fullUser = await prisma.user.findUnique({
  where: { id: user.id },
  include: { expertProfile: true },
  });
  return { fullUser, token };
};

// export const loginUser = async (email: string, password: string) => {
//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) throw { status: 400, message: "Invalid credentials" };

//   const match = await comparePassword(password, user.passwordHash);
//   if (!match) throw { status: 400, message: "Invalid credentials" };

//   const token = signToken({ id: user.id, role: user.role });
//   return { user, token };
// };

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email }, include: { expertProfile: true }, });

  if (!user) {
    // Let controller distinguish this
    const err = new Error("USER_NOT_FOUND");
    throw err;
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    const err = new Error("INVALID_PASSWORD");
    throw err;
  }

  const token = signToken(
    { id: user.id, role: user.role },);

  // What frontend expects
  return { token, user };
};



export const getCurrentUser = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { expertProfile: true },
  });
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal if email exists – respond as if it worked
    return;
  }

  // Invalidate any previous unused tokens (optional safety)
  await prisma.passwordResetToken.updateMany({
    where: {
      userId: user.id,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    data: {
      expiresAt: new Date(), // expire immediately
    },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  const frontendUrl =
    process.env.FRONTEND_URL || "http://localhost:5173";

  const resetLink = `${frontendUrl}/reset-password?token=${token}`;

  await sendPasswordResetEmail(user.email, resetLink);
};

export const resetPasswordWithToken = async (
  token: string,
  newPassword: string
) => {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (
    !record ||
    record.usedAt ||
    record.expiresAt < new Date()
  ) {
    throw { status: 400, message: "Invalid or expired reset token" };
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    });

    await tx.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });
  });
};

