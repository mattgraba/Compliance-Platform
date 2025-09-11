# Documentation Index
> For project overview, setup instructions, and high-level features, see the [root README.md](../README.md).

Welcome to the system documentation for the Cannabis Compliance Platform.  
This directory is the **source of truth** for architecture, components, operations, and troubleshooting.

---

## 🗺️ Orientation
- [Tour.md](./Tour.md) → 10-minute guided walkthrough (system diagram, request flow, common recipes).
- [Glossary.md](./Glossary.md) → Definitions of domain terms, acronyms, and concepts.

---

## ⚙️ Components
Subsystem deep dives (purpose, schema, controller flow, scaling notes):
- [AuditLogs](./components/AuditLogs.md)
- Auth (coming soon)
- Users (coming soon)
- Inventory (coming soon)

---

## 🧾 API References
Contracts for public endpoints (parameters, responses, errors):
- [AuditLogs API](./api/AuditLogs.md)

---

## 📊 Dashboards
Monitoring and observability documentation (Grafana panels, metrics, maintenance rules):
- [AuditLogs Dashboards](./dashboards/AuditLogs.md)

---

## 🛠️ Recipes
Step-by-step guides for common engineering tasks:
- [Adding a new AuditLog filter](./recipes/Adding-AuditLog-Filter.md)
- [Adding a DB index](./recipes/Adding-DB-Index.md)
- [Adding a role](./recipes/Adding-Role.md)
- [Adding a log field](./recipes/Adding-Log-Field.md)

---

## 🚑 Runbooks
Incident response guides (symptoms, triage, fixes, escalation):
- [AuditLogs Runbook](./runbooks/audit-logs.md)

---

## 🔑 How to Contribute
- **If you add/change a component** → update its doc in `/components/`.  
- **If you add a new API endpoint** → update `/api/`.  
- **If you add a new filter/index/role/log field** → add/update a `/recipes/` file.  
- **If you add new monitoring** → update `/dashboards/`.  
- **If you add new failure modes** → update `/runbooks/`.  
- Always update [Tour.md](./Tour.md) for new request flows or invariants.  

