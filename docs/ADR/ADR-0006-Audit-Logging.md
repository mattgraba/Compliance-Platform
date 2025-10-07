# 🧱 ADR-0006: Audit Logging

**Status**: Deferred → *Planned* (Phase 2)
**Date**: 2025-10-07

## Context

The Compliance Platform must record all user and system actions (auth events, data updates, policy changes) to satisfy internal traceability and external regulatory requirements (e.g., cGMP, ISO 9001).
Because Prisma is now the active ORM (ADR-0002), audit logging will integrate at the ORM and middleware layers to ensure transactional integrity.

## Decision
- Implement audit logging as a **dedicated Prisma model** (`audit.audit_logs`).
- Middleware layer captures:
    - user identity (`req.user.id`)
    - action type
    - target resource
    - timestamp
    - metadata (JSON payload)
- Expose `/api/audit` controller for filtered access (admin-only).
- Index (`timestamp, user_id`) for efficient queries.

## Consequences
**Positive**
- End-to-end traceability across all subsystems (Auth → RBAC → Audit → Compliance).
- Built-in extensibility for future AI-driven anomaly detection.
- Integrates naturally with Prisma transaction hooks.

**Negative**
- Increases DB write load.
- Requires retention policy and pagination for performance.
- Must secure audit endpoints to prevent data leaks.

**Next Steps**
- Implement after Auth system stabilization (Week 2–3).
- Draft `ADR-0006-Audit-Controller.md` once the schema is ready.