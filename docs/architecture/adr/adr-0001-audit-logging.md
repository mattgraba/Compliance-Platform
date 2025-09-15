# ADR 0001: Prioritize Audit Logging

Date: 2025-09-12  
Status: Accepted  

## Context
Compliance systems in cannabis require full auditability of user interactions and data changes to meet METRC/Isolocity and regulatory expectations.

## Decision
Implement audit logging as a first-class feature in the system, backed by a dedicated database table and controller logic.

## Consequences
- (+) Enables compliance with state/federal expectations
- (+) Builds trust with operators and regulators
- (-) Increases DB load, requires pagination and indexing
