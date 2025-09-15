# Glossary

This glossary defines terms, abbreviations, roles, and domain-specific concepts used in the Cannabis Compliance Platform.

---

## Core Concepts in Cannabis Compliance System Architecture

### SOPs (Standard Operating Procedures)
- **Written, detailed instructions** that outline how to perform specific tasks consistently & safely.
- SOPs serve as the backbone of compliance because they ensure employees follow the same steps every time.
- **Example**: An SOP for trimming cannabis might specify **PPE required, sanitation steps, labeling, and batch logging.

### QA/QC (Quality Assurance / Quality Control)
- QA (Quality Assurance): Preventive systems & policies to ensure processes meet standards (training, audits, process design).
- QC (Quality Control): Reactive checks that test the actual products or outputs for compliance (lab testing, batch sampling, potency/contamination checks).
- **Example**: QA ensures employees are trained in cleaning SOPs; QC checks swabs of equipment to confirm no mold or bacteria.

### cGMP (Current Good Manufacturing Practice)
- FDA-enforced set of regulations that define minimum standards for manufacturing safe, consistent products.
- "Current" means practices must evolve with **modern science and industry standards**.
- Cannabis operators often follow cGMP-like frameworks even if not federally mandated (yet).
- **Core requirements**:
    - Written SOPs for every operation.
    - QA/QC checks at multiple steps.
    - Deviation logging (recording any practice that strays from SOPs & corrective actions taken).
    - Document control (traceability, batch records, CAPA).

### CAPA (Corrective and Preventive Action)
- A structured process for addressing deviations and preventing recurrence.
- **Corrective** = fix the immediate problem.
- **Preventive** = ensure it doesn’t happen again.
- Triggered when audit logs or QA/QC checks identify non-compliance.

### Deviation
- Any departure from an approved SOP or expected process.
- Must be logged, investigated, and resolved — usually linked to a CAPA.
- **Example**: A packaging run used outdated labels → deviation logged, CAPA triggered.

### RBAC (Role-Based Access Control)
- A permissions model that restricts system actions to specific roles (Grower, QA, Retail Associate).
- Prevents unauthorized activity and ensures audit logs reflect only valid actions.
- **Example**: Only QA can approve a COA release.

### COA (Certificate of Analysis)
- Lab-issued document certifying potency and safety test results (THC %, pesticides, heavy metals).
- Required before cannabis products can be released for sale.
- Audit logs record both the creation and approval/denial of COAs.

### Audit Trail
- The complete chain of evidence across audit logs.
- Used by regulators to reconstruct events (who did what, when, and under which SOP/training).
- Distinct from individual audit log entries: it’s the timeline view.

### ESG (Environmental, Social, Governance) Reporting
- Framework for tracking sustainability and regulatory metrics (waste, emissions, safety practices).
- In cannabis, ESG often overlaps with compliance reporting (waste disposal logs, solvent usage).
- Audit logs can feed ESG reports automatically.