// routes/auditRoutes.ts
import express from "express";
import { listAuditLogs } from "../controllers/auditController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = express.Router();
router.get("/", authenticate, authorize(["Admin","Compliance","SuperAdmin"]), listAuditLogs);
export default router;
