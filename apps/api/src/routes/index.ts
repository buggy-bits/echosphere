import { Router } from "express";
import healthRoutes from "./health.route";
import authRoutes from "./auth.route";
import projectRoutes from "./project.route";
import mockRoutes from "./mock.route";
import { attachProjectToRequest } from "../middlewares/mock.middleware";
import { verifyToken } from "../middlewares/token.middleware";

const router = Router();
//          /api/v1
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);

router.use(
  "/projects/:projectId",
  verifyToken,
  attachProjectToRequest,
  mockRoutes
);
export default router;
