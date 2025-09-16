import { Router } from "express";
import { verifyToken } from "../middlewares/token.middleware";
import {
  createProject,
  deleteSingleProject,
  getAllProjects,
  getSingleProject,
  updateSingleProject,
} from "../controllers/project.controller";

const router = Router();
//  /api/v1/projects
router.use(verifyToken); // below are protected routes

router.post("/", createProject);
router.get("/", getAllProjects);
router.get("/:id", getSingleProject);
router.delete("/:id", deleteSingleProject);
router.put("/:id", updateSingleProject);

export default router;
