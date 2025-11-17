// review service placeholder

import { prisma } from "../config/prisma";

export const createReview = async (data: {
  orderId: string;
  studentId: string;
  expertId: string;
  rating: number;
  comment: string;
}) => {
  return prisma.review.create({
    data,
  });
};

export const listReviewsForExpert = async (expertId: string) => {
  return prisma.review.findMany({
    where: { expertId },
    orderBy: { createdAt: "desc" },
  });
};
