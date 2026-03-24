# US-00: API Documentation with Scalar UI

## TL;DR

> **Quick Summary**: Replace/Augment default Swagger UI with **Scalar UI** for better API documentation experience.
> 
> **Deliverables**:
> - Scalar UI enabled at `/scalar/v1`.
> - `Program.cs` updated.
> 
> **Estimated Effort**: Tiny (Config change only)
> **Parallel Execution**: Sequential

---

## Context

### Original Request
- Provide better API documentation UI than default Swagger.
- Scalar is already installed (`Scalar.AspNetCore` package present).

### Current Status
- `Microsoft.AspNetCore.OpenApi` is enabled.
- `Scalar.AspNetCore` package is referenced in `API.csproj`.
- `Program.cs` has `app.MapOpenApi()` but no UI mapping.

---

## Work Objectives

### Core Objective
Enable modern, interactive API documentation using Scalar.

### Concrete Deliverables
- [ ] `Program.cs` updated with `app.MapScalarApiReference()`.
- [ ] Access URL: `http://localhost:5000/scalar/v1`.

### Definition of Done
- [ ] UI loads successfully.
- [ ] Can execute `POST /api/auth/login` and `POST /api/auth/register` from UI.

---

## Verification Strategy

### Agent-Executed QA Scenarios

```
Scenario: Verify Scalar UI Endpoint
  Tool: Bash (curl)
  Preconditions: Backend running
  Steps:
    1. curl -I http://localhost:5000/scalar/v1
    2. Assert HTTP 200 OK
    3. Assert Content-Type contains "text/html"
  Expected Result: UI page loads
```

---

## TODOs

- [ ] 1. Configure Scalar in Program.cs

  **What to do**:
  - Open `backend/src/API/Program.cs`.
  - Add `using Scalar.AspNetCore;`.
  - Inside `if (app.Environment.IsDevelopment())`:
    - Ensure `app.MapOpenApi()` is called.
    - Add `app.MapScalarApiReference();`.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`backend-development`]

  **Acceptance Criteria**:
  - [ ] Code compiles.
  - [ ] `MapScalarApiReference` is present.

---

## Success Criteria

### Final Checklist
- [ ] Scalar UI accessible.
