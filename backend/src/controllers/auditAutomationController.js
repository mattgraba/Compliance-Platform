import { enrichAuditLog } from "../services/aiAutomationService.js";

export const analyzeAuditLog = async (req, res) => {
    try {
        const { log } = req.body; // expecting { log: { ...auditLogData } }

        if (!log) {
            return res.status(400).json({ error: "Missing audit log entry"});
        }

        const enriched = await enrichedAuditLog(log);

        res.json({ enriched });
    } catch (err) {
        console.error("Error analyzing audit log:", err);
        res.status(500).json({ error: "Failed to analyze audit log" });
    }
};