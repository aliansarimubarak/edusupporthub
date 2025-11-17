// order service placeholder

import { prisma } from "../config/prisma";
import { OrderStatus } from "@prisma/client";

export const listOrdersForStudent = async (studentId: string) => {
  return prisma.order.findMany({
    where: { studentId },
    include: { assignment: true, expert: true },
    orderBy: { createdAt: "desc" },
  });
};

export const listOrdersForExpert = async (expertId: string) => {
  return prisma.order.findMany({
    where: { expertId },
    include: { assignment: true, student: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getOrderById = async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: { assignment: true, student: true, expert: true },
  });
};

export const completeOrder = async (orderId: string, studentId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw { status: 404, message: "Order not found" };
  if (order.studentId !== studentId) throw { status: 403, message: "Not your order" };

  return prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.COMPLETED },
  });
};
