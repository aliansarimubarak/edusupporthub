// admin service placeholder

import { prisma } from "../config/prisma";

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
