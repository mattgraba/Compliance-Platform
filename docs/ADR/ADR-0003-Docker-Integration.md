# ADR-0003: Docker Integration

**Status:** Proposed  
**Date:** 2025-10-08  

---

## Context
To maintain parity between local development, CI/CD pipelines, and production environments, the Compliance Platform must be containerized.  
Containerization ensures identical runtime conditions, isolates dependencies, and accelerates setup for new contributors.

---

## Decision
- Use **Docker Compose** to orchestrate application and database containers.  
- Define services:
    ```yaml
    services:
    api:
        build: .
        ports:
        - "5000:5000"
        env_file: .env
        depends_on:
        - db
    db:
        image: postgres:16
        environment:
        POSTGRES_USER: postgres
        POSTGRES_PASSWORD: postgres
        POSTGRES_DB: compliance
        volumes:
        - pgdata:/var/lib/postgresql/data
    volumes:
    pgdata:
    ```
-Add Dockerfile for Node.js runtime.
- Integrate build validation in GitHub Actions workflow.

---

## Consequences
**Positive**
- Consistent environment across development, CI, and deployment.
- Simplifies onboarding (docker compose up).
- Enables automated CI/CD pipeline testing.

**Negative**
- Additional setup complexity.
- Requires volume management for persistent DB data.

---

## References
- ADR-0002 Prisma Migrations
- ADR-0005 Multi-Tenant Strategy