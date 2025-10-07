# ⚙️ ERP System — CI/CD Daily Checklist

**Goal:** Maintain daily build integrity and ensure stable test & deploy cycles.

---

## 🧰 Pre-Commit Checks
- [ ] `npm run lint` passes cleanly.
- [ ] `.env` validated (`DATABASE_URL`, `JWT_SECRET`, etc.).
- [ ] Local dev server boots (`npm run dev`).
- [ ] Manual Postman smoke test (`/register`, `/login`).
- [ ] Updated Sprint Log entry for today.

---

## 🚀 Commit & Push
- [ ] Create meaningful commit message (e.g., `feat(auth): add login/register route`).
- [ ] Push to `dev` branch.
- [ ] Verify GitHub Actions workflow triggered successfully.

---

## 🔎 Post-Commit Verification
- [ ] Review GitHub Actions logs (build + test steps).
- [ ] Confirm `.env` variables loaded correctly in CI.
- [ ] Verify deploy to Render/Heroku test environment.
- [ ] Record failures or anomalies in `FrictionLog.md`.
- [ ] Update `Sprint-Log.md` with CI/CD status.

---

## 🧩 Weekly CI/CD Health Review
| Metric | Value | Notes |
|---------|--------|-------|
| ✅ Green builds this week |  |  |
| ⚠️ Failed builds |  |  |
| 🧠 Lessons learned |  |  |
