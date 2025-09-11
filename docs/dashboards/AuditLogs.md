# Dashboards: AuditLogs

## Purpose
Track AuditLogs volume, errors, and compliance health across tenants.

---

## Current Panels
- **Log Volume by Tenant**  
  Grafana panel: [ops/grafana/audit-logs.json](../../ops/grafana/audit-logs.json)  
  → Detects spikes in log generation by tenant.

- **Top Actions by Category**  
  Helps identify the most frequent operational activities (e.g., inventory updates).

- **Errors (400/403/500) over Time**  
  Monitors request failures and highlights possible abuse or misconfigurations.

- **PII Redaction Coverage**  
  Ensures sensitive fields (e.g., `ipAddress`) are consistently redacted for non-SuperAdmin roles.

---

## Maintenance Rules
- **New filters**: Add matching dashboard panels when filters affect query cardinality (e.g., `actionCategory`).  
- **New log fields**: Update existing panels or create new ones.  
- **Sampling**: Keep queries performant by limiting to rolling windows (e.g., last 30 days).  
- **Consistency**: Ensure panel names match schema and API terminology.  

---

## Links
- [AuditLogs Grafana JSON](../../ops/grafana/audit-logs.json)  
- [Runbook: AuditLog incidents](../runbooks/audit-logs.md)  
- [Component Doc: AuditLogs](../components/AuditLogs.md)
