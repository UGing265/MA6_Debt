---
title: Backend Architecture
description: "Clean Architecture implementation with ASP.NET Core 9"
---

## Overview

The backend follows a strict **Clean Architecture** pattern with clear separation of concerns across 4 main layers.

## Project Structure

```
backend/src/
├── API/                     # Presentation Layer (Web API)
├── Application/             # Application Layer (CQRS Commands/Queries)
├── Domain/                  # Domain Layer (Entities & Core Business Logic)
└── Persistence/             # Infrastructure Layer (Data Access)
```

## Layer Details

### 1. Domain Layer

The core business logic layer, independent of external concerns.

**Key Entities:**

| Entity | Description |
|--------|-------------|
| `User` | User profile with authentication, default wallet/partner references |
| `Wallet` | Financial accounts with hierarchical parent-child relationships |
| `Transaction` | Core transaction entity with hybrid debt-tagging support |
| `DebtPartner` | Partners for debt tracking with balance management |
| `Transfer` | Money transfers between wallets |

**Transaction Features:**
- `PayerMode`: 0 = ToiTra (user pays), 1 = PartnerTra (partner pays)
- `TotalAmount`: Original bill amount for reconstruction
- `DebtAmount`: Amount affecting partner balance
- `PartnerBalanceBefore/After`: Audit trail for debt calculations

### 2. Application Layer

Implements application-specific business rules using **CQRS** pattern.

**Pattern:**
- **Commands** - Write operations (Create, Update, Delete)
- **Queries** - Read operations with pagination and filtering
- **Validators** - Business rule validation using FluentValidation

**Main Modules:**

| Module | Commands | Queries |
|--------|----------|---------|
| Auth | Login, Register | - |
| Users | UpdateProfile, SetDefaults | GetProfile |
| Wallets | Create, Update, Delete | GetAll, GetById |
| DebtPartners | Create, Update, Delete | GetAll, GetById |
| Transactions | QuickDeduct, Adjustment, Update, Delete | GetAll, GetById, MonthlyStats |
| Transfers | Create, Transfer | GetAll, GetById |

### 3. API Layer

HTTP interface using ASP.NET Core with Swagger documentation.

**Controllers:**

| Controller | Base Route | Description |
|------------|------------|-------------|
| `AuthController` | `/api/auth` | Authentication endpoints |
| `UsersController` | `/api/users` | User management |
| `WalletsController` | `/api/wallets` | Wallet CRUD |
| `DebtPartnersController` | `/api/debt-partners` | Partner management |
| `TransactionsController` | `/api/transactions` | Transaction operations |
| `TransfersController` | `/api/transfers` | Transfer operations |

**Features:**
- JWT Bearer authentication
- Comprehensive error handling
- Request/response validation
- Swagger/OpenAPI documentation

### 4. Persistence Layer

Data access implementation using **Entity Framework Core**.

**Components:**
- `ApplicationDbContext` - Main DbContext with entity configurations
- Database Migrations - Version-controlled schema changes
- Snake case naming convention for PostgreSQL

## Architecture Patterns

| Pattern | Implementation |
|---------|----------------|
| Clean Architecture | Dependency inversion with layers |
| CQRS | MediatR for commands/queries |
| Domain-Driven Design | Rich domain entities |
| Repository Pattern | EF Core DbContext |
| Validation Pipeline | FluentValidation integration |

## Technology Stack

- **Framework:** ASP.NET Core 9.0
- **ORM:** Entity Framework Core
- **CQRS:** MediatR
- **Validation:** FluentValidation
- **Authentication:** JWT Bearer
- **Documentation:** Swagger/OpenAPI
- **Database:** PostgreSQL
