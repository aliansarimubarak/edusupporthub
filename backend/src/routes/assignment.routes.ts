// assignment routes placeholder

import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import {
  createAssignmentHandler,
  listOpenAssignmentsHandler,
  listStudentAssignmentsHandler,
  getAssignmentHandler,
} from "../controllers/assignment.controller";
import { UserRole } from "@prisma/client";

const router = Router();

// Public for experts: see open assignments
router.get("/open", listOpenAssignmentsHandler);

// Student: create assignment
router.post(
  "/",
  authMiddleware,
  requireRole([UserRole.STUDENT]),
  createAssignmentHandler
);

// Student: list own assignments
router.get(
  "/mine",
  authMiddleware,
  requireRole([UserRole.STUDENT]),
  listStudentAssignmentsHandler
);

// Get single assignment (auth required)
router.get("/:id", authMiddleware, getAssignmentHandler);

export default router;
