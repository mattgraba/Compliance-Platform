// controllers/auditController.ts
import { z } from "zod";
import prisma from "../lib/prisma";

// Query schema for audit logs
const qSchema = z.object({
    page:  z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(25),
    sort:  z.enum(["timestamp","action","result","entityType","userId"]).default("timestamp"),
    order: z.enum(["asc","desc"]).default("desc"),
    action:      z.string().trim().optional(),
    entityType:  z.string().trim().optional(),
    entityId:    z.string().trim().optional(),
    userId:      z.coerce.number().int().optional(),
    result:      z.enum(["success","fail"]).optional(),
    from:        z.string().datetime().optional(), // ISO 8601
    to:          z.string().datetime().optional(),
  });

  // List audit logs
  export async function listAuditLogs(req, res) {
    // RBAC/tenant scope
    const isSuperAdmin = req.user?.roles?.includes("SuperAdmin");
    const tenantScope  = isSuperAdmin ? {} : { tenantId: req.user?.tenantId };
  
    const q = qSchema.parse(req.query);
    const where = {
      ...tenantScope,
      action:     q.action ? { contains: q.action, mode: "insensitive" } : undefined,
      entityType: q.entityType ?? undefined,
      entityId:   q.entityId ?? undefined,
      userId:     q.userId ?? undefined,
      result:     q.result ?? undefined,
      timestamp:  (q.from || q.to) ? {
        gte: q.from ? new Date(q.from) : undefined,
        lte: q.to   ? new Date(q.to)   : undefined,
      } : undefined,
    };

    const [total, rows] = await Promise.all([
        prisma.auditLog.count({ where }),
        prisma.auditLog.findMany({
          where,
          orderBy: { [q.sort]: q.order },
          skip: (q.page - 1) * q.limit,
          take: q.limit,
          include: { user: { select: { id: true, email: true, name: true, roles: true } } },
        }),
      ]);

      res.json({
        page: q.page, limit: q.limit, total,
        pages: Math.ceil(total / q.limit),
        rows,
      });
    }