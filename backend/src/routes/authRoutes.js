// routes/authRoutes.js
import express from "express";
import { register, login } from "../controllers/authController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authenticate, authorize("Admin"), register);
router.post("/login", login);

export default router;
