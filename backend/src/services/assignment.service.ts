// assignment service placeholder

import { prisma } from "../config/prisma";
import { AssignmentStatus } from "@prisma/client";

export const createAssignment = async (data: {
  studentId: string;
  title: string;
  description: string;
  subject: string;
  academicLevel: string;
  deadline: Date;
  budgetMin?: number;
  budgetMax?: number;
}) => {
  return prisma.assignment.create({
    data: {
      studentId: data.studentId,
      title: data.title,
      description: data.description,
      subject: data.subject,
      academicLevel: data.academicLevel,
      deadline: data.deadline,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      status: AssignmentStatus.OPEN,
    },
  });
};

export const listOpenAssignments = async () => {
  return prisma.assignment.findMany({
    where: { status: AssignmentStatus.OPEN },
    orderBy: { createdAt: "desc" },
  });
};

export const listAssignmentsForStudent = async (studentId: string) => {
  return prisma.assignment.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
  });
};

export const getAssignmentById = async (id: string) => {
  return prisma.assignment.findUnique({
    where: { id },
  });
};
