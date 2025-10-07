# 🏗️ Compliance Platform Architecture Overview

**Author:** Matthew Graba  
**Last Updated:** 2025-10-08  
**Location:** `/docs/architecture/`

---

## 🎯 Purpose
This directory serves as the **central hub for all architectural documentation** within the Compliance Platform.  
It connects high-level system design, ADR decisions, diagrams, and subsystem flows into a single navigable source of truth.

The goal is to:
- Document the **why** behind every major technical decision.  
- Visualize system components and data flow.  
- Provide engineers and auditors a transparent overview of how the platform operates and evolves.

---

## 🧩 System Overview

### **Platform Mission**
The **Compliance Platform** provides an extensible, modular backend designed to automate, audit, and secure compliance processes across industries (initially cannabis manufacturing, later general regulatory domains).

### **Core Architectural Principles**
1. **Modularity** — Each subsystem (Auth, Audit, RBAC, etc.) operates within its own schema and controller domain.  
2. **Traceability** — Every user action and system event is auditable end-to-end.  
3. **Scalability** — Built for multi-tenant organizations with schema-level isolation.  
4. **Resilience** — Consistency across environments via Docker and CI/CD pipelines.  
5. **Clarity** — Architecture remains human-readable through structured documentation and ADR discipline.

---

## 🧱 Subsystem Map

| Subsystem | Description | Current Status | Related ADRs |
|------------|-------------|----------------|---------------|
| **Auth** | Handles user registration, login, and JWT-based authentication. | 🚧 Active Development (Sprint 1) | 0001, 0002, 0004 |
| **Audit** | Records all key events (login, data update, deletion) for compliance traceability. | 🔜 Planned (Sprint 2) | 0001, 0002, 0006 |
| **RBAC** | Role-based access layer enforcing least-privilege principles. | 📝 Proposed (Sprint 3) | 0004, 0005 |
| **Core** | Tenant metadata, system-wide utilities, and shared tables. | 🏗️ Under Construction | 0001, 0005 |
| **DevOps** | CI/CD automation, container orchestration, and monitoring. | 🧩 Continuous | 0003, 0007 |

---

## 🔁 System Flow Documentation

| Diagram | Description | Location |
|----------|--------------|----------|
| **01-context-diagram.md** | High-level system overview — external actors, backend services, DB schemas. | `/docs/architecture/01-context-diagram.md` |
| **02-ete-flow.md** | End-to-end user + system request lifecycle. | `/docs/architecture/02-ete-flow.md` |
| **03-audit-automation-flow.md** | Planned audit event lifecycle and automation hooks. | `/docs/architecture/03-audit-automation-flow.md` |
| **system-context.md** | Narrative context and integration notes for all modules. | `/docs/architecture/system-context.md` |
| **Mermaid Sources** | Raw `.mmd` diagrams renderable in GitHub and VS Code. | `/docs/architecture/*.mmd` |

---

## 🧭 ADR Integration

Architecture decisions live in `/docs/ADR/`.  
Each diagram and subsystem flow references one or more ADRs to show *why* the architecture exists in its current form.

| ADR Category | Description | Key ADRs |
|---------------|--------------|-----------|
| **Database & ORM** | Foundational schema and migration design | 0001, 0002 |
| **Infrastructure & DevOps** | Deployment, containers, and CI/CD | 0003 |
| **Access & Security** | RBAC, multi-tenancy, and auth flows | 0004, 0005 |
| **Auditability & Docs** | Logging and architectural transparency | 0006, 0007 |

---

## 🧰 Developer Workflows

### **1️⃣ Daily CI/CD Discipline**
Each engineering day begins with:
- Reviewing open backlog tasks.  
- Running `npx prisma migrate dev` and local tests.  
- Committing only once CI passes.  
- Logging friction points in `/docs/meta/FrictionLog.md`.  

### **2️⃣ Documentation Commit Workflow**
Every architectural or schema change requires:
- Diagram update (Mermaid + Markdown).  
- ADR cross-reference if relevant.  
- Commit message format:
  ```bash
  git commit -m "docs(architecture): update auth flow diagram and ADR links"
