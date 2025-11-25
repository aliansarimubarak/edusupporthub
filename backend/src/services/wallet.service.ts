import { prisma } from "../config/prisma";
import { OrderStatus, PayoutRequestStatus } from "@prisma/client";

export const getExpertWalletSummary = async (expertId: string) => {
  const [completedOrders, activeOrders] = await Promise.all([
    prisma.order.findMany({
      where: { expertId, status: OrderStatus.COMPLETED },
      include: { assignment: true, student: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { expertId, status: OrderStatus.IN_PROGRESS },
    }),
  ]);

  const lifetimeEarnings = completedOrders.reduce(
    (sum, o) => sum + o.agreedPrice,
    0
  );

  const activeOrdersTotal = activeOrders.reduce(
    (sum, o) => sum + o.agreedPrice,
    0
  );

  // For now, everything from completed orders is "available".
  // Later you can subtract PAID payouts.
  const availableBalance = lifetimeEarnings;

  return {
    lifetimeEarnings,
    availableBalance,
    activeOrdersTotal,
    completedCount: completedOrders.length,
    completedOrders,
  };
};

interface CreatePayoutRequestInput {
  amount: number;
  currency?: string;
  method: string;
  accountDetails: string;
  note?: string;
}

// Expert creates a withdrawal request
export const createPayoutRequest = async (
  expertId: string,
  input: CreatePayoutRequestInput
) => {
  return prisma.payoutRequest.create({
    data: {
      expertId,
      amount: input.amount,
      currency: input.currency ?? "USD",
      method: input.method,
      accountDetails: input.accountDetails,
      note: input.note,
    },
  });
};

// Expert views their own payout requests
export const listPayoutRequestsForExpert = async (expertId: string) => {
  return prisma.payoutRequest.findMany({
    where: { expertId },
    orderBy: { createdAt: "desc" },
  });
};

// --- ADMIN helpers (optional, but useful) ---

export const adminListPayoutRequests = async () => {
  return prisma.payoutRequest.findMany({
    include: { expert: true },
    orderBy: { createdAt: "desc" },
  });
};

export const adminUpdatePayoutRequestStatus = async (
  id: string,
  status: PayoutRequestStatus
) => {
  return prisma.payoutRequest.update({
    where: { id },
    data: { status },
  });
};
