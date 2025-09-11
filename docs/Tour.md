# System Tour
> System Tour (system flow and how to navigate code): This is the single entry point for “what lives where” and “how one real request flows through the system.” Must be kept short, visual, and operational (links to code, dashboards, tests).

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
```

## Key Invariants
- Tenant isolation: non-SuperAdmins always tenant-scoped.
- Pages are deterministic: tie-break with `id desc`.
- Limit: 1–100 (default 20).
- Redaction: see [redactAuditLog.ts](../server/src/lib/audit/redact.ts).
- Errors: ZodError → 400, Tenant violations → 403, Unexpected → 500.

## Common Recipes (summary)
- Add a new filter → update schema, where-builder, tests, dashboards.  
  See [Adding-AuditLog-Filter.md](recipes/Adding-AuditLog-Filter.md).  
- Add a DB index → update schema, migrate, verify.  
  See [Adding-DB-Index.md](recipes/Adding-DB-Index.md).  
- Add a role → extend `roles.ts`, update RBAC matrix.  
  See [Adding-Role.md](recipes/Adding-Role.md).  
- Add a log field → schema + migration, update redact list, dashboards.  
  See [Adding-Log-Field.md](recipes/Adding-Log-Field.md).

## RBAC Matrix (quick reference)
| Role       | List | Create | Delete | Tenant Scope | Notes          |
|------------|------|--------|--------|--------------|----------------|
| SuperAdmin | ✔    | ✔      | ✔      | None         | Full access    |
| Admin      | ✔    | ✔      | ✖      | Required     | No cross-tenant|
| Manager    | ✔    | ✖      | ✖      | Required     |                |
| Auditor    | ✔    | ✖      | ✖      | Required     | Read-only      |

## Links
- [AuditLogs.md](components/AuditLogs.md)
- [auditController.ts](../server/src/controllers/auditController.ts)
- [auditService.ts](../server/src/services/auditService.ts)
- [auditQuerySchema.ts](../server/src/schemas/auditQuerySchema.ts)
- [roles.ts](../server/src/lib/auth/roles.ts)
- [redact.ts](../server/src/lib/audit/redact.ts)
- [audit tests](../server/tests/audit)
- [dashboards](../ops/grafana/audit-logs.json)
- [runbook](runbooks/audit-logs.md)
