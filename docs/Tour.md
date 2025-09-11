# System Tour (system flow and how to navigate code): This is the single entry point for “what lives where” and “how one real request flows through the system.” Keep it short, visual, and operational (links to code, dashboards, tests).

# 10-Minute Tour
> Who this is for: new contributors and Future Me. Start here.

## 1) Context Diagram (runtime data flow)

Client (Web/CLI)
    │
    ▼
[Express Router] → [Controller] → [Service] → [Prisma ORM] → [PostgreSQL]
                               └──────────────────────────→ [External APIs: METRC/Isolocity]
                                └────────────────────────→ [AuditLog Writer / Queue]
                                 └──────────────────────→ [Telemetry: Logs/Metrics/Tracing]

### Files
- Router: `server/src/routes/*.ts`
- Controllers: `server/src/controllers/*.ts`
- Services: `server/src/services/*.ts`
- Prisma schema: `server/prisma/schema.prisma`
- METRC adapter: `server/src/integrations/metrc/*.ts`
- Audit logger: `server/src/lib/audit/*.ts`

## 2) One Request Walkthrough — `GET /audit-logs`

**Goal:** return a tenant-scoped, cursor-paginated list of audit logs.

**Happy path:**
1. **Validation** (`Zod`): `auditQuerySchema` parses/normalizes query — enforces limits, enum keys, defaults.
2. **RBAC & Tenant scope**:
   - `SuperAdmin` bypasses tenant restriction.
   - Others restricted to `req.user.tenantId`.
3. **WHERE builder (Prisma)**: translate validated filters (e.g., `action`, `entity`, `userId`, `ipAddress`, `createdAtRange`) into a safe `where` object (no `undefined`).
4. **Ordering**: `orderBy = [{ [q.sort]: q.order }, { id: "desc" }]` for deterministic pagination.
5. **Pagination (cursor)**:
   - `cursor: q.cursor ? { id: Number(q.cursor) } : undefined`
   - `skip: q.cursor ? 1 : 0`
   - `take: q.limit` (capped at 100)
6. **Redaction**: strip/blur PII fields unless `SuperAdmin`.
7. **Response shape**: `{ items, nextCursor, hasMore }` (no total count with cursor paging).

**Example:**
```http
GET /audit-logs?entity=Order&action=UPDATE&limit=20&sort=createdAt&order=desc
Authorization: Bearer <JWT>

### Pseudocode:

const q = auditQuerySchema.parse(req.query);
guardAuth(req.user);

const where = buildAuditWhere(q, req.user);
const orderBy = [{ [q.sort]: q.order }, { id: "desc" }];

const items = await prisma.auditLog.findMany({
  where,
  orderBy,
  take: q.limit,
  cursor: q.cursor ? { id: Number(q.cursor) } : undefined,
  skip: q.cursor ? 1 : 0,
});

const safeItems = items.map(redactAuditLog(req.user));
const nextCursor = items.length === q.limit ? String(items.at(-1)!.id) : undefined;

res.json({ items: safeItems, nextCursor, hasMore: Boolean(nextCursor) });

### Response (example):

{
  "items": [
    {
      "id": 981231,
      "tenantId": 42,
      "timestamp": "2025-09-10T15:45:30.123Z",
      "actor": { "id": 7, "role": "Manager" },
      "entity": "Order",
      "entityId": "ORD-2025-0001",
      "action": "UPDATE",
      "ipAddress": "REDACTED",
      "diff": { "status": ["Processing", "Fulfilled"] }
    }
  ],
  "nextCursor": "981230",
  "hasMore": true
}
