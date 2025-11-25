// assignment routes placeholder

import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import {
  createAssignmentHandler,
  listOpenAssignmentsHandler,
  listStudentAssignmentsHandler,
  getAssignmentHandler,
  updateAssignmentHandler,
} from "../controllers/assignment.controller";
import { UserRole } from "@prisma/client";
import { assignmentUpload } from "../middlewares/assignmentUploadMiddleware";


const router = Router();

// Public for experts: see open assignments
router.get("/open", listOpenAssignmentsHandler);

// Student: list own assignments
router.get(
  "/mine",
  authMiddleware,
  requireRole([UserRole.STUDENT]),
  listStudentAssignmentsHandler
);

// POST /api/assignments
router.post(
  "/",
  authMiddleware,
  requireRole([UserRole.STUDENT]), // or whatever roles you use
  assignmentUpload.single("attachment"), // ⬅ handle 'attachment' PDF
  createAssignmentHandler
);

// routes/assignment.routes.ts
router.put(
  "/:id",
  authMiddleware,
  requireRole([UserRole.STUDENT]),
  updateAssignmentHandler
);

// Get single assignment (auth required)
router.get("/:id", authMiddleware, getAssignmentHandler);

export default router;
