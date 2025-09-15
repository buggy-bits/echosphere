import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";

const router = Router();
//  /api/v1/auth
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
