# Auth Subsystem Overview (Sprint 1)

## Purpose
Establish secure user authentication and identity verification across all modules.

## Components
- `/register` → creates users (bcrypt-hashed)
- `/login` → issues JWT (HS256)
- `/me` → protected route
- Middleware: `authenticate`, `validateRequest`, `handleError`

## Sequence
```mermaid
sequenceDiagram
  participant Client
  participant API
  participant AuthController
  participant DB
  Client->>API: POST /api/auth/register
  API->>AuthController: validate + hash
  AuthController->>DB: insert new user
  Client->>API: POST /api/auth/login
  API->>AuthController: validate creds + issue JWT
  API-->>Client: token
