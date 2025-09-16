## 🧩 Audit Automation Flow (Simplified)

[CLI / API Input]
        |
        v
[Command / Controller]
        |
        v
[Handler / Service]
        |
        v
-------------------------------
   Shared AI Automation Layer
   - Prompt Builder
   - OpenAI Call
   - Response Parser + Schema
-------------------------------
        |
        v
[Output]
- Dev Helper → Console / Prototype
- Cannabis-Compliance → API JSON / Dashboard


## 🔗 Audit Automation Testing Layers

Dev Helper (Lab / Unit-Level)                Cannabis-Compliance (Deployment / Integration)
----------------------------                 ----------------------------------------------
 CLI Command:                                API Request (Postman/cURL):
   dev-helper compliance analyze-audit         POST /api/audit/summarize
         |                                               |
         v                                               v
 analyzeAuditCommand                             auditAutomationController
         |                                               |
 analyzeAuditHandlers                             auditAutomationService
         |                                               |
 ------------------------------- Shared AI Automation Layer -------------------------------
         |                                               |
 Prompt Builder (wraps logs)                      Prompt Builder (wraps logs)
 Call OpenAI API → Response                       Call OpenAI API → Response
 Response Parser → Schema                         Response Parser → Schema
 ------------------------------- ------------------------------- ---------------------------
         |                                               |
 Console output (prototype)                        JSON response to client
 (dev-facing feedback loop)                        (regulator / dashboard)
