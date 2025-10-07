# ADR-0001: Database Setup

**Status:** Accepted  
**Date:** 2025-10-08  

---

## Context
The Compliance Platform requires a durable and secure relational database to support modular subsystems such as Authentication, Audit Logging, RBAC, and Quality Management.  
Because each module demands clear data boundaries and auditability, schema separation and transactional reliability are mandatory.

PostgreSQL was chosen for:
- Proven ACID compliance and reliability.  
- Native support for multiple schemas.  
- Strong tooling ecosystem and Prisma compatibility.

---

## Decision
- Adopt **PostgreSQL** as the primary DBMS.  
- Use a **schema-per-subsystem** pattern:
  - `auth` for authentication and user management  
  - `audit` for event logging  
  - `core` or `shared` for system-wide tables  
- Manage connections through environment variables:
    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/compliance
    ```
- Standardize migration and ORM handling under Prisma (ADR-0002).

---

## Consequences
**Positive**
- Modular, logical separation of data domains.  
- Schema-level access control improves security and traceability.  
- Simplifies future multi-tenant and RBAC expansion.

**Negative**
- Slight overhead in schema management as modules grow.  
- Must document schema ownership and naming conventions to avoid drift.

---

## References
- ADR-0002 Prisma Migrations  
- ADR-0005 Multi-Tenant Strategy