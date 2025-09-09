// controllers/auditController.ts
import type { Request, Response } from "express";                               // IntelliSense and compile-time checks for req/res
import { ZodError } from "zod";                                                 // distinguish “bad input” (client error 400) from server/DB failures (500)
import prisma from "../lib/prisma";
import { auditQuerySchema } from "../schemas/auditQuerySchema";                 // defines/validates/normalizes the allowed query parameters (page, limit, sort, filters)
import { Prisma } from "@prisma/client";


type AuthedRequest = Request & {
  user?: { id: number; roles?: string[]; tenantId?: number };
};

export async function listAuditLogs(req: AuthedRequest, res: Response) {
  try {
    // 1) Validate / normalize inputs
    const q = auditQuerySchema.parse(req.query);


    // 2) RBAC / tenant scope
    const isSuperAdmin = req.user?.roles?.includes("SuperAdmin") === true;                                   // If the caller is a SuperAdmin, don't restrict by tenant
    const tenantScope = isSuperAdmin ? {} : (req.user?.tenantId ? { tenantId: req.user.tenantId } : {});     // Otherwise, force a tenantId match to isolate data per tenant


    // 3) Build a Prisma WHERE safely (WHERE: Prisma's type-safe, composable way of constructing SQL filters)
    // where is built w/ conditional spreads "..." so nothing is accidently set to [undefined] (which could be later mistaken for [null] equality)
    const where: Prisma.AuditLogWhereInput = {                                  // Translate validated query params into a Prisma [where] object
      // Tenant Guard (unless SuperAdmin)
      ...(isSuperAdmin ? {} : (req.user?.tenantId ? { tenantId: req.user.tenantId } : {})),

      // equality checks (only add when provided)
      // Add each filter only if it's present (so don't accidently force [= undefined])
      // spread these key-value pairs into the object if the condition is true
      ...tenantScope,
      ...(q.userId ? { userId: q.userId } : {}),
      ...(q.action ? { action: q.action } : {}),
      ...(q.result ? { result: q.result } : {}),
      ...(q.source ? { source: q.source } : {}),
      ...(q.entityType ? { entityType: q.entityType } : {}),
      ...(q.entityId ? { entityId: q.entityId } : {}),
      ...(q.correlationId ? { correlationId: q.correlationId } : {}),
      ...(q.ip ? { ipAddress: q.ip } : {}),                                      // exact match for inet

      // Build a time range using gte/lte. Time window: [timestamp: {gte: from, lte: to} (inclusive endpoints)
      // Add a timestamp range only when from/to exist, using validated ISO dates
      ...(q.from || q.to
        ? {
            timestamp: {
              ...(q.from ? { gte: new Date(q.from) } : {}),
              ...(q.to ? { lte: new Date(q.to) } : {}),
            },
          }
        : {}),

      // Filters logs by whether they contain an error
      ...(q.hasError === undefined
          ? {}
          : q.hasError
          ? { error: { not: null } }
          : { error: null }),
    };


    // 4) Sorting (orderBy)
    // Keys come from whitelist (zod enum) 
    // Direction comes from a whitelist ("asc" | "desc")
    // Add a secondary key like {id : "desc"} for stabilitiy
    const orderBy: Prisma.AuditLogOrderByWithRelationInput = {
      [q.sort]: q.order, // safe because zod restricted keys/values
    };


    // 5) Pagination (offset)
    // Offset Pagination: [skip] jumps over (page - 1) * limit rows; [take] returns limit rows
    const page = q.page;
    const limit = q.limit;
    const skip = (page - 1) * limit;
    const take = limit;


    // 6) SELECT shape (toggle before/after; add small user projection)
    // Default to a lean row (no heavy JSON)
    // If includeBeforeAfter=true, add before and after.
    // Can include a tiny user projection for convenience in UIs.
    const baseSelect = {
      id: true,
      timestamp: true,
      action: true,
      result: true,
      source: true,
      userId: true,
      entityType: true,
      entityId: true,
      ipAddress: true,
      correlationId: true,
      error: true,
      user: { select: { id: true, email: true, name: true, role: true } },
    } as const;

    const select: Prisma.AuditLogSelect = q.includeBeforeAfter
      ? { ...baseSelect, before: true, after: true }
      : baseSelect;

    // 7) Query: Fetch total & page slice in parallel (correct order)
    // Count for total pages; findMany for the page slice.
    // Running them in parallel is faster. (Order matters in destructuring)
    const [total, rows] = await Promise.all([
      prisma.auditLog.count({ where }),
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
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const hasMore = page < totalPages;
    const nextPage = hasMore ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;


    // 8) Respond (response shape)
    // Return data, pagination metadata, current sort, and an filters echo so the UI can show active filters or rebuild query strings.
    return res.json({
      data: rows,                               // current page's rows
      page: q.page,                             // which page
      limit: q.limit,                           // how many per page
      total,                                    // total matching rows (for building page controls)
      totalPages,
      hasMore,
      nextPage,
      prevPage,
      sort: q.sort,
      order: q.order,
      // echo filters the client might want to show as "active filters"
      filters: {
        userId: q.userId ?? null,
        action: q.action ?? null,
        entityType: q.entityType ?? null,
        entityId: q.entityId ?? null,
        result: q.result ?? null,
        source: q.source ?? null,
        correlationId: q.correlationId ?? null,
        ip: q.ip ?? null,
        from: q.from ?? null,
        to: q.to ?? null,
        hasError: q.hasError ?? null,
        includeBeforeAfter: q.includeBeforeAfter,
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        error: "Invalid query parameters",
        issues: err.flatten(),
      });
    }
    console.error("[listAuditLogs] unexpected error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
