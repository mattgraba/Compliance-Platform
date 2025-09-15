# Concepts

> High-level explanations of the **what/why/how** behind key compliance features.  
> These documents are **system-oriented** (not code-oriented) and explain the role of each concept in the cannabis compliance lifecycle.

---

## Current Concepts
- [Audit Logs](audit-logs.md)  
  The compliance black box recorder. Captures who/what/when/where/why at every compliance gate.

---

## Planned / Upcoming Concepts
- **RBAC (Role-Based Access Control)**  
  Defines which users can perform which actions. Prevents unauthorized activity and ensures audit logs are trustworthy.
- **CAPA (Corrective and Preventive Action)**  
  System for resolving deviations. Links audit log failures to corrective tasks and effectiveness checks.
- **SOPs (Standard Operating Procedures)**  
  Version-controlled operating steps. Audit logs tie actions back to the SOP version in effect.
- **Training & Certifications**  
  Verifies the actor was trained/qualified at the time of action. Critical for QA/QC and regulatory defense.
- **State Rule Engine**  
  Evaluates actions against state-by-state cannabis regulations (e.g., potency limits, labeling rules).
- **Environmental / ESG Reporting**  
  Captures waste, solvent use, emissions, and other sustainability data during operations.

---

## How to Read These Docs
1. **Start here** to understand the purpose and importance of a feature.  
2. Jump to the **[Architecture docs](../architecture/)** for system diagrams and design.  
3. See **[Reference docs](../reference/)** for API schemas, models, and code-level details.

---

## Philosophy
Concept docs are written to be:
- **Plain language** → explainable to auditors, operators, and engineers alike.  
- **System-focused** → covers *why* and *how it fits into compliance*, not *how the code is written*.  
- **Evergreen** → evolves more slowly than code; updated when the system model changes.
