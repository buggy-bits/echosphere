import { Router } from 'express';

import {
  createSingleResource,
  deleteSingleResource,
  updateSingleResource,
} from '../controllers/resource.controller';
import { getAllResources } from '../controllers/resource.controller';

const router = Router();
//  /api/v1/resources
// projectId?=id

router.get('/', getAllResources);
router.post('/', createSingleResource);
router.put('/', updateSingleResource);
router.delete('/', deleteSingleResource);

export default router;
