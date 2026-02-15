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

## 5. Naming Conventions

### Database vs C# Naming

To maintain consistency with PostgreSQL community standards while keeping C# code idiomatic:

*   **Database** (PostgreSQL): Use `snake_case` for all identifiers
    *   Tables: `users`, `debt_partners`, `transactions`
    *   Columns: `user_id`, `created_at`, `initial_balance`
    *   Constraints: `pk_users`, `fk_debt_partners_users_user_id`
    *   Indexes: `ix_debt_partners_user_id`

*   **C# Code**: Use `PascalCase` for all identifiers
    *   Classes: `User`, `DebtPartner`, `Transaction`
    *   Properties: `UserId`, `CreatedAt`, `InitialBalance`
    *   DTOs: `UserDto`, `CreateUserCommand`

### Examples

✅ **Correct:**
```csharp
// C# Property (PascalCase)
public Guid UserId { get; set; }

// Database column (snake_case)
// user_id UUID PRIMARY KEY
```

✅ **Correct:**
```csharp
// C# Entity (PascalCase)
public class DebtPartner { ... }

// Database table (snake_case)
// CREATE TABLE debt_partners (...)
```

❌ **Incorrect:**
```csharp
// Mixed case in database
public Guid UserId { get; set; }  // DB column: "UserId" (wrong)
```

❌ **Incorrect:**
```csharp
// Snake case in C#
public Guid user_id { get; set; }  // C# property should be UserId
```

### Implementation

EF Core automatically handles the mapping via `EFCore.NamingConventions` package:

```csharp
// In DependencyInjection.cs
optionsBuilder
    .UseNpgsql(connectionString)
    .UseSnakeCaseNamingConvention();
```

This ensures C# code uses `PascalCase` while database uses `snake_case` without manual mapping.

---
*Rule file created by OpenCode Agent on request.*
