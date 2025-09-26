import { Router } from 'express';

import {
  getSingleEndpoint,
  createSingleEndpoint,
  updateSingleEndpoint,
  deleteSingleEndpoint,
  getAllEndpoints,
} from '../controllers/endpoint.controller';

const router = Router();
//  /api/v1/endpoints

router.get('/', getAllEndpoints);
router.post('/', createSingleEndpoint);
router.get('/:endpointId', getSingleEndpoint);
router.put('/:endpointId', updateSingleEndpoint);
router.delete('/:endpointId', deleteSingleEndpoint);

export default router;
