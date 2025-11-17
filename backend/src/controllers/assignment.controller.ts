// assignment controller placeholder

import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  createAssignment,
  listOpenAssignments,
  listAssignmentsForStudent,
  getAssignmentById,
} from "../services/assignment.service";

export const createAssignmentHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== "STUDENT") {
      return res.status(403).json({ error: "Only students can create assignments" });
    }

    const { title, description, subject, academicLevel, deadline, budgetMin, budgetMax } =
      req.body;

    if (!title || !description || !subject || !academicLevel || !deadline) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const assignment = await createAssignment({
      studentId: req.user.id,
      title,
      description,
      subject,
      academicLevel,
      deadline: new Date(deadline),
      budgetMin,
      budgetMax,
    });

    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
};

export const listOpenAssignmentsHandler = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const assignments = await listOpenAssignments();
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

export const listStudentAssignmentsHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== "STUDENT") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const assignments = await listAssignmentsForStudent(req.user.id);
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

export const getAssignmentHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const assignment = await getAssignmentById(id);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });
    res.json(assignment);
  } catch (err) {
    next(err);
  }
};
