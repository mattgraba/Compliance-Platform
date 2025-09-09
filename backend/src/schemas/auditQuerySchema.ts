// schemas/auditQuerySchema.ts
import { z } from "zod";
import { AuditAction, AuditResult, LogSource } from "@prisma/client";

export const auditQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  sort: z.enum([
    "timestamp", "userId", "action", "result", "source", "entityType", "ipAddress"
  ]).default("timestamp"),
  order: z.enum(["asc","desc"]).default("desc"),

   // filters
  userId: z.coerce.number().int().optional(),
  ip: z.string().ip().optional(),                           // exact match for @db.Inet
  action: z.nativeEnum(AuditAction).optional(),             // enum-safe
  result: z.nativeEnum(AuditResult).optional(),
  source: z.nativeEnum(LogSource).optional(),
  entityType: z.string().max(40).trim().optional(),
  entityId: z.string().max(64).trim().optional(),
  correlationId: z.string().uuid().optional(),

  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),

  // payload controls
  includeBeforeAfter: z.coerce.boolean().default(false),
  hasError: z.coerce.boolean().optional(), // true => error != null, false => error is null
}).refine((q) => !(q.from && q.to) || new Date(q.from) <= new Date(q.to), {
  message: "`from` must be <= `to`",
  path: ["from"],
});