import { Router } from "express";
import authRoutes from "./auth.routes";
import assignmentRoutes from "./assignment.routes";
import offerRoutes from "./offer.routes";
import orderRoutes from "./order.routes";
import messageRoutes from "./message.routes";
import reviewRoutes from "./review.routes";
import adminRoutes from "./admin.routes";
import deliverableRoutes from "./deliverable.routes";
import expertRoutes from "./expert.routes";
import walletRoutes from "./wallet.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/offers", offerRoutes);
router.use("/orders", orderRoutes);
router.use("/messages", messageRoutes);
router.use("/reviews", reviewRoutes);
router.use("/admin", adminRoutes);
router.use("/deliverables", deliverableRoutes);
router.use("/experts", expertRoutes);
router.use("/wallet", walletRoutes);

export default router;
