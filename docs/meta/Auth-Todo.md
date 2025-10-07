# 🔐 Compliance Platform: Auth System — Todo Tracker

**Objective:** Complete full authentication workflow: register → login → verify → protect.

---

## ⚙️ Routes
| Endpoint | Description | Status | Notes |
|-----------|--------------|--------|--------|
| POST `/register` | Create new user (bcrypt + validation) | 🚧 In Progress | ensure unique email + secure hash |
| POST `/login` | Verify credentials, return JWT | 🔜 To Do | handle invalid password gracefully |
| GET `/me` | Protected route to fetch current user | 🔜 To Do | requires authenticate middleware |
| POST `/refresh` | Issue new JWT (future enhancement) | ⏳ Deferred | optional refresh token design later |

---

## 🧩 Middleware
| File | Purpose | Status | Notes |
|-------|----------|--------|--------|
| `validateRequest.js` | Validate payload with Zod | ✅ Complete | reusable schema design works |
| `authenticate.js` | Verify JWT and attach req.user | 🔜 To Do | test expired/missing tokens |
| `handleError.js` | Centralize error handling | ✅ Complete | may expand with custom codes |

---

## 🧠 Learning Objectives
- [x] Understand Express middleware sequence.
- [x] Implement bcrypt and JWT securely.
- [ ] Deep dive JWT verification (`jwt.verify`, `iat`, `exp`).
- [ ] Research refresh token flow + rotation.

---

## 🧪 Testing
- [ ] Postman tests:
  - ✅ Register (success/fail)
  - ✅ Login (success/fail)
  - ⏳ Protected `/me` route (valid/expired token)
- [ ] (Optional) Jest tests for controller + middleware.

---

## 📝 Documentation
- [ ] Update `docs/concepts/AuthSystem.md` with:
  - Auth flow diagram
  - Middleware sequence
  - Token lifecycle
- [ ] Add `.env` and security recommendations (no tokens in logs).
