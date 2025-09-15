# Audit Logs (Concepts)
> What audit logs are and why they’re essential to compliance.

---

## What Are Audit Logs?
Audit logs are the **compliance black box recorder** for the system. They capture *who did what, when, where, and why* in an immutable way.

In cannabis compliance, this is non-negotiable because regulators (METRC, ISO, OSHA, FDA) require traceability for every significant action.

---

## Why They Matter
- **Regulatory compliance**: Proves adherence to SOPs, labeling laws, potency testing, etc.
- **Accountability**: Creates an evidence trail for internal investigations (e.g., diversion or tampering).
- **Trust**: Operators, auditors, and partners can rely on the system because every action is recorded and cannot be silently erased.
- **Automation**: Enables AI agents to validate flows ("harvest logged but no COA release?").

---

## How Audit Logs Work at a System Level
- **At every compliance gate** (Harvest, Packaging, Testing, Transfer, Sale) → an audit log entry is created.
- **What gets logged**:
    - Actor (user + role)
    - Tenant (business/organization)
    - Action (verb or event)
    - Entity + ID (what object was touched)
    - Before/after state (diff)
    - Timestamp (UTC)
    - Context (IP, system source, integration)
- **Properties**:
    - Immutable: entries cannot be altered or deleted.
    - Scoped: tied to tenant, so logs don't bleed across businesses.
    - Discoverable: queryable with filters (actor, entity, time window).

---

## Compliance Gate Integration
- **Harvest Gate** → log batch creation (`harvest.created`)
- **Packaging Gate** → log label check (`package.approved`)
- **Testing Gate** → log lab results (`coa.approved`/`coa.denied`)
- **Transfer Gate** → log manifest creation (`transfer.initiated`)
- **Sale Gate** → log retail transaction (`sale.completed`)
Every compliance gate *must* emit an audit log. If it doesn’t, the system is out of compliance.

---

## Common Scenarios
- **Normal**: QA approves batch → log entry `release.approved`.
- **Deviation**: Lab fails potency → log entry `release.denied` + trigger CAPA.
- **Fraud attempt**: User tries to bypass RBAC → log entry `access.denied`.
- **Integration**: External METRC sync → log entry `external.sync.metrc`.

---

## Relationship to Other Concepts
- **RBAC**: Ensures only authorized actors generate certain audit log actions.
- **CAPA**: Deviations discovered via logs spawn CAPA tasks.
- **SOPs**: Logs prove which SOP version was followed.
- **Training**: Validates that the actor had required training at time of action.
- **ESG**: Provides environmental data inputs (waste logging, transport emissions).

---

## Key Takeaways
- Audit Logs = the **compliance nervous system** of the platform.
- They connect every gate, every role, and every action back to immutable evidence.
- Without reliable audit logs, compliance collapses — they are the single point of trust for regulators and operators.

---

## How This Differs From Reference
- **`Concepts/audit-logs.md`** → *Explains what/why audit logs exist, where they appear in the lifecycle, and their compliance purpose.*
- **`Reference/components/AuditLogs.md`** → *Documents schema, API, controller logic, queries, redaction rules, and recipes.*

### Link to reference:
For schema and API usage, see [Reference](../reference/components/AuditLogs.md)
