# ADR-0002: Prisma Migrations

**Status:** Accepted  
**Date:** 2025-10-08  

---

## Context
Manual SQL migrations create schema drift and hinder consistency across environments.  
To ensure repeatable, type-safe database access and versioned schema control, Prisma ORM will manage all migrations and data modeling.

---

## Decision
- Adopt **Prisma ORM** as the migration and schema definition layer.  
- Maintain a single schema file at `/prisma/schema.prisma`.  
- Use:
  - `npx prisma migrate dev` for local development  
  - `npx prisma migrate deploy` for CI/CD pipelines  
- Auto-generate ER diagrams in `/docs/db/erd/`.  
- Enforce a pre-commit hook that validates Prisma schema integrity.

---

## Consequences
**Positive**
- Eliminates manual SQL drift.  
- Enables static typing and safer DB queries.  
- Provides a single source of truth for all models.  
- Simplifies onboarding and collaboration.

**Negative**
- Adds dependency on Prisma CLI and ecosystem.  
- Requires schema alignment discipline when multiple developers contribute.

---

## References
- ADR-0001 Database Setup  
- ADR-0003 Docker Integration
