import express from "express";
import { analyzeAuditLog } from "../controllers/auditAutomationController.js";

const router = express.Router();

router.post("/analyze", analyzeAuditLog);

export default router;