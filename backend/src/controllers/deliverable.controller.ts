import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
  createDeliverable,
  listDeliverablesForOrder,
  verifyDeliverable,
} from "../services/deliverable.service";
import { prisma } from "../config/prisma";
import { OrderStatus, UserRole } from "@prisma/client";

// export const uploadDeliverableHandler = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     if (!req.user) return res.status(401).json({ error: "Not authenticated" });

//     const { orderId } = req.params;
//     const type = (req.body.type as string) || "FINAL";
//     const file = (req as any).file as Express.Multer.File | undefined;

    

//     if (!file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // Load order + assignment (for deadline)
//     const order = await prisma.order.findUnique({
//       where: { id: orderId },
//       include: {
//         assignment: true,
//       },
//     });

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     // Only the expert on this order can upload
//     if (order.expertId !== req.user.id) {
//       return res
//         .status(403)
//         .json({ error: "You are not allowed to upload for this order" });
//     }

//     // Check deadline: AFTER deadline, no upload allowed
//     const now = new Date();
//     const deadline = order.assignment.deadline;
//     if (deadline.getTime() <= now.getTime()) {
//       return res.status(400).json({
//         error:
//           "The assignment deadline has passed. You cannot upload a deliverable.",
//       });
//     }
  

//     const deliverable = await createDeliverable({
//       orderId,
//       uploaderId: req.user.id,
//       type,
//       filePath: `/uploads/assignmentdone/${file.filename}`,
//       originalName: file.originalname,
//       mimeType: file.mimetype,
//       size: file.size,
//     });

//     res.status(201).json(deliverable);
//   } catch (err) {
//     next(err);
//   }
// };






export const uploadDeliverableHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { orderId } = req.params;
    const { type } = req.body as { type?: string };
    const file = (req as any).file as Express.Multer.File | undefined;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Load order + assignment (for deadline)
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        assignment: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Only the expert on this order can upload
    if (order.expertId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not allowed to upload for this order" });
    }

    // Check deadline: AFTER deadline, no upload allowed
    const now = new Date();
    const deadline = order.assignment.deadline;
    if (deadline.getTime() <= now.getTime()) {
      return res.status(400).json({
        error:
          "The assignment deadline has passed. You cannot upload a deliverable.",
      });
    }

    // Create deliverable
    const deliverable = await createDeliverable({
      orderId: order.id,
      uploaderId: req.user.id,
      type: type && type.trim() !== "" ? type : "FINAL",
      filePath: `/uploads/assignmentdone/${file.filename}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });

    // Set order status to PROCESSING (waiting for admin verification)
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.AWAITING_REVISION, // used as "Processing / awaiting verification"
      },
    });

    return res.status(201).json(deliverable);
  } catch (err: any) {
    if (err?.message === "Only PDF files are allowed") {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    return next(err);
  }
};



export const listDeliverablesHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const { orderId } = req.params;
    const deliverables = await listDeliverablesForOrder(
      orderId,
      req.user.id,
      req.user.role as UserRole
    );
    res.json(deliverables);
  } catch (err: any) {
    if (err?.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
};




export const verifyDeliverableHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Only admin can verify deliverables" });
    }

    const { deliverableId } = req.params;

    const deliverable = await prisma.deliverable.findUnique({
      where: { id: deliverableId },
    });

    if (!deliverable) {
      return res.status(404).json({ error: "Deliverable not found" });
    }

    // Mark deliverable as verified
    // const updatedDeliverable = await prisma.deliverable.update({
    //   where: { id: deliverableId },
    //   data: {
    //     isVerified: true,
    //     verifiedBy: req.user.id,
    //     verifiedAt: new Date(),
    //   },
    // });

    const updated = await verifyDeliverable(deliverableId, req.user.id);

    // Also mark order as COMPLETED
    // await prisma.order.update({
    //   where: { id: deliverable.orderId },
    //   data: {
    //     status: "COMPLETED",
    //   },
    // });

    return res.json(updated);
  } catch (err) {
    next(err);
  }
};

