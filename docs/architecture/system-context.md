# 🌐 System Context — Compliance Platform

**Author:** Matthew Graba  
**Last Updated:** 2025-10-08  
**Location:** `/docs/architecture/system-context.md`

---

## 🎯 Purpose
This document provides a **narrative overview** of the Compliance Platform’s architecture — describing *what the system is*, *who interacts with it*, and *how data moves through it*.  
It establishes context for all subsystem designs, ADRs, and diagrams that follow.

---

## 🧩 High-Level Summary

The **Compliance Platform** is a modular backend framework designed to help organizations **track, enforce, and automate compliance processes**.  
It started as an internal ERP prototype and has since evolved into a **domain-agnostic compliance foundation**, beginning with:
- **Authentication and Authorization**
- **Audit Logging**
- **Role-Based Access Control (RBAC)**
- **Multi-Tenant Organization Management**

These subsystems form the backbone for future features like SOP management, environmental reporting, and AI-driven audit analysis.

---

## 🧠 Core System Goals
| Goal | Description |
|------|--------------|
| **Traceability** | Every user action and system event must be logged and auditable. |
| **Security** | Authentication, authorization, and encryption are foundational — not optional. |
| **Scalability** | Multi-tenant architecture supports multiple organizations and schemas. |
| **Transparency** | All architecture and data models are documented and versioned. |
| **Maintainability** | Each subsystem is modular, testable, and independently deployable. |

---

## 👥 External Actors

| Actor | Description | Example Actions |
|--------|--------------|-----------------|
| **System Administrator** | Manages tenants, roles, and access. | Create tenant, assign roles, configure environment. |
| **Compliance Officer / Auditor** | Reviews and exports audit logs, verifies data integrity. | Filter logs, generate compliance report. |
| **Operator / Employee** | Performs daily actions subject to audit. | Submit form, update record, complete workflow. |
| **API Client / Integration** | External service interfacing with platform endpoints. | POST `/auth/login`, GET `/audit?tenant=abc`. |

---

## 🏗️ Logical Architecture Overview

### **Frontend Layer (Future Phase)**
A planned React/Next.js dashboard will connect users to:
- Auth routes for login and tenant selection.
- Visualization of audit trails.
- Configuration management (RBAC roles, SOP definitions).

### **Backend Layer (Active Development)**
Express.js application structured under `/server/src/` with:
- **Controllers:** Handle requests and responses for each subsystem.  
- **Services:** Business logic and data validation.  
- **Middleware:** Auth, validation, and error handling.  
- **Routes:** Organized by domain (`/auth`, `/audit`, `/core`).

### **Database Layer**
- PostgreSQL with **schema-per-subsystem** architecture.  
- Managed through Prisma ORM.  
- Each schema (auth, audit, core) defines its own migration path.  
- Multi-tenant support via schema replication and metadata registry.

### **DevOps / Infrastructure**
- Local dev: Node.js + PostgreSQL via Docker Compose.  
- Production: Deployable containers with GitHub Actions CI/CD.  
- Planned monitoring stack: Prometheus + Grafana (ADR-0008, future).

---

## 🔄 Data Flow Narrative (E2E)

### **1️⃣ Authentication Flow**
1. User submits credentials to `/auth/login`.  
2. Server validates input via Zod schema.  
3. Prisma queries `auth.users` for matching credentials.  
4. If valid, JWT is issued (tenant-aware) and stored client-side.  
5. Middleware (`authenticate`) validates token and attaches `req.user`.  

### **2️⃣ Authorized Request**
1. Authenticated user accesses a protected route (e.g., `/audit/events`).  
2. Middleware checks user’s roles via `auth.user_roles`.  
3. Authorized requests proceed; unauthorized requests are blocked.  
4. Every access attempt is logged to `audit.audit_logs`.

### **3️⃣ Audit Event Logging**
1. Controller operations trigger audit middleware hooks.  
2. Audit service writes structured events (`user_id`, `action`, `entity`, `timestamp`).  
3. Admins or auditors retrieve logs via `/audit` with filters and pagination.

### **4️⃣ Tenant Isolation**
1. JWT contains a `tenant_id` claim referencing `core.tenants`.  
2. Middleware resolves tenant schema before executing any Prisma query.  
3. Each tenant’s data remains isolated within its schema.

---

## 🧱 Subsystem Responsibilities

| Subsystem | Primary Function | Schema | Key Models | Dependencies |
|------------|-----------------|---------|-------------|--------------|
| **Auth** | User registration, login, and token issuance | `auth` | `users`, `roles`, `user_roles` | Prisma, JWT |
| **Audit** | Persistent, queryable event logging | `audit` | `audit_logs`, `event_types` | Auth, Prisma |
| **Core** | Tenant registry and platform settings | `core` | `tenants`, `settings` | Auth |
| **RBAC** | Permission enforcement and role hierarchy | `auth` | `roles`, `permissions` | Core |
| **DevOps** | CI/CD, containerization, and deployment automation | — | GitHub Actions, Dockerfiles | All |

---

## 🔐 Security Context
- All endpoints require JWT-based authentication (except `/auth/register` and `/auth/login`).  
- Sensitive secrets managed via `.env` (never committed).  
- Prisma queries scoped per-tenant.  
- Planned: periodic key rotation and token expiration policies.

---

## 📊 Compliance Context
The platform adheres to core compliance software design expectations:
- **Change Tracking:** Each mutation creates an immutable audit entry.  
- **User Accountability:** No anonymous operations permitted.  
- **Data Integrity:** Prisma transactions wrap all multi-table writes.  
- **Traceable Architecture:** Every decision backed by an ADR.

---

## 🗺️ Related Documentation

| Type | File | Description |
|------|------|--------------|
| **Architecture Overview** | [`README.md`](./README.md) | High-level summary of subsystems and ADR integration. |
| **System Diagrams** | `01-context-diagram.md`, `02-ete-flow.md`, `03-audit-automation-flow.md` | Visual flow representations. |
| **ADRs** | `/docs/ADR/` | Detailed architectural decisions. |
| **Concepts** | `/docs/concepts/` | Technical and theoretical breakdowns. |

---

## 🧭 Next Steps
- Finalize `auth` schema and controllers (Sprint 1).  
- Integrate audit logging middleware (Sprint 2).  
- Define and seed `core.tenants` model.  
- Begin Docker and GitHub Actions rollout (ADR-0003).  
- Update diagrams to reflect finalized Auth + Audit flows.

---

> “Architecture is a living narrative — if it isn’t evolving, it’s decaying.”  
> — *Compliance Platform Engineering Handbook*
