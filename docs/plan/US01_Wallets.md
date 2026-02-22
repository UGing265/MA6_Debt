# US-01: Wallet Management Backend Plan

## Overview
This plan defines the backend implementation for **US-01: Physical Cash Partitioning**, focusing on hierarchical wallet management (Parent/Child), wallet query APIs, and safe delete constraints.

## Scope
- Backend only (`.NET Web API`, `Application`, `Persistence`)
- No frontend work
- No migration changes in this phase

## Implementation Steps

1. **Create Wallet (Command + Validator + Handler)**
   - Input: `UserId`, `Name`, `Description?`, `ParentWalletId?`
   - Validation:
     - `Name` is required
     - If `ParentWalletId` exists, parent wallet must belong to current user
   - Output: `WalletDto` (`Id`, `Name`, `Description`, `ParentWalletId`, `Balance`)

2. **Update Wallet (Command + Validator + Handler)**
   - Input: `UserId`, `Id`, `Name`, `Description?`
   - Validation: `UserId`, `Id`, `Name` required
   - Logic: user-scoped lookup, update name/description, return updated `WalletDto`

3. **Delete Wallet (Command + Validator + Handler)**
   - Input: `UserId`, `Id`
   - Validation: `UserId`, `Id` required
   - Guardrails:
     - Reject delete when wallet has child wallets
     - Reject delete when wallet has transactions

4. **Get Wallet List (Query + Handler)**
   - Input: `UserId`
   - Output: wallet list for current user
   - Include per-wallet balance (`SUM(Transactions.Amount)`)

5. **Get Wallet By Id (Query + Handler)**
   - Input: `UserId`, `Id`
   - Output: single wallet detail (`WalletDto`)
   - Throw not found when wallet is absent/out of scope

6. **Wallets API Controller**
   - Endpoints:
     - `POST /api/wallets`
     - `GET /api/wallets`
     - `GET /api/wallets/{id}`
     - `PUT /api/wallets/{id}`
     - `DELETE /api/wallets/{id}`
   - Auth: `[Authorize]`
   - User scope: extract `sub` claim from JWT and inject `UserId` into commands/queries

## Verification Checklist (to run manually)
- Create parent wallet succeeds
- Create child wallet with same user parent succeeds
- Create child wallet with other user parent fails
- Update existing wallet succeeds
- Delete wallet with children fails
- Delete wallet with transactions fails
- User cannot access another user's wallet data
