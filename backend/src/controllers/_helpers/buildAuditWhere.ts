// controllers/_helpers/buildAuditWhere.ts
import { Prisma } from "@prisma/client";
import { AuditQuery } from "../../schemas/auditQuerySchema";

export function buildAuditWhere(q: AuditQuery, tenantScope: { tenantId: number } | {}) {
  const where: Prisma.AuditLogWhereInput = { ...tenantScope };

  if (q.userId) where.userId = q.userId;
  if (q.action) where.action = q.action;
  if (q.entityType) where.entityType = q.entityType;
  if (q.entityId) where.entityId = q.entityId;
  if (q.result) where.result = q.result;
  if (q.ip) where.ipAddress = { contains: q.ip, mode: "insensitive" };

  if (q.from || q.to) {
    where.timestamp = {
      gte: q.from ? new Date(q.from) : undefined,
      lte: q.to ? new Date(q.to) : undefined,
    };
  }

  // “q” full-text-ish convenience: search a couple of string columns
  if (q.q) {
    where.OR = [
      { action: { contains: q.q, mode: "insensitive" } },
      { entityType: { contains: q.q, mode: "insensitive" } },
      { entityId: { contains: q.q, mode: "insensitive" } },
      { ipAddress: { contains: q.q, mode: "insensitive" } },
      { result: { contains: q.q, mode: "insensitive" } },
    ];
  }

  return where;
}
