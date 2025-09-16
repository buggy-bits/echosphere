import { Router } from "express";
import { verifyToken } from "../middlewares/token.middleware";
import {
  createProject,
} from "../controllers/project.controller";

const router = Router();
//  /api/v1/projects
router.use(verifyToken); // below are protected routes

router.post("/", createProject);

export default router;
