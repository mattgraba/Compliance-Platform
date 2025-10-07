# ADR-0004: Role-Based Access Control (RBAC)

**Status:** Proposed  
**Date:** 2025-10-08  

---

## Context
The Compliance Platform must enforce least-privilege access across users and tenants to align with ISO and cGMP compliance requirements.  
Roles define which actions a user may perform across modules such as Auth, Audit, and SOP management.

---

## Decision
- Implement **RBAC** at both database and application layers.  
- Core models:
  - `auth.roles`  
  - `auth.user_roles` (junction table)  
- Enforce permissions through:
  - Middleware (`authorize(allowedRoles)`)  
  - DB constraints and views as needed.  
- Define standard roles:  
  - `ADMIN` — manage organization configuration  
  - `AUDITOR` — read-only access to audit logs  
  - `OPERATOR` — perform day-to-day actions  
  - `GUEST` — limited reporting access

---

## Consequences
**Positive**
- Enables clear separation of duties.  
- Compliant with regulatory frameworks requiring access controls.  
- Scales into multi-tenant architecture with minimal rework.

**Negative**
- Additional join logic for role resolution.  
- Requires careful synchronization between middleware and DB enforcement.

---

## References
- ADR-0001 Database Setup  
- ADR-0005 Multi-Tenant Strategy