# Reference

> Technical details, schemas, APIs, and component definitions.  
> These documents are **code-oriented** and map directly to implementation.

---

## Current Components
- [Audit Logs](components/AuditLogs.md)  
  Schema, API, and controller logic for recording and querying audit log entries.

---

## Planned / Upcoming Components
- **RBAC**  
  Schema and middleware for enforcing role-based access control.
- **CAPA**  
  Data model and APIs for managing corrective/preventive actions.
- **SOPs**  
  Versioned SOP entity, linkage to actions, and enforcement logic.
- **Training & Certifications**  
  Schema for training records and validation hooks in compliance gates.
- **State Rule Engine**  
  Ruleset storage, evaluation service, and enforcement APIs.
- **Environmental / ESG Reporting**  
  Schema for emissions, waste, and sustainability reporting.

---

## Structure
- **/components/** → individual system components (AuditLogs, RBAC, etc.)  
- **/api.md** → REST/GraphQL endpoints documentation  
- **/db-schema.md** → database models and relationships  
- **/cli-commands.md** → CLI commands for operations and compliance checks  

---

## How to Use These Docs
1. Use **Concepts** for background and system-level purpose.  
2. Use **Reference** for *implementation detail* (models, APIs, CLI usage).  
3. Keep in sync with **Architecture docs** to ensure diagrams and schemas align.  

---

## Philosophy
Reference docs are written to be:
- **Precise** → exact schema fields, enums, error codes.  
- **Current** → updated whenever code changes.  
- **Unambiguous** → single source of truth for implementation details.
