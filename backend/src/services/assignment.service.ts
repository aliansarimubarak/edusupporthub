// // assignment service placeholder

import { prisma } from "../config/prisma";
import { AssignmentStatus } from "@prisma/client";

export interface CreateAssignmentInput {
  studentId: string;
  title: string;
  description: string;
  faculty: string;        // ⬅ NEW
  subject: string;
  academicLevel: string;
  deadline: Date;
  budgetMin?: number;
  budgetMax?: number;
  attachmentPath?: string; // ⬅ NEW (PDF file path)
}

export const createAssignment = async (data: CreateAssignmentInput) => {
  return prisma.assignment.create({
    data: {
      studentId: data.studentId,
      title: data.title,
      faculty: data.faculty,              // ⬅ Prisma field
      description: data.description,
      subject: data.subject,
      academicLevel: data.academicLevel,
      deadline: data.deadline,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      attachmentPath: data.attachmentPath, // ⬅ Prisma field
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
