import { Router } from "express";
import healthRoutes from "./health.route";

const router = Router();
//          /api/v1
router.use("/health", healthRoutes);

export default router;
