// import { prisma } from "../config/prisma";

// export const createDeliverable = async (data: {
//   orderId: string;
//   uploaderId: string;
//   type: string;
//   filePath: string;
//   originalName: string;
//   mimeType: string;
//   size: number;
// }) => {
//   return prisma.deliverable.create({
//     data,
//   });
// };

// export const listDeliverablesForOrder = async (orderId: string) => {
//   return prisma.deliverable.findMany({
//     where: { orderId },
//     include: {
//       uploader: true,
//     },
//     orderBy: { createdAt: "asc" },
//   });
// };

// export const verifyDeliverable = async (
//   deliverableId: string,
//   adminId: string
// ) => {
//   return prisma.deliverable.update({
//     where: { id: deliverableId },
//     data: {
//       isVerified: true,
//       verifiedBy: adminId,
//       verifiedAt: new Date(),
//     },
//   });
// };










import { prisma } from "../config/prisma";
import { OrderStatus, UserRole } from "@prisma/client";

export const createDeliverable = async (data: {
  orderId: string;
  uploaderId: string;
  type: string;
  filePath: string;
  originalName: string;
  mimeType: string;
  size: number;
}) => {
  return prisma.deliverable.create({
    data,
  });
};

// Role-aware listing:
// - STUDENT: only verified deliverables, and only for their own order
// - EXPERT: all deliverables for orders they own
// - ADMIN: all deliverables
export const listDeliverablesForOrder = async (
  orderId: string,
  userId: string,
  role: UserRole
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      studentId: true,
      expertId: true,
    },
  });

  if (!order) {
    throw { status: 404, message: "Order not found" };
  }

  if (role === "STUDENT" && order.studentId !== userId) {
    throw { status: 403, message: "Forbidden" };
  }

  if (role === "EXPERT" && order.expertId !== userId) {
    throw { status: 403, message: "Forbidden" };
  }

  const where: any = { orderId };

  // Students must not see unverified files
  if (role === "STUDENT") {
    where.isVerified = true;
  }

  const deliverables = await prisma.deliverable.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      uploader: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return deliverables;
};

// Admin verifies deliverable -> mark deliverable verified AND complete order
export const verifyDeliverable = async (
  deliverableId: string,
  adminId: string
) => {
  const updated = await prisma.deliverable.update({
    where: { id: deliverableId },
    data: {
      isVerified: true,
      verifiedBy: adminId,
      verifiedAt: new Date(),
    },
  });

  // When admin verifies, the order is considered completed
  await prisma.order.update({
    where: { id: updated.orderId },
    data: {
      status: OrderStatus.COMPLETED,
    },
  });

  return updated;
};
