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
// router.use(verifyToken); // below are protected routes

router.post("/", verifyToken, createProject);
router.get("/", verifyToken, getAllProjects);
router.get("/:id", verifyToken, getSingleProject);
router.delete("/:id", verifyToken, deleteSingleProject);
router.put("/:id", verifyToken, updateSingleProject);

export default router;
