// controllers/auditController.ts
import { z } from "zod";
import prisma from "../../lib/prisma";

const qSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  sort: z.enum(["timestamp","userId","ipAddress","action"]).default("timestamp"),
  order: z.enum(["asc","desc"]).default("desc"),
  userId: z.coerce.number().int().optional(),
  ip: z.string().trim().optional(),
  action: z.string().trim().optional(),
  from: z.string().datetime().optional(), // ISO 8601
  to: z.string().datetime().optional(),
});

export async function listAuditLogs(req, res) {
  const isSuperAdmin = req.user.roles?.includes("SuperAdmin");
  const tenantScope = isSuperAdmin ? {} : { tenantId: req.user.tenantId };

  const q = qSchema.parse(req.query);
  const where = {
    ...tenantScope,
    ...(q.userId ? { userId: q.userId } : {}),
    ...(q.ip ? { ipAddress: { contains: q.ip } } : {}),
    ...(q.action ? { action: { contains: q.action, mode: "insensitive" } } : {}),
    ...(q.from || q.to
      ? { timestamp: { ...(q.from ? { gte: new Date(q.from) } : {}), ...(q.to ? { lte: new Date(q.to) } : {}) } }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { [q.sort]: q.order },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      include: { user: true },
    }),
    prisma.auditLog.count({ where }),
  ]);

  res.json({
    page: q.page,
    limit: q.limit,
    total,
    totalPages: Math.ceil(total / q.limit),
    items,
  });
}
