import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  createAssignment,
  listOpenAssignments,
  listAssignmentsForStudent,
  getAssignmentById,
} from "../services/assignment.service";
import { prisma } from "../config/prisma";

/**
 * Create a new assignment (with faculty + optional PDF + budgets)
 */
export const createAssignmentHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== "STUDENT") {
      return res
        .status(403)
        .json({ error: "Only students can create assignments" });
    }

    // When using multer + multipart/form-data, everything in body is string
    const {
      title,
      faculty,
      description,
      subject,
      academicLevel,
      deadline,
      budgetMin,
      budgetMax,
    } = req.body as {
      title?: string;
      description?: string;
      faculty?: string;
      subject?: string;
      academicLevel?: string;
      deadline?: string;
      budgetMin?: string;
      budgetMax?: string;
    };

    // Basic required fields check
    if (
      !title ||
      !faculty ||
      !description ||
      !subject ||
      !academicLevel ||
      !deadline
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Parse deadline
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({ error: "Invalid deadline" });
    }

    // Deadline must be in the future
    const now = new Date();
    if (deadlineDate.getTime() <= now.getTime()) {
      return res
        .status(400)
        .json({ error: "Deadline must be in the future" });
    }

    // Parse budgets (they arrive as strings)
    const parsedBudgetMin =
      budgetMin !== undefined && budgetMin !== null && budgetMin !== ""
        ? Number(budgetMin)
        : undefined;
    const parsedBudgetMax =
      budgetMax !== undefined && budgetMax !== null && budgetMax !== ""
        ? Number(budgetMax)
        : undefined;

    if (parsedBudgetMin !== undefined && isNaN(parsedBudgetMin)) {
      return res.status(400).json({ error: "Invalid minimum budget" });
    }
    if (parsedBudgetMax !== undefined && isNaN(parsedBudgetMax)) {
      return res.status(400).json({ error: "Invalid maximum budget" });
    }

    // Non-negative budgets
    if (parsedBudgetMin !== undefined && parsedBudgetMin < 0) {
      return res
        .status(400)
        .json({ error: "Minimum budget cannot be negative" });
    }
    if (parsedBudgetMax !== undefined && parsedBudgetMax < 0) {
      return res
        .status(400)
        .json({ error: "Maximum budget cannot be negative" });
    }

    // Max >= Min if both present
    if (
      parsedBudgetMin !== undefined &&
      parsedBudgetMax !== undefined &&
      parsedBudgetMax < parsedBudgetMin
    ) {
      return res.status(400).json({
        error: "Maximum budget cannot be less than minimum budget",
      });
    }

    // Handle PDF attachment from multer: assignmentUpload.single("attachment")
    let attachmentPath: string | undefined;
    const file = (req as any).file as Express.Multer.File | undefined;
    if (file) {
      // Served later by app.use("/uploads", express.static(...))
      attachmentPath = `/uploads/assignment/${file.filename}`;
    }

    const assignment = await createAssignment({
      studentId: req.user.id,
      title,
      faculty,
      description,
      subject,
      academicLevel,
      deadline: deadlineDate,
      budgetMin: parsedBudgetMin,
      budgetMax: parsedBudgetMax,
      attachmentPath,
    });

    res.status(201).json(assignment);
  } catch (err: any) {
    // If multer fileFilter threw a PDF error
    if (err?.message === "Only PDF files are allowed") {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

/**
 * Update basic assignment fields (title, deadline, budgets)
 * Used by student from the offers page ("Edit assignment details" modal)
 */
export const updateAssignmentHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== "STUDENT") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const assignmentId = req.params.id;

    // Load existing assignment
    const existing = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Ensure this assignment belongs to the logged-in student
    if (existing.studentId !== req.user.id) {
      return res.status(403).json({ error: "You cannot edit this assignment" });
    }

    // 3) HARD LOCK: block editing if any order exists for this assignment
    const existingOrder = await prisma.order.findUnique({
      where: { assignmentId }, // assignmentId is unique in your Order model
    });

    if (existingOrder) {
      return res.status(400).json({
        error:
          "This assignment is already in progress with an expert. Editing is disabled after accepting an offer.",
      });
    }

    const { title, deadline, budgetMin, budgetMax } = req.body;

    // Parse budgets (may be numbers or strings from JSON)
    const parsedBudgetMin =
      budgetMin !== undefined && budgetMin !== null && budgetMin !== ""
        ? Number(budgetMin)
        : undefined;
    const parsedBudgetMax =
      budgetMax !== undefined && budgetMax !== null && budgetMax !== ""
        ? Number(budgetMax)
        : undefined;

    if (parsedBudgetMin !== undefined && isNaN(parsedBudgetMin)) {
      return res.status(400).json({ error: "Invalid minimum budget" });
    }
    if (parsedBudgetMax !== undefined && isNaN(parsedBudgetMax)) {
      return res.status(400).json({ error: "Invalid maximum budget" });
    }

    if (parsedBudgetMin !== undefined && parsedBudgetMin < 0) {
      return res
        .status(400)
        .json({ error: "Minimum budget cannot be negative" });
    }
    if (parsedBudgetMax !== undefined && parsedBudgetMax < 0) {
      return res
        .status(400)
        .json({ error: "Maximum budget cannot be negative" });
    }
    if (
      parsedBudgetMin !== undefined &&
      parsedBudgetMax !== undefined &&
      parsedBudgetMax < parsedBudgetMin
    ) {
      return res.status(400).json({
        error: "Maximum budget cannot be less than minimum budget",
      });
    }

    let deadlineDate: Date | undefined;
    if (deadline !== undefined && deadline !== null && deadline !== "") {
      const d = new Date(deadline);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ error: "Invalid deadline" });
      }
      if (d.getTime() <= Date.now()) {
        return res
          .status(400)
          .json({ error: "Deadline must be in the future" });
      }
      deadlineDate = d;
    }

    // Build Prisma update data; only include fields that are provided
    const data: any = {};

    if (title !== undefined && title !== null && title !== "") {
      data.title = title;
    }

    if (deadlineDate) {
      data.deadline = deadlineDate;
    }

    if (parsedBudgetMin !== undefined) {
      data.budgetMin = parsedBudgetMin;
    }

    if (parsedBudgetMax !== undefined) {
      data.budgetMax = parsedBudgetMax;
    }

    const updated = await prisma.assignment.update({
      where: { id: assignmentId },
      data,
    });

    return res.json(updated);
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
    return res.json(assignments);
    //res.json(assignments);
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
    if (!assignment)
      return res.status(404).json({ error: "Assignment not found" });
    return res.json(assignment);
  } catch (err) {
    next(err);
  }
};
