# Audit Logs (Component)
> How to use the audit log feature in our system.

## Purpose
Provide a complete, immutable record of all significant actions.  
Supports internal compliance and external integration (METRC, Isolocity).

---

## Data Model
```prisma
model AuditLog {
  id          Int      @id @default(autoincrement())
  userId      Int
  tenantId    Int
  action      String
  details     Json
  ipAddress   String?
  timestamp   DateTime @default(now())
}
```


### Attributes
- `userId`: actor who performed the action
- `tenantId`: scope for multi-tenancy
- `action`: what was done ("update_inventory", "delete_user")
- `details`: flexible JSON blob for metadata
- `timestamp`: timestamp for ordering


### Constraints
- `action`: enum of allowed strings (CREATE, UPDATE, DELETE).
- `details`: must always include entity + entityId.
    - Example:
    ```json
    {
    "entity": "Order",
    "entityId": "ORD-2025-0001",
    "changes": { "status": ["Pending", "Fulfilled"] }
    }
    ```
- `ipAddress`: nullable, but must be present for external requests.

---

## Controller (`listAuditLogs`)

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


### Pseudocode
```ts
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
```

### Query Logic
#### Prisma 'where' clause

```ts
const where: Prisma.AuditLogWhereInput = {
  ...(isSuperAdmin ? {} : { tenantId: req.user?.tenantId }),
  ...(q.userId ? { userId: q.userId } : {}),
  ...(q.action ? { action: q.action } : {}),
};
```

### Redaction rules

| Field     | Who Sees        | Notes                   |
|:----------|:----------------|:------------------------|
| ipAddress | SuperAdmin only | Others see "REDACTED"   |
| diff      | All roles       | Required for compliance |


### Response shape (example):
```json
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
```

---

## Integration

- **METRC**: daily sync batch job via cron + API client.
- **Isolocity**: webhook subscription triggers log push within 5s.

---

## Recipes

- [Adding a new filter](../recipes/Adding-AuditLog-Filter.md)
- [Adding a new DB index](../recipes/Adding-DB-Index.md)
- [Adding a new role](../recipes/Adding-Role.md)

---

## Scaling Considerations

- Expected millions of rows per tenant.
- Partitioning/indexing strategy TBD.
- Consider log archival after X months.
- Ensure compound index on (tenantId, timestamp) for fast scoped queries.
- Plan log retention policy (e.g., archive to S3 after 18 months, purge after 7 years for compliance).