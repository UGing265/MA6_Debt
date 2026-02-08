# US-00: Login System Implementation Plan (Simplified)

## Overview
This document outlines the implementation plan for the **US-00: Login System** feature in the backend, focusing on basic authentication (Username/Password) and JWT token generation.

## Implementation Steps

1.  **Update Domain Entity (`User`)**
    *   Add necessary fields to `Domain/Entities/User.cs`:
        *   `Username` (Identity)
        *   `Email` (Optional/Recovery)
        *   `PasswordHash` (Secure storage)
    *   Create a new Entity Framework Core Migration to update the PostgreSQL database.

2.  **Security Services (Infrastructure)**
    *   **Password Hashing**: Implement a service (e.g., using `BCrypt.Net` or ASP.NET Core Identity's `PasswordHasher`) to hash passwords before storage and verify them during login.
    *   **JWT Token Generation**: Implement a service to generate JWT tokens with claims (Id, Username) upon successful authentication.

3.  **Application Logic (CQRS)**
    *   Create **Login DTOs**: `LoginRequest` (Username, Password), `LoginResponse` (Token, Expiry).
    *   Implement **LoginCommand & Handler**:
        *   Validate user existence by `Username`.
        *   Verify Password Hash:
            *   **If Invalid**: Return "Invalid Credentials" error.
            *   **If Valid**: Generate and return JWT Token.

4.  **API Endpoint**
    *   Configure JWT Authentication in `Program.cs`.
    *   Create `AuthController` with `POST /api/auth/login`.

5.  **Testing**
    *   Verify successful login returns a valid token.
    *   Verify failed login returns 401 Unauthorized.
