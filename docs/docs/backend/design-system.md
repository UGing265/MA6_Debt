# MA6 Debt Backend Design System

This is the canonical backend rulebook for MA6 Debt. Read it before planning or coding backend/API/domain/persistence work. Keep backend changes consistent with this file unless the user explicitly approves a design-system update.

## Source evidence

- `docs/docs/backend/structure.md`: Clean Architecture, feature layout, documented API routes, EF/PostgreSQL intent.
- `backend/src/API/Program.cs`: middleware order, auth, CORS, OpenAPI/Scalar, ProblemDetails, exception handler, DI, migration behavior.
- `backend/src/API/API.csproj`: ASP.NET Core `net9.0`, JWT Bearer, OpenAPI, Scalar, EF design packages.
- `backend/src/Application/Application.csproj`: MediatR, FluentValidation, BCrypt, token/security packages.
- `backend/src/Persistence/Persistence.csproj`: EF Core, Npgsql PostgreSQL, snake_case naming conventions.
- `backend/src/Domain/Domain.csproj`: domain project boundary.
- `backend/src/Application/DependencyInjection.cs`: MediatR and validation pipeline registration.
- `backend/src/Persistence/DependencyInjection.cs`: `IApplicationDbContext`, Npgsql, snake_case setup.
- `backend/src/Persistence/Data/ApplicationDbContext.cs`: DbSets, relationships, query filters.
- `backend/src/API/Middleware/GlobalExceptionHandler.cs`: public error response shape.

## Non-negotiable architecture

Use Clean Architecture. Do not blur these boundaries.

| Layer | Owns | Must not own |
|---|---|---|
| `API` | Controllers, request contracts, auth/middleware setup, HTTP response metadata | Business rules, EF queries, balance/debt calculations |
| `Application` | Commands, queries, handlers, validators, use-case orchestration, interfaces | ASP.NET controller concerns, concrete EF infrastructure |
| `Domain` | Entities, enums, domain meaning, core invariants | API contracts, DbContext, persistence setup |
| `Persistence` | EF Core, `ApplicationDbContext`, migrations, entity configuration, PostgreSQL naming | HTTP contracts, controller logic, use-case decisions |

Dependency direction: `API -> Application -> Domain`; `Persistence` implements Application abstractions. Domain stays independent.

## Canonical backend stack

- Target framework: `.NET 9` / `net9.0`.
- HTTP: ASP.NET Core controllers.
- Use cases: CQRS with MediatR.
- Validation: FluentValidation through the MediatR validation pipeline.
- Auth: JWT Bearer.
- Persistence: EF Core + Npgsql PostgreSQL.
- Database naming: snake_case via EFCore.NamingConventions.
- Errors: ProblemDetails registration plus `GlobalExceptionHandler` shaped JSON responses.
- API docs: OpenAPI + Scalar in Development.

## API rules

- Controllers are thin adapters: bind input, resolve authenticated user scope, map request to command/query, call `_mediator.Send(...)`, return HTTP result.
- No business logic in controllers. No debt math, wallet balance mutation, ownership decisions, or EF queries in controllers.
- Routes stay resource-oriented and consistent with `/api/auth`, `/api/users`, `/api/wallets`, `/api/debt-partners`, `/api/transactions`, and `/api/transfers`.
- Request contracts live under `API.Contracts` when the pattern exists.
- Commands/queries live under Application feature folders.
- Validators live next to their command/query or in the same Application feature area.
- Responses expose DTOs/result shapes, not tracked EF entities or infrastructure types.

## Validation and errors

- Validate all external input before business logic: ids, enums, pagination, date ranges, amounts, required fields, and debt-specific invariants.
- Use FluentValidation for request/use-case validation where possible.
- Keep public errors stable and client-safe: validation, unauthorized, not found, business rule, and generic internal error.
- Never leak stack traces, connection strings, JWT internals, or raw exception details to clients.

## Security rules

- Every user-owned resource must be scoped to the authenticated user.
- Authorization must be explicit before returning or mutating wallets, partners, transactions, transfers, profile data, or preferences.
- Do not place real secrets in docs, examples, tests, logs, source comments, seed data, or config snippets.
- Raw SQL is exceptional. If used, it must be parameterized, justified, and reviewed.
- Logs must help debugging without exposing passwords, tokens, full connection strings, or sensitive financial details.

## Persistence rules

- DbContext and migrations stay in `Persistence`.
- Application code depends on `IApplicationDbContext` or narrower abstractions, not concrete Persistence types.
- Controllers never access DbContext directly.
- Keep PostgreSQL names snake_case.
- Use EF relationships/configuration consistently with `ApplicationDbContext`.
- Run migrations only for schema changes, never for docs-only work.

## Money and debt safety

- Use `decimal` for money, debt, balances, totals, and transfers. Never use floating-point money.
- Preserve debt semantics: payer mode, total amount, debt amount, partner balance before/after.
- No silent balance mutation. Every balance-affecting change needs validation, transaction/history reasoning, and an audit/client-visible trail.
- Balance, transaction, transfer, and debt-partner changes must preserve consistency if part of the operation fails.
- Locked or historical periods must not be bypassed silently. If a lock policy is missing, document it before changing behavior.

## Testing and verification

- Business logic changes need unit, handler-level, or integration tests.
- Validation changes need accepted and rejected input tests.
- Auth/ownership changes need tests proving one user cannot access another user's data.
- Money/debt changes need tests for decimal precision, before/after audit values, success paths, and failure paths.
- Persistence changes need migration/schema verification and snake_case confirmation.
- Docs-only changes use readback, path checks, targeted grep, and diff validation.

## Agent pre-work checklist

Before backend work:

- Read this file.
- Use GitNexus first to find related routes, handlers, commands, queries, entities, and callers.
- Run impact analysis before editing any function, method, class, or route handler.
- Identify which layer owns the change before editing.
- Keep controllers thin, Application use-case focused, Domain infrastructure-free, and Persistence HTTP-free.
- Reject designs that introduce controller business logic, direct controller DbContext access, unscoped user data, leaked secrets, unparameterized SQL, or silent money mutation.

## Quick rule

If a backend change cannot answer “which layer owns this, how is user scope enforced, how are errors shaped, how is money/debt consistency preserved, and how is it tested,” it is not ready to code.
