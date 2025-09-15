import { Router } from "express";
import {
  loginUser,
  newAccessToken,
  registerUser,
} from "../controllers/auth.controller";

const router = Router();
//  /api/v1/auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/token/refresh", newAccessToken);
export default router;
