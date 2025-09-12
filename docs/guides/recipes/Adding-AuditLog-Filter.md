# Recipe: Adding a New AuditLog Filter

## Purpose
Extend the AuditLogs endpoint to support a new filter (e.g., `actionCategory`).

---

## Steps

### 1. Schema
- Update `auditQuerySchema` (Zod):
  - Add the new filter key.
  - If it’s an enum, restrict to known values.
  - Make it optional.

### 2. WHERE Builder
- In `buildAuditWhere()`:
  - Map the new query param into the Prisma `where` clause.
  - Ensure you handle `undefined` safely (conditional spread).

### 3. Index (if needed)
- Update `schema.prisma` with a composite index if query performance depends on this filter.  
  Example:
  ```prisma
  @@index([tenantId, actionCategory, createdAt, id])
  ```
- Run migration:
  ```bash
  npx prisma migrate dev -n "add_index_for_actionCategory"
  ```
- Verify with `EXPLAIN` on representative queries.

### 4. Tests
- Unit: auditQuerySchema parses and rejects invalid values.
- Integration: controller returns correct results when filter is applied.
- Seeds: update test data to cover the new filter.

### 5. Documentation
- Update:
    - [Tour.md](../Tour.md): Add the filter to the parameters table.
    - [API Reference](): Describe the new query param
    - [Dashboards](): Update if the filter affects cardinality

### 6. Dashboards (optional)
- If Grafana panels or sampling rely on this field, add new panels or filters.

---

## Example

### Before
```sql
GET /audit-logs?action=UPDATE
```

### After
```bash
GET /audit-logs?actionCategory=INVENTORY
```
