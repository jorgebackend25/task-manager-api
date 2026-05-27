import { Router } from "express";
import {
  register,
  login,
  profile,
  logout,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validate.schema.js";
import { registerSchema, loginSchema } from "../schema/auth.schema.js";
import { authRequired } from "../middlewares/validatetoken.js";
const router = Router();

router.get("/profile", authRequired, profile);
router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);

export default router;
