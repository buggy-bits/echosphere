import { Router } from "express";
import healthRoutes from "./health.route";
import authRoutes from "./auth.route";
import projectRoutes from "./project.route";
import mockRoutes from "./mock.route";
import { attachProjectIdToRequest } from "../middlewares/mock.middleware";

const router = Router();
//          /api/v1
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);

router.use("/projects/:projectId", attachProjectIdToRequest, mockRoutes);
export default router;
