# Runbook: AuditLogs

## Purpose
Provide a step-by-step guide for investigating and resolving issues related to AuditLogs.
Covers API errors, missing logs, and dashboard anomalies.

---

## Common Symptoms & Quick Checks
> **Symptoms → Quick Checks** = instant triage flow.

### 1. API Errors
- **400 Bad Request** (ZodError)
  - Check if client is sending invalid query params.
  - Run: `curl -v http://localhost:3000/audit-logs?limit=9999`
  - Expected: 400 with clear validation error.

- **403 Forbidden**
  - Likely tenant isolation violation.
  - Verify `req.user.tenantId` and role.
  - Run: check JWT claims in headers.

- **500 Internal Server Error**
  - Check logs: `server/logs/error.log`
  - Run Prisma query manually to isolate failure.
  - Quickly filter errors related to subsystem:
  ```bash
  tail -n 100 server/logs/error.log | grep "AuditLog"
  ```

---

### 2. Missing or Incomplete Logs
- Check `writeAuditLog()` in service layer.
- Confirm DB inserts with:
  ```sql
  SELECT * FROM "AuditLog" WHERE createdAt > now() - interval '5 minutes';
  ```
- Verify `tenantId` is set correctly.
- Ensure redaction is not hiding expected fields.

---

### 3. Dashboard Anomalies
- **Data Issue** (no/incorrect logs in DB) -> check write path.
    - Check Grafana query -> should match schema fields.
    - Confirm `ops/grafana/audit-logs.json` is deployed.
- **Visualization issue** (panel misconfigured) -> check Grafana JSON + schema
    - Verify data source connection (Postgres/Prisma DB).
    - Check panel time window (last 30d vs last 1h).

---

## Escalation Steps
> **Escalation Steps** = separates *what you try first* from *when to call for help*.
1. **Triage**
    - Check API logs.
    - Check DB health (`SELECT count(*) FROM "AuditLog";`).
        - Fast Postgres health check:
        ```bash
            psql -d mydb -c '\l'   # confirm DB connection
        ```
    - Verify auth tokens and tenant isolation logic.
2. **Fix**
    - Schema mismatch -> run `npx prisma migrate status`.
    - Index missing -> add to schema and migrate.
    - Code regression -> rollback last deploy (`git revert <sha>`).
3. **Escalate**
    - If issue persists >30min, escalate to lead engineer.
    - Post status in #ops channel with incident details:
        - Symptom
        - Timeline
        - Actions taken
        - Next steps

---

## Maintenance Rules
> **Maintenance Rules** = ensures the runbook doesn’t rot. 
- Keep this runbook updated when:
    - Adding new filters or roles
    - Updating DB schema (e.g., new log fields)
    - Adding or modifying Grafana panels.
- Checklist item in PR template: "Runbook updated?"

---

## Links
- [AuditLogs Component Doc](../components/AuditLogs.md)
- [AuditLogs Dashboards](../dashboards/AuditLogs.md)
- [AuditLogs API Reference](../api/AuditLogs.md)
- [Redaction Logic](../../server/src/lib/audit/redact.ts)  
- [RBAC Logic](../../server/src/lib/auth/roles.ts)