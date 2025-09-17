import { Router } from "express";
import { handleMockRequest } from "../controllers/mock.controller";

import { verifyToken } from "../middlewares/token.middleware";

const router = Router();

router.all("/*path", verifyToken, handleMockRequest);

export default router;
