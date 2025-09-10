// controllers/auditController.ts
import type { Request, Response } from "express";                               // IntelliSense and compile-time checks for req/res
import { ZodError } from "zod";                                                 // distinguish “bad input” (client error 400) from server/DB failures (500)
import prisma from "../lib/prisma";
import { auditQuerySchema } from "../schemas/auditQuerySchema";                 // defines/validates/normalizes the allowed query parameters (page, limit, sort, filters)
import { Prisma } from "@prisma/client";

// TypeScript type augmentation: extends Express's request type with authentication info, so req.user can safely be used in controllers w/o TypeScript errors
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
      ...(q.from || q.to ? { timestamp: {
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
    const orderBy: Prisma.AuditLogOrderByWithRelationInput[] = [
      { [q.sort]: q.order }, // safe because zod restricted keys/values
      { id: "desc" },        // fallback for stable ordering
    ];


    // 5) SELECT shape (toggle before/after; add small user projection)
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


    // 6) Pagination: breaking up a huge dataset into smaller "pages" of results
    // Cursor Pagination: "Give me the next 20 results starting after this specific item"
    const usingCursor = !!q.cursor;
    if (usingCursor) {
      // 7) Query (cursor): fetch limit+1 to detect hasMore
      const rowsPlusOne = await prisma.auditLog.findMany({
        where,
        orderBy,                                                      // passing [where] object into findMany()
        take: q.limit,                                                // how many records to fetch (positive = forward, negative = backward)
        skip: q.cursor ? 1 : 0,                                       // how many to skip (always 1 when using a cursor, to skip the cursor item itself)
        cursor: q.cursor ? { id: Number(q.cursor) } : undefined,      // the position to start after (usually [id] of the last record from the previous page)
        select,
      });

      const hasMore = rowsPlusOne.length > q.limit;
      const rows = hasMore ? rowsPlusOne.slice(0, q.limit) : rowsPlusOne;
      const nextCursor = hasMore ? rows[rows.length - 1].id : null;

    // 8) Respond (cursor-style metadata)
    return res.json({
      data: rows,
      // cursor meta
      nextCursor,
      hasMore,

      // echo sort + filters for UI
      sort: q.sort,
      order: q.order,
      page: null,
      total: null,
      totalPages: null,
      nextPage: null,
      prevPage: null,
      limit: q.limit,
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
        includeBeforeAfter: q.includeBeforeAfter ?? false,
      },
    });
  } else {
    // Offset pagination (page/limit)
    const page = q.page ?? 1;
    const limit = q.limit;
    const skip = (page - 1) * limit;

    // 7) Query (offset): count + page slice in parallel
    const [total, rows] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    const hasMore = page < totalPages;
    const nextPage = hasMore ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    // 8) Respond (page-style metadata)
    return res.json({
      data: rows,
      page,
      limit,
      total,
      totalPages,
      hasMore,
      nextPage,
      prevPage,

      // cursor fields are null in page mode
      nextCursor: null,

      // echo sort + filters
      sort: q.sort,
      order: q.order,
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
        includeBeforeAfter: q.includeBeforeAfter ?? false,
      },
    });
  }
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
