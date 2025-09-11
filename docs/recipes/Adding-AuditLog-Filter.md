# Add a new filter (e.g., `actionCategory`)

1. Schema: update auditQuerySchema (union/enum, optional).

2. WHERE builder: add conditional mapping in buildAuditWhere.

3. Index: consider composite index to keep queries fast.

4. Tests: unit (schema parse), integration (controller), seed coverage.

5. Docs: add to this Tour (params table) and to API reference.

6. Dashboards: update panels if filter affects cardinality.