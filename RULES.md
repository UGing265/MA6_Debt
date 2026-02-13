# PROJECT RULES (OpenCode Agent)

> **IMPORTANT**: All AI Agents working on this project MUST follow these rules strictly.

---

## 1. Documentation Workflow (MANDATORY)
Every time a feature is planned, implemented, or modified, you MUST update the documentation:

*   **Planning Phase**: Before implementing, create or update a plan file in `docs/plan/` (e.g., `docs/plan/US02_DebtPartner.md`).
*   **Completion Phase**: After finishing implementation, create a summary report in `docs/done/` (e.g., `docs/done/US02_DebtPartner_Backend.md`).
*   **Content**: The `done` file must list created files, key logic implemented, and API endpoints (if any).

## 2. No Build / No Test Policy
*   **IMPLEMENTATION ONLY**: You are responsible for writing code (implementation).
*   **USER TESTING**: Do **NOT** run `dotnet build`, `dotnet test`, `npm run build`, or `npm test`. The User will handle all building and testing.
*   **NO AUTO-FIX**: If a build fails in your thought process, DO NOT try to fix environment issues (like installing SDKs) unless explicitly asked.

## 3. Dependency Management (Strict Permission)
*   **ASK FIRST**: You are **FORBIDDEN** from installing new packages (NuGet or NPM) without prior explicit permission.
*   **Proposal**: If a task requires a new library (e.g., `AutoMapper`, `axios`), you must:
    1.  Explain WHY it is needed.
    2.  Ask the User: "Do you agree to install [Package Name]?"
    3.  Only proceed if the User says "Yes".

## 4. Code Standards
*   **Backend**: .NET 8, Clean Architecture, CQRS (MediatR), FluentValidation.
*   **Frontend**: Next.js 14, Feature-based folder structure.
*   **Safety**: Never delete configuration files (`appsettings.json`, `.env`, `next.config.js`).

---
*Rule file created by OpenCode Agent on request.*
