// schemas/auditQuerySchema.ts
// Zod query schema (query validation/normalization)

import { z } from "zod";
import { AuditAction, AuditResult, LogSource } from "@prisma/client";

export const auditQuerySchema = z.object({
  // pagination
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),

  // sorting
  sort: z.enum([
    "timestamp", "action", "userId", "entityType", "result", "source", "ipAddress"
  ]).default("timestamp"),
  order: z.enum(["asc","desc"]).default("desc"),

   // filters (all optional)
  userId: z.coerce.number().int().optional(),
  action: z.nativeEnum(AuditAction).optional(),             // native.Enum: Lets Zod validate against a real TypeScript/Prisma enum instead of needing to hardcode a string list
  entityType: z.string().max(40).trim().optional(),
  entityId: z.string().max(64).trim().optional(),
  result: z.nativeEnum(AuditResult).optional(),             // enum-safe (below as well)
  source: z.nativeEnum(LogSource).optional(), 
  ip: z.string().ip().optional(),                           // exact match for @db.Inet              
  correlationId: z.string().uuid().optional(),              // validates that the string is a proper UUID (v1, v4, etc.)
  // ^ CorrelationID = a unique ID used to tie related AuditLog entries together across systems across systems or requests
  // Ex) If a user action kicks off multiple database writes & API calls, all the audit logs for that action can share the same correlationId.
  //     Makes it easy to trace/debug an entire transaction or workflow


  // ISO 8601 window (inclusive): Allows filtering logs by a time range (from / to)
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),

  // Payload Controls: *What extra data to include or filter* in the actual audit log records returned to the client.
  includeBeforeAfter: z.coerce.boolean().default(false),    // Control whether query should return the *"before" and "after" snapshots* of the entity involved in the audit log
  hasError: z.coerce.boolean().optional(),                  // true => error != null, false => error is null
  // ^ Audit logs often include a field like [error]: 1) [null] if everything succeeded. 2) A string or JSON object describing what went wrong if it failed
  // How it works: If True -> return only logs where [error != null]. False -> logs where [error == null]. If hasError is omitted -> don't filter by error at all.


  // [.refine()] Ensures that [from] isn't later than [to]
}).refine((q) => !(q.from && q.to) || new Date(q.from) <= new Date(q.to), {
  message: "`from` must be <= `to`",
  path: ["from"],
});