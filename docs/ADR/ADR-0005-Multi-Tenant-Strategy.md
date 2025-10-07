# ADR-0005: Multi-Tenant Strategy

**Status:** Proposed  
**Date:** 2025-10-08  

---

## Context
The Compliance Platform will support multiple client organizations, each requiring data isolation for compliance and privacy.  
Tenant separation must balance simplicity, cost, and scalability while remaining Prisma-friendly.

---

## Decision
- Adopt **Shared Database, Separate Schemas** approach:
  - Each tenant owns its own schemas (`tenant1.auth`, `tenant1.audit`, …).  
- Maintain a central `core.tenants` table for metadata:
    ```sql
    CREATE TABLE core.tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE,
    schema_name VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
    );
    ```
- Application layer resolves tenant context from JWT or subdomain and connects dynamically.
- Re-evaluate per-tenant DB strategy once scale exceeds operational threshold.

---

## Consequences

**Positive**
- Strong logical isolation with manageable complexity.
- Seamless integration with existing schema-based module layout.
- Enables growth into true SaaS model.

**Negative**
- More complex migration and backup processes.
- Slightly weaker isolation than separate physical databases.

---

## References
- ADR-0001 Database Setup
- ADR-0002 Prisma Migrations
- ADR-0004 RBAC
