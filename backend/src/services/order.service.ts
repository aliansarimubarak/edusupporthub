// // order service placeholder

// import { prisma } from "../config/prisma";
// import { OrderStatus } from "@prisma/client";

// export const listOrdersForStudent = async (studentId: string) => {
//   return prisma.order.findMany({
//     where: { studentId },
//     include: { assignment: true, expert: true },
//     orderBy: { createdAt: "desc" },
//   });
// };

// export const listOrdersForExpert = async (expertId: string) => {
//   return prisma.order.findMany({
//     where: { expertId },
//     include: { assignment: true, student: true },
//     orderBy: { createdAt: "desc" },
//   });
// };

// export const getOrderById = async (id: string) => {
//   return prisma.order.findUnique({
//     where: { id },
//     include: { assignment: true, student: true, expert: true },
//   });
// };

// export const completeOrder = async (orderId: string, studentId: string) => {
//   const order = await prisma.order.findUnique({ where: { id: orderId } });
//   if (!order) throw { status: 404, message: "Order not found" };
//   if (order.studentId !== studentId) throw { status: 403, message: "Not your order" };

//   return prisma.order.update({
//     where: { id: orderId },
//     data: { status: OrderStatus.COMPLETED },
//   });
// };

// export const getRecentCompletedOrdersForExpert = async (
//   expertId: string,
//   limit = 10
// ) => {
//   const orders = await prisma.order.findMany({
//     where: {
//       expertId,
//       status: OrderStatus.COMPLETED,
//       // must have at least one deliverable
//       deliverables: {
//         some: {},
//       },
//     },
//     include: {
//       assignment: true,
//       deliverables: {
//         orderBy: {
//           createdAt: "asc", // first file = usually first page / first upload
//         },
//         take: 1, // just need one file to preview
//       },
//     },
//     orderBy: {
//       updatedAt: "desc", // latest completed first
//     },
//     take: limit,
//   });

//   return orders.map((o) => {
//     const firstDeliverable = o.deliverables[0];

//     return {
//       id: o.id,
//       assignmentId: o.assignmentId,
//       title: o.assignment.title,
//       subject: o.assignment.subject,
//       completedAt: o.updatedAt,
//       // adjust "filePath" → your actual column name
//       solutionPdfPath: firstDeliverable?.filePath ?? null,
//     };
//   });
// };


















import { prisma } from "../config/prisma";
import { OrderStatus, UserRole } from "@prisma/client";

/**
 * List orders for a student.
 * Includes assignment, expert, and ONLY verified deliverables
 * so students only see files after admin verification.
 */
// export const listOrdersForStudent = async (studentId: string) => {
//   return prisma.order.findMany({
//     where: { studentId },
//     include: {
//       assignment: true,
//       expert: true,
//       deliverables: {
//         where: { isVerified: true },
//         orderBy: { createdAt: "desc" },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });
// };



export const listOrdersForStudent = async (studentId: string) => {
  return prisma.order.findMany({
    where: { studentId },
    include: { assignment: true, expert: true },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * List orders for an expert.
 * Includes assignment, student, and ALL deliverables
 * (expert can see their own uploads regardless of verification).
 */
// export const listOrdersForExpert = async (expertId: string) => {
//   return prisma.order.findMany({
//     where: { expertId },
//     include: {
//       assignment: true,
//       student: true,
//       deliverables: {
//         orderBy: { createdAt: "desc" },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });
// };



export const listOrdersForExpert = async (expertId: string) => {
  return prisma.order.findMany({
    where: { expertId },
    include: { assignment: true, student: true },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Generic getOrderById – safe for student / expert views.
 * Includes ONLY verified deliverables to match “student only sees verified files”.
 * If admin needs all deliverables, use getOrderWithDeliverablesForAdmin.
 */
// export const getOrderById = async (id: string) => {
//   return prisma.order.findUnique({
//     where: { id },
//     include: {
//       assignment: true,
//       student: true,
//       expert: true,
//       deliverables: {
//         where: { isVerified: true },
//         orderBy: { createdAt: "desc" },
//       },
//     },
//   });
// };


export const getOrderById = async (
  id: string,
  userId: string,
  role: UserRole
) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { assignment: true, student: true, expert: true },
  });

  if (!order) return null;

  if (role === "STUDENT" && order.studentId !== userId) {
    throw { status: 403, message: "Forbidden" };
  }

  if (role === "EXPERT" && order.expertId !== userId) {
    throw { status: 403, message: "Forbidden" };
  }

  // Admin can see any
  return order;
};



/**
 * Mark an order as completed by student action (if you still use this flow).
 * NOTE: in the new flow, admin verification also sets COMPLETED,
 * but this function is kept for compatibility.
 */
export const completeOrder = async (orderId: string, studentId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw { status: 404, message: "Order not found" };
  if (order.studentId !== studentId)
    throw { status: 403, message: "Not your order" };

  return prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.COMPLETED },
  });
};

/**
 * Used on the offers page to show an expert's recent completed work.
 * Returns at most `limit` completed orders with a preview PDF path.
 */
export const getRecentCompletedOrdersForExpert = async (
  expertId: string,
  limit = 10
) => {
  const orders = await prisma.order.findMany({
    where: {
      expertId,
      status: OrderStatus.COMPLETED,
      // must have at least one deliverable
      deliverables: {
        some: {},
      },
    },
    include: {
      assignment: true,
      deliverables: {
        orderBy: {
          createdAt: "asc", // first uploaded deliverable first
        },
        take: 1, // just need one file to preview
      },
    },
    orderBy: {
      updatedAt: "desc", // latest completed first
    },
    take: limit,
  });

  return orders.map((o) => {
    const firstDeliverable = o.deliverables[0];

    return {
      id: o.id,
      assignmentId: o.assignmentId,
      title: o.assignment.title,
      subject: o.assignment.subject,
      completedAt: o.updatedAt,
      // Deliverable.filePath points to e.g. /uploads/assignmentdone/...
      solutionPdfPath: firstDeliverable?.filePath ?? null,
    };
  });
};

/**
 * Admin-only view: get a single order with ALL deliverables (verified or not).
 * This is what you should use on the admin order detail page
 * so admin can see and open every uploaded file and verify them.
 */
export const getOrderWithDeliverablesForAdmin = async (orderId: string) => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      assignment: true,
      student: true,
      expert: true,
      deliverables: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
};
