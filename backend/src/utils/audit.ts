// utils/audit.ts
import prisma from "../lib/prisma";

export async function logAction({
  userId, tenantId, action, entityType, entityId,
  before, after, result = "success", error, source = "api",
  ipAddress, userAgent, correlationId,
}: {
  userId?: number; tenantId?: number; action: string;
  entityType?: string; entityId?: string;
  before?: any; after?: any;
  result?: "success"|"fail"; error?: string;
  source?: "ui"|"api"|"job"|"webhook";
  ipAddress?: string; userAgent?: string; correlationId?: string;
}) {
  try {
    await prisma.auditLog.create({
        data: {
          timestamp: new Date(),
          userId: req.user?.id ?? null,
          action: "UPDATE",
          entityType: "InventoryItem",
          entityId: item.id,
          result: "SUCCESS",
          before: prune(beforeItem),
          after: prune(afterItem),
          ipAddress: req.ip,                    // or resolved from X-Forwarded-For
          userAgent: req.get("User-Agent"),
          source: "WEB",
          tenantId: req.user.tenantId,
          correlationId: req.correlationId,
        },
      });
      
  } catch (e) {
    // never throw from auditing; log to stderr/observability
    console.error("audit failed", e);
  }
}
