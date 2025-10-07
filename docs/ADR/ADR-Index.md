# 🧭 Architecture Decision Record Index

**Project:** Compliance Platform  
**Maintainer:** Matthew Graba  
**Last Updated:** 2025-10-08  

This index provides an overview of all **Architecture Decision Records (ADRs)** that guide the technical and structural evolution of the Compliance Platform.  
Each ADR documents a single architectural choice, its motivation, consequences, and relationship to other decisions.

---

## 🧱 Core Infrastructure

| ADR ID | Title | Status | Summary | Related Modules |
|--------|--------|---------|----------|-----------------|
| [ADR-0001](./ADR-0001-Database-Setup.md) | **Database Setup** | ✅ Accepted | Adopted PostgreSQL with schema-per-subsystem model. | Auth, Audit, Core |
| [ADR-0002](./ADR-0002-Prisma-Migrations.md) | **Prisma Migrations** | ✅ Accepted | Established Prisma ORM for type-safe migrations and schema management. | All |
| [ADR-0003](./ADR-0003-Docker.md) | **Docker Integration** | 📝 Proposed | Containerize Node.js and PostgreSQL for environment parity. | DevOps, CI/CD |

---

## 🔐 Security & Access Control

| ADR ID | Title | Status | Summary | Related Modules |
|--------|--------|---------|----------|-----------------|
| [ADR-0004](./ADR-0004-RBAC.md) | **Role-Based Access Control (RBAC)** | 📝 Proposed | Implemented schema + middleware enforcement for least-privilege roles. | Auth, RBAC |
| [ADR-0005](./ADR-0005-MultiTenant-Strategy.md) | **Multi-Tenant Strategy** | 📝 Proposed | Shared DB, separate schema model for tenant isolation. | Auth, Core, RBAC |

---

## 🧩 Observability & Governance

| ADR ID | Title | Status | Summary | Related Modules |
|--------|--------|---------|----------|-----------------|
| [ADR-0006](./ADR-0006-Audit-Logging.md) | **Audit Logging** | 🔜 Planned | Define event logging architecture with ORM-level hooks and middleware. | Audit, Core |
| [ADR-0007](./ADR-0007-Diagramming-Approach.md) | **Diagramming Approach** | ✅ Accepted | Standardized Mermaid-based documentation and version control for diagrams. | Documentation |

---

## 🧭 ADR Status Key
| Symbol | Meaning |
|--------|----------|
| ✅ | **Accepted** — Implemented and active. |
| 📝 | **Proposed** — Agreed in principle, pending full implementation. |
| 🔜 | **Planned** — Scheduled for a future sprint. |
| 🧱 | **Deprecated** — Superseded by newer ADR(s). |
| 🗃️ | **Archived** — Retained for historical context only. |

---

## 🔗 Cross-Reference Map

| ADR | Depends On | Supersedes | Next Evolution |
|-----|-------------|-------------|----------------|
| 0001 | — | — | 0002 |
| 0002 | 0001 | — | 0003 |
| 0003 | 0002 | — | — |
| 0004 | 0001, 0002 | — | 0005 |
| 0005 | 0001, 0002, 0004 | — | — |
| 0006 | 0001, 0002 | — | 0007 |
| 0007 | — | — | Continuous update |

---

## 📅 Review Cadence
- ADRs are reviewed at the **start of each sprint** and updated at **major architectural milestones**.  
- Deferred or archived ADRs remain in `/docs/ADR/archive/` for traceability.  
- Each accepted ADR must include:
  - Clear *Context → Decision → Consequences* sections.  
  - Versioned file name (e.g., `ADR-0003-Docker.md`).  
  - Links to related backlog items or implementation PRs.

---

### 🧠 Notes
- ADR-0001 through 0005 define the **foundational architecture** (DB, ORM, Infra, RBAC, Multi-Tenancy).  
- ADR-0006 and 0007 set **observability and documentation standards.**  
- Future ADRs will cover:
  - `ADR-0008`: Monitoring & Alerting Stack (Prometheus, Grafana)  
  - `ADR-0009`: CI/CD Pipeline Automation  
  - `ADR-0010`: AI Audit Analysis (revival of archived ERP ADR)  

---

> “Architecture lives in documentation — not in memory.”  
> — Compliance Platform Engineering Philosophy
