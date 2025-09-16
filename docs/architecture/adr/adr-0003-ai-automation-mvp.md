# ADR 0003: AI Automation MVP (Single Log Analysis)

Date: 2025-09-15  
Status: Accepted  

## Context
Phase 1 of AI Automation is focused on extending the Audit Logs system.  
We need to prove the value of AI enrichment and anomaly detection without introducing unnecessary complexity.  

## Decision
The MVP implementation of the `/audit-automation/analyze` route will:
- Accept **a single audit log entry** as input.
- Enrich it with AI-generated metadata (summary, compliance gate, status).
- Return the enriched log to the client.

Batch analysis (multiple logs, sliding windows, cross-gate validation) is explicitly out of scope for this first phase.  

## Consequences
- (+) Simple to implement, test, and demo quickly.  
- (+) Creates a working foundation for future batch/wider anomaly detection.  
- (+) Tight scope keeps Phase 1 focused on Audit Logs integration.  
- (-) Limited immediate insight — can’t detect missing/mismatched gates until batch analysis is added.  
- (-) May require refactoring the API surface later to support batch processing.  
