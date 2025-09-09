import { z } from "zod";
import prisma from "../../lib/prisma";

// Cursor is a pair: { ts: string, id: number } encoded as base64 on the wire
const keysetSchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(25),
    cursor: z.string().optional(), // base64 of JSON { ts, id }
    sort: z.enum(["timestamp"]).default("timestamp"), // keep fixed for keyset
    order: z.enum(["desc","asc"]).default("desc"),
    // same filters as above...
  });
  
  export async function listAuditLogsKeyset(req, res) {
    const isSuperAdmin = req.user.roles?.includes("SuperAdmin");
    const tenantScope = isSuperAdmin ? {} : { tenantId: req.user.tenantId };
    const q = keysetSchema.parse(req.query);
  
    const where = {
      ...tenantScope,
      // ... same filters as (A)
    };
  
    // decode cursor if present
    let cursorFilter = {};
    if (q.cursor) {
      const { ts, id } = JSON.parse(Buffer.from(q.cursor, "base64").toString("utf8"));
      // For DESC sort: fetch rows strictly "before" the cursor
      cursorFilter =
        q.order === "desc"
          ? { OR: [{ timestamp: { lt: new Date(ts) } }, { timestamp: new Date(ts), id: { lt: id } }] }
          : { OR: [{ timestamp: { gt: new Date(ts) } }, { timestamp: new Date(ts), id: { gt: id } }] };
    }
  
    const items = await prisma.auditLog.findMany({
      where: { AND: [where, cursorFilter] },
      orderBy: [{ timestamp: q.order }, { id: q.order }], // composite deterministic order
      take: q.limit + 1, // grab one extra to compute hasNext
      include: { user: true },
    });
  
    const hasNext = items.length > q.limit;
    const slice = hasNext ? items.slice(0, q.limit) : items;
  
    const nextCursor = hasNext
      ? Buffer.from(
          JSON.stringify({ ts: slice[slice.length - 1].timestamp.toISOString(), id: slice[slice.length - 1].id })
        ).toString("base64")
      : null;
  
    res.json({ limit: q.limit, nextCursor, items: slice });
  }
  