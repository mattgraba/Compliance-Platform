// controllers/auditController.ts
import type { Request, Response } from "express";                               // IntelliSense and compile-time checks for req/res
import prisma from "../lib/prisma";
import { auditQuerySchema } from "../schemas/auditQuerySchema";                 // defines/validates/normalizes the allowed query parameters (page, limit, sort, filters)
import { ZodError } from "zod";                                                 // distinguish “bad input” (client error 400) from server/DB failures (500)
import { Prisma } from "@prisma/client";


type AuthedRequest = Request & {
  user?: { id: number; roles?: string[]; tenantId?: number };
};

export async function listAuditLogs(req: AuthedRequest, res: Response) {
  try {
    // 1) Validate inputs
    const q = auditQuerySchema.parse(req.query);

    // 2) Build Prisma filters
    // Starts w/ an empty object & conditionally adds fields so we only filter on provided knobs
    const where: any = {};                                                      // Why any? Quick way to allow conditional shape building; could define a typed [Prisma.AuditLogWhereInput] for stricter typing
    if (q.ip) where.ipAddress = { contains: q.ip, mode: "insensitive" };        // case-insensitive substring match (good for partial IPs or action names)
    if (q.action) where.action = { contains: q.action, mode: "insensitive" };
    if (q.entityType) where.entityType = q.entityType;
    if (q.entityId) where.entityId = q.entityId;
    if (q.from || q.to) {
      where.timestamp = {};
      if (q.from) where.timestamp.gte = new Date(q.from);                       // date range filtering; uses inclusive bounds
      if (q.to) where.timestamp.lte = new Date(q.to);
    }

    // RBAC/tenant scoping
    const isSuperAdmin = req.user?.roles?.includes("SuperAdmin");               // If the caller is a SuperAdmin, don't restrict by tenant
    const tenantScope = isSuperAdmin ? {} : { tenantId: req.user?.tenantId };   // Otherwise, force a tenantId match to isolate data per tenant
    Object.assign(where, tenantScope);                                          // Object.assign merges the scope into the existing where

    // 3) Pagination + sorting                                                  // Offset Pagination: [skip] jumps over (page - 1) * limit rows; [take] returns limit rows
    const take = q.limit;
    const skip = (q.page - 1) * q.limit;                                        

    // Safe orderBy mapping (names already constrained by Zod)
    const orderBy = { [q.sort]: q.order } as const;

    // 4) Query
    const [rows, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy,
        skip,
        take,
        // Narrow what is returned to avoid leaking fields (adjust as needed)
        select: {
          id: true,
          timestamp: true,
          action: true,
          entityType: true,
          entityId: true,
          result: true,
          error: true,
          ipAddress: true,
          userId: true,
          user: { select: { id: true, email: true, name: true, role: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Response shape
    res.json({
      page: q.page,         // which page
      limit: q.limit,       // how many per page
      total,                // total matching rows (for building page controls)
      rows,                 // current page's rows
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        error: "Invalid query parameters",
        issues: err.flatten(),
      });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
