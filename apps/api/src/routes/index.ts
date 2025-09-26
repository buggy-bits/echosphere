import { Router } from 'express';
import healthRoutes from './health.route';
import authRoutes from './auth.route';
import projectRoutes from './project.route';
import mockRoutes from './mock.route';
import usersRoute from './user.route';
import endpointRoutes from './endpoint.route';
import resourceRoutes from './resource.route';
import { attachProjectToRequest } from '../middlewares/mock.middleware';
import { verifyToken } from '../middlewares/token.middleware';

const router = Router();
//          /api/v1
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/user', usersRoute);
router.use('/endpoints', endpointRoutes);
router.use('/resources', resourceRoutes);
router.use(
  '/mock/projects/:projectId',
  // verifyToken,
  attachProjectToRequest,
  mockRoutes
);
export default router;
