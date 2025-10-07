# 🧱 Compliance Platform — Friction Log

**Purpose:** Capture all technical blockers, environment issues, and unexpected learning moments during development.  
This serves as both a reference and a resilience tracker — every friction point is a future shortcut.

---

## 🧭 Usage Guidelines
- Log entries as soon as friction occurs (don’t wait until the end of day).
- Keep each entry factual and concise: what happened, why, and what fixed it.
- Tag each entry with its type (`🧱 environment`, `🧩 syntax`, `🧠 concept`, `⚙️ integration`, `📦 dependency`, `🔐 auth`).

---

## 📘 Example Entry Format
```text
### [DATE] — [Short Title]
**Area:** Auth / Middleware  
**Tag(s):** 🧱 environment, ⚙️ integration  
**Issue:** JWT verification throwing "invalid signature" error during login.  
**Root Cause:** Used incorrect secret key from dev `.env`.  
**Resolution:** Synced `.env` with production secret and reissued test tokens.  
**Lesson:** Always validate environment variables before testing authentication flows.

---

## 🧾 Active Friction Log

