// offer service placeholder

import { prisma } from "../config/prisma";
import { AssignmentStatus } from "@prisma/client";
import { getRecentCompletedOrdersForExpert } from "./order.service";

export const createOffer = async (data: {
  assignmentId: string;
  expertId: string;
  price: number;
  deliveryDays: number;
  message: string;
}) => {
  return prisma.offer.create({
    data,
  });
};

export const listOffersForAssignment = async (assignmentId: string) => {
  return prisma.offer.findMany({
    where: { assignmentId },
    include: {
      expert: {
        include: { expertProfile: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const acceptOffer = async (offerId: string, studentId: string) => {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: { assignment: true },
  });

  if (!offer) throw { status: 404, message: "Offer not found" };

  if (offer.assignment.studentId !== studentId) {
    throw { status: 403, message: "Not your assignment" };
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      assignmentId: offer.assignmentId,
      studentId,
      expertId: offer.expertId,
      agreedPrice: offer.price,
    },
  });

  // Update assignment + offer statuses
  await prisma.assignment.update({
    where: { id: offer.assignmentId },
    data: { status: AssignmentStatus.IN_PROGRESS },
  });

  await prisma.offer.update({
    where: { id: offerId },
    data: { status: "ACCEPTED" },
  });

  await prisma.offer.updateMany({
    where: {
      assignmentId: offer.assignmentId,
      id: { not: offerId },
    },
    data: { status: "REJECTED" },
  });

  return order;
};



export const listOffersForAssignmentWithExpertHistory = async (
  assignmentId: string
) => {
  const offers = await prisma.offer.findMany({
    where: { assignmentId },
    include: {
      expert: {
        include: {
          expertProfile: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const expertIds = Array.from(new Set(offers.map((o) => o.expertId)));

  const historyByExpert: Record<string, any[]> = {};

  for (const expertId of expertIds) {
    historyByExpert[expertId] = await getRecentCompletedOrdersForExpert(
      expertId,
      10
    );
  }

  return offers.map((offer) => ({
    ...offer,
    expertRecentAssignments: historyByExpert[offer.expertId] ?? [],
  }));
};
