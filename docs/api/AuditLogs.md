# API Reference: AuditLogs

## Endpoint
`GET /audit-logs`

---

## Query Parameters
| Name        | Type     | Default | Description |
|-------------|----------|---------|-------------|
| cursor      | string   | —       | ID of last item from previous page |
| limit       | number   | 20      | Results per page (1–100) |
| sort        | enum     | createdAt | Sort key: 'createdAt' \| 'id' \| 'action' |
| order       | enum     | desc    | 'asc' or 'desc' |
| userId      | number   | —       | Filter by actor ID |
| action      | string   | —       | Filter by action name |
| actionCategory | string | —      | Filter by action category |
| ipAddress   | string   | —       | Filter by source IP |
| createdAtFrom | ISO date | —     | Start of time range |
| createdAtTo | ISO date | —       | End of time range |

---

## Response
```json
{
  "items": [ AuditLogDTO, ... ],
  "nextCursor": "123456",
  "hasMore": true
}
```

---

## Errors
- `400` → Invalid query (ZodError).
- `403` → Auth / tenant mismatch.
- `500` → Unexpected server error.

---

## Links
- [Tour.md](../Tour.md)
- [AuditLogs Component](../components/AuditLogs.md)
- [Runbook: AuditLogs](../)