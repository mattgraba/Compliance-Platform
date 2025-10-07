# Project Backlog

This backlog tracks **open decisions**, **concepts**, **and future enhancements** for the Compliance-Platform System. Items may originate from ADRs (Proposed), technical spikes, or project planning.
---

## 🏷 Backlog Tagging Convention
Use these tags to categorize backlog items:
- `CONCEPT` → Idea or area of exploration, not yet formalized (e.g., “Should we use OAuth?”).
- `DECISION` → Linked to an ADR (Proposed). Waiting to be Accepted/Rejected.
- `HOWTO` → Practical implementation recipe needed (e.g., “How to reset DB safely”).
- `OPEN` → Still active, not resolved/closed.

#### Example
```css- [DECISION][OPEN] ADR-0004-RBAC → Decide on RBAC implementation strategy.
- [CONCEPT][OPEN] OAuth vs JWT → Evaluate external integrations.
- [HOWTO][OPEN] Docker setup → Document dev environment bootstrap.
```
---

## 🧭 Active Development Queue (Sprint: Oct 6–12)

Focused on completing the **Auth System** and restoring daily CI/CD integration.

| ID | Area | Task | Status | Tags | Notes |
|----|------|-------|--------|------|-------|
| AUTH-01 | Auth | Complete Register/Login routes (POST /register, /login) | 🚧 In Progress | `HOWTO`, `FEATURE` | bcrypt hashing, input validation |
| AUTH-02 | Auth | Implement JWT verification middleware | 🔜 To Do | `HOWTO`, `Security` | attach req.user, handle expiry |
| AUTH-03 | Auth | Create Protected `/me` route | 🔜 To Do | `HOWTO`, `Feature`, `Test` | test JWT auth |
| AUTH-04 | Auth | Integrate error-handling + Zod validation | 🔜 To Do | `HOWTO`, `Validation`, `Middleware` | schema enforcement |
| AUTH-05 | CI/CD | Setup GitHub Actions workflow for ERP-System | 🔜 To Do | `CONCEPT`, `DevOps`, `CI/CD` | lint/test on push |
| AUTH-06 | Docs | Document full Auth flow in `docs/concepts/AuthSystem.md` | 🔜 To Do | `HOWTO`, `Docs` | include mermaid diagram |
| AUTH-07 | Review | Test Postman Register/Login/Protected route flow | 🔜 To Do | `HOWTO`, `Testing` | verify token behavior |

**Sprint Goal:**  
- ✅ Auth System fully functional (register → login → token verify → protected route).  
- ✅ Daily commits + CI/CD runs reestablished.

---

## 🔄 Related ADRs

The following backlog items are formalized as ADRs:

- [ADR-0002: Prisma Migrations](./ADR/ADR-0002-Prisma-Migrations.md)
- [ADR-0003: Docker](./ADR/ADR-0003-Docker.md)
- [ADR-0004: RBAC](./ADR/ADR-0004-RBAC.md)
- [ADR-0005: Multi-Tenant Strategy](./ADR/ADR-0005-MultiTenant-Strategy.md)
---

## 🔄 ADR-Linked Decisions (Proposed)
| ADR ID                                             | Title                                                          | Status      | Tags                                                   |
| -------------------------------------------------- | -------------------------------------------------------------- | ----------- | ------------------------------------------------------ |
| [ADR-0002](./ADR/ADR-0002-Prisma-Migrations.md)    | Migration to Prisma ORM for Schema Management & ERD Generation | 📝 Proposed | `DECISION`, `DB`, `Tooling`, `OPEN`                    |
| [ADR-0003](./ADR/ADR-0003-Docker.md)               | Containerization of ERP-System with Docker                     | 📝 Proposed | `DECISION`, `Infrastructure`, `DevOps`, `OPEN`         |
| [ADR-0004](./ADR/ADR-0004-RBAC.md)                 | Role-Based Access Control (RBAC) for ERP-System                | 📝 Proposed | `DECISION`, `Auth`, `Security`, `Architecture`, `OPEN` |
| [ADR-0005](./ADR/ADR-0005-MultiTenant-Strategy.md) | Multi-Tenant Database Strategy for ERP-System                  | 📝 Proposed | `DECISION`, `DB`, `Architecture`, `Scaling`, `OPEN`    |
---

## 📌 Concepts Under Consideration
- [CONCEPT][OPEN]**OAuth vs JWT Enhancements** → Evaluate whether OAuth 2.0 should supplement JWT for external integrations.
- [CONCEPT][OPEN]**Audit Logging** → Decide whether logs live in DB or external system (e.g., ELK, Loki).
- [CONCEPT][OPEN]**CI/CD** → GitHub Actions pipeline for automated testing + deployment.
- [CONCEPT][OPEN]**Monitoring/Alerts** → Options: Prometheus + Grafana vs hosted services (Datadog).
---

## 🏗 Future Enhancements
- [HOWTO][OPEN] Expand `auth` schema: add `roles`, `user_roles` (support RBAC).
- [HOWTO][OPEN] Add `inventory.products`, `sales.orders`, and relationships.
- [HOWTO][OPEN] Set up **DB migrations** workflow (manual → Prisma).
- [HOWTO][OPEN] Implement Docker-based local dev environment.
- [HOWTO][OPEN] Explore multi-tenant strategy implementation paths.