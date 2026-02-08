# US-00: User Registration Feature

## TL;DR

> **Quick Summary**: Implement user registration API to allow new users to sign up.
> 
> **Deliverables**:
> - API Endpoint: `POST /api/auth/register`
> - Command Handler: `RegisterCommandHandler`
> - DTOs: `RegisterRequest`, `RegisterResponse`
> 
> **Estimated Effort**: Short
> **Parallel Execution**: Sequential

---

## Context

### Original Request
- Add Registration feature to complement Login (missing from original SRS).
- Allow users to create accounts (`Username`, `Password`, `Email`, `Name`).
- No automatic wallet creation (user does this manually later).
- **Manual Login required**: Registration returns success message only.
- **Email Optional**: Email field is not mandatory.

### Current Status
- Login API exists.
- `User` entity exists.
- `IPasswordHasher` service exists.

---

## Work Objectives

### Core Objective
Enable new users to create accounts securely.

### Concrete Deliverables
- [ ] `RegisterRequest` DTO (Email optional).
- [ ] `RegisterResponse` DTO (Message only, no token).
- [ ] `RegisterValidator`.
- [ ] `RegisterCommandHandler`.
- [ ] `AuthController` updated.

### Definition of Done
- [ ] `curl -X POST /api/auth/register` creates user in DB.
- [ ] Returns 200 OK.
- [ ] Password is hashed in DB.

---

## Verification Strategy

### Agent-Executed QA Scenarios

```
Scenario: Successful Registration (With Email)
  Tool: Bash (curl)
  Preconditions: Backend running
  Steps:
    1. curl -X POST http://localhost:5000/api/auth/register \
       -H "Content-Type: application/json" \
       -d '{"username":"user1", "password":"Password123!", "email":"user1@test.com", "name":"User One"}'
    2. Assert HTTP 200 OK
  Expected Result: User created

Scenario: Successful Registration (No Email)
  Tool: Bash (curl)
  Preconditions: Backend running
  Steps:
    1. curl -X POST http://localhost:5000/api/auth/register \
       -H "Content-Type: application/json" \
       -d '{"username":"user2", "password":"Password123!", "name":"User Two"}'
    2. Assert HTTP 200 OK
  Expected Result: User created without email
```

---

## TODOs

- [ ] 1. Implement Register Feature (CQRS)

  **What to do**:
  - Create `RegisterRequest.cs` (Username, Password, Email?, Name).
  - Create `RegisterResponse.cs` (Success Message, UserId).
  - Create `RegisterValidator.cs` (NotEmpty Username/Password, Email format IF present).
  - Create `RegisterCommandHandler.cs`:
    - Check if Username exists -> Throw Error.
    - If Email provided: Check if Email exists -> Throw Error.
    - Hash Password.
    - Create `User` entity.
    - Save to DB.
    - Return Success Response.

  **Recommended Agent Profile**:
  - **Category**: `backend-development`
  - **Skills**: [`backend-development`, `security`]

  **Acceptance Criteria**:
  - [ ] Code compiles.
  - [ ] logic handles optional email correctly.

- [ ] 2. Expose Register Endpoint

  **What to do**:
  - Add `[HttpPost("register")]` to `AuthController`.
  - Call `IMediator.Send(command)`.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`backend-development`]

  **Acceptance Criteria**:
  - [ ] Endpoint accessible via Swagger/Curl.

---

## Success Criteria

### Final Checklist
- [ ] Register API works.
- [ ] Duplicate registration fails.
- [ ] Password hashed.
