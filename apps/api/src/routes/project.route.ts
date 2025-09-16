import { Router } from "express";
import { verifyToken } from "../middlewares/token.middleware";
import {
  createProject,
  getAllProjects,
  getSingleProject,
} from "../controllers/project.controller";

const router = Router();
//  /api/v1/projects
router.use(verifyToken); // below are protected routes

router.post("/", createProject);
router.get("/", getAllProjects);
router.get("/:id", getSingleProject);

export default router;
