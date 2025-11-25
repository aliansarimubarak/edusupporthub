// admin service placeholder

import { prisma } from "../config/prisma";
import { ExpertVerificationStatus } from "@prisma/client";

export const getAdminStats = async () => {
  const [userCount, orderCount, txAgg, ratingAgg] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "CHARGE", status: "COMPLETED" },
    }),
    prisma.review.aggregate({
      _avg: { rating: true },
    }),
  ]);

  return {
    activeUsers: userCount,
    orders: orderCount,
    revenue: txAgg._sum.amount || 0,
    averageRating: ratingAgg._avg.rating || 0,
  };
};

export const adminListUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const adminListOrders = async () => {
  return prisma.order.findMany({
    include: { assignment: true, student: true, expert: true },
    orderBy: { createdAt: "desc" },
  });
};


export const adminListExpertsForVerification = async () => {
  return prisma.expertProfile.findMany({
    include: {
      user: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};


interface UpdateVerificationInput {
  userId: string;
  status: ExpertVerificationStatus;
  adminNote?: string;
}



export const adminUpdateExpertVerification = async (
  input: UpdateVerificationInput
) => {
  const isVerified = input.status === ExpertVerificationStatus.VERIFIED;

  return prisma.expertProfile.update({
    where: { userId: input.userId },
    data: {
      verificationStatus: input.status,
      verificationAdminNote: input.adminNote,
      isVerified,
    },
    include: {
      user: true,
    },
  });
};