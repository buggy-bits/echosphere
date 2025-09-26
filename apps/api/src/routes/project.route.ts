import { Router } from 'express';
import { verifyToken } from '../middlewares/token.middleware';
import {
  createProject,
  deleteSingleProject,
  getAllProjects,
  getSingleProject,
  updateSingleProject,
} from '../controllers/project.controller';

const router = Router();
//  /api/v1/projects

router.post('/', verifyToken, createProject);
router.get('/', verifyToken, getAllProjects);
router.get('/:id', verifyToken, getSingleProject);
router.delete('/:id', verifyToken, deleteSingleProject);
router.put('/:id', verifyToken, updateSingleProject);

// router.get("/:projectId/end-points", getAllEndpoints);
// router.post("/:projectId/end-points", createSingleEndpoint);
// router.get("/:projectId/end-points/:id", getSingleEndpoint);
// router.put("/:projectId/end-points/:id", updateSingleEndpoint);
// router.delete("/:projectId/end-points/:id", deleteSingleEndpoint);

// router.get("/:projectId/api-resources", getAllResources);

// router.post("/:projectId/api-resources", createSingleResource);
// router.get("/:projectId/api-resources/:id", getSingleResource);
// router.put("/:projectId/api-resources/:id", updateSingleResource);
// router.delete("/:projectId/api-resources/:id", deleteSingleResource);

export default router;
