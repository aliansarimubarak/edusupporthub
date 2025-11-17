// message service placeholder

import { prisma } from "../config/prisma";

export const listMessagesForOrder = async (orderId: string) => {
  return prisma.message.findMany({
    where: { orderId },
    include: { sender: true },
    orderBy: { createdAt: "asc" },
  });
};

export const createMessage = async (orderId: string, senderId: string, text: string) => {
  return prisma.message.create({
    data: { orderId, senderId, text },
  });
};
