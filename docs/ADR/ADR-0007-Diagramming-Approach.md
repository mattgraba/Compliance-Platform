🧠 ADR-0007: Diagramming Approach

**Status**: Accepted (Active Standard)
**Date**: 2025-10-07

## Context
All architectural documentation, subsystem flows, and DB relationships in the Compliance Platform must remain *living artifacts* reviewable through version control.

## Decision
- Use **Mermaid** syntax for all diagrams (sequence, class, ER, flow).
- Store diagrams alongside code and auto-render in Markdown.
- Commit `.mmd` source files and `.md` renderers for diff review.
- PR checklist includes “Docs Updated?” line item.

## Consequences
**Positive**
- Diagrams evolve with codebase.
- Enables peer review of architecture.
- Minimal tooling — renders in GitHub, VS Code, and Docs.

**Negative**
- Requires discipline to update diagrams alongside code changes.

**Applies To**
- `/docs/architecture/` diagrams (Auth Flow, System Context, Audit Lifecycle, etc.)
- `/docs/concepts/` educational visuals