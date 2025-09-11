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
