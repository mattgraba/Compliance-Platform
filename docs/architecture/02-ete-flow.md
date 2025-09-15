# End-to-End Compliance Flow

This diagram shows the entire product lifecycle with **compliance gates** that create immutable records (BPR, COA, Inv Adj, Transfer Txn), invoke **rule checks**, and emit **audit logs**. Deviations open **CAPA** tasks. SOP versions and **training/certs** are enforced at point-of-work. Environmental data streams into the ESG reporter.

![E2E Flow](diagrams/e2e-flow.mmd)

**Reading order**: Cultivation → Processing → Testing → Distribution → Retail.  
**At each Gate**: RBAC → Rule evaluation → Audit entry → (Possible) Deviation/CAPA → System sync (ERP/LIMS/POS) → Regulatory Txn if required.

---

## Compliance Gates (legend)
- **RBAC**: role/permission required to pass a gate.
- **RULES**: state-by-state rule engine evaluates actions, labels, potency limits, transfer windows, etc.
- **AUD**: every gate writes an audit record (who/what/when/why/before-after).
- **Deviation/CAPA**: failing gates or anomalies create a Deviation, which may spawn a CAPA task with assignee, due date, and effectiveness checks.
- **SOP/Training**: enforce the active SOP version and verify user’s required training/certs are current.
- **ESG**: tap operational data (solvents, waste, transport emissions) into environmental reports.
