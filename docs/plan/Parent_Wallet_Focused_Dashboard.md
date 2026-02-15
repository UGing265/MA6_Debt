# Parent Wallet Focused Dashboard - Implementation Plan

## Overview
This plan defines the comprehensive implementation of a **Parent Wallet Focused Dashboard** feature for the MA6 Debt Management System. The feature enables users to view and manage their primary (parent) wallets with an integrated view of debt partners and child wallets, complete with balance tracking and hierarchical wallet organization.

**Status**: Planning Phase  
**Feature Type**: Full-stack (Backend + Frontend)  
**Scope**: Dashboard redesign, wallet management UI, debt partner integration, workspace consolidation

---

## Objectives
1. **Dashboard Redesign**: Create a parent-wallet-centric view replacing generic dashboard
2. **Wallet Management**: Display hierarchical wallets with parent/child relationships
3. **Debt Integration**: Show debt partners linked to each parent wallet
4. **Balance Tracking**: Real-time calculation and display of wallet balances
5. **User Experience**: Unified workspace interface with tabs for wallets and debt partners

---

## Architecture Overview

### Frontend (Next.js 14 + React)
- **App Router**: Route-based organization in `app/(dashboard)/`
- **Feature-based Structure**: `features/wallet/`, `features/debt/`, `features/workspace/`
- **State Management**: TanStack Query for server state, React hooks for local state
- **UI Components**: shadcn/ui (built on Radix UI) + Tailwind CSS

### Backend (.NET 9 + PostgreSQL)
- **Clean Architecture**: Domain → Application → Persistence → API
- **CQRS Pattern**: MediatR for command/query separation
- **API Design**: RESTful endpoints with JWT authentication
- **Data Layer**: Entity Framework Core with PostgreSQL

---

## Key Features

### 1. Parent Wallet Dashboard
- Primary landing after login
- Display list of parent wallets (no parent_wallet_id)
- Show wallet name, description, balance, child count
- Quick actions: create, edit, delete, view children

### 2. Wallet Hierarchy
- Parent wallets display child wallets inline
- Child wallets show parent reference
- Expandable/collapsible tree structure
- Balance aggregation (parent includes child transactions)

### 3. Debt Partner Integration
- Link debt partners to parent wallets
- Display debt status per wallet
- Quick access to debt details
- Debt summary in parent wallet view

### 4. Workspace Management
- Unified interface for wallets and debt partners
- Tabbed layout: "Wallets" tab + "Debt Partners" tab
- Modal forms for create/edit operations
- Real-time balance updates

### 5. Balance Tracking
- Calculate balance from transaction sum
- Real-time updates on transaction creation
- Support for signed amounts (debit/credit)
- Per-wallet balance display

---

## Data Model

### Core Entities (PostgreSQL)
```
users (user_id, email, password_hash, created_at)
  ├── wallets (id, user_id, name, description, parent_wallet_id, balance_calculated)
  ├── debt_partners (id, user_id, name, initial_balance, signed_initial_balance)
  └── transactions (id, wallet_id, debt_partner_id, amount, description, created_at)
```

### Key Relationships
- **User → Wallet**: One-to-many (user can have multiple wallets)
- **Wallet → Wallet**: Self-referential (parent-child hierarchy)
- **Wallet → Transaction**: One-to-many (wallet has multiple transactions)
- **DebtPartner → Transaction**: One-to-many (debt partner has multiple transactions)

---

## API Endpoints

### Wallet Endpoints
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/wallets` | Create wallet | ✓ |
| GET | `/api/wallets` | List user wallets | ✓ |
| GET | `/api/wallets/{id}` | Get wallet detail | ✓ |
| PUT | `/api/wallets/{id}` | Update wallet | ✓ |
| DELETE | `/api/wallets/{id}` | Delete wallet | ✓ |

### Debt Partner Endpoints
| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/debt-partners` | Create debt partner | ✓ |
| GET | `/api/debt-partners` | List user debt partners | ✓ |
| GET | `/api/debt-partners/{id}` | Get debt partner detail | ✓ |
| PUT | `/api/debt-partners/{id}` | Update debt partner | ✓ |
| DELETE | `/api/debt-partners/{id}` | Delete debt partner | ✓ |

---

## Backend Implementation Steps

### Phase 1: Authentication & Core Setup
1. ✓ Auth controller with JWT token generation
2. ✓ Password hashing and validation
3. ✓ Global exception handling middleware
4. ✓ Dependency injection configuration

### Phase 2: Wallet Management
1. ✓ Wallet entity with parent-child hierarchy
2. ✓ CreateWallet command with parent validation
3. ✓ UpdateWallet command with user scope
4. ✓ DeleteWallet command with guardrails
5. ✓ GetWallets query with balance calculation
6. ✓ GetWalletById query with detail view
7. ✓ WalletsController with REST endpoints

### Phase 3: Debt Partner Management
1. ✓ DebtPartner entity with balance tracking
2. ✓ CreateDebtPartner command
3. ✓ UpdateDebtPartner command
4. ✓ DeleteDebtPartner command
5. ✓ GetDebtPartners query with balance calculation
6. ✓ GetDebtPartnerById query
7. ✓ DebtPartnersController with REST endpoints

### Phase 4: Database Layer
1. ✓ ApplicationDbContext with all entities
2. ✓ Database migrations (snake_case naming)
3. ✓ Seed data (optional)
4. ✓ PostgreSQL connection configuration

---

## Frontend Implementation Steps

### Phase 1: Authentication UI
1. ✓ LoginForm component with validation
2. ✓ RegisterForm component with validation
3. ✓ Auth token storage and refresh
4. ✓ Login/register pages

### Phase 2: Wallet Dashboard
1. ✓ WalletList component showing parent wallets
2. ✓ WalletForm component for create/edit
3. ✓ Wallet balance display with formatting
4. ✓ useWallets hook for data fetching

### Phase 3: Debt Partner UI
1. ✓ DebtPartnerList component
2. ✓ DebtPartnerForm component
3. ✓ HybridBalanceInput for signed amounts
4. ✓ useDebtPartners hook for data fetching

### Phase 4: Workspace Integration
1. ✓ Workspace page with tabbed layout
2. ✓ WalletsTabContent component
3. ✓ DebtPartnersTabContent component
4. ✓ Modal-based create/edit forms
5. ✓ Real-time state synchronization

---

## Key Decisions

### 1. Parent-Wallet-Centric Design
**Decision**: Focus dashboard on parent wallets as primary navigation  
**Rationale**: User mental model - they think in terms of "my wallets" first  
**Trade-off**: Requires hierarchical thinking, but more scalable for complex scenarios

### 2. Hierarchical Wallet Support
**Decision**: Support parent-child wallet relationships  
**Rationale**: Enable flexible partitioning and sub-allocations  
**Implementation**: self-referential `parent_wallet_id` foreign key

### 3. Balance as Calculated Field
**Decision**: Balance = SUM(transactions) per wallet  
**Rationale**: Single source of truth, no data duplication  
**Performance**: Query-based calculation with potential for materialized view

### 4. Authentication via JWT
**Decision**: Stateless JWT tokens in Authorization header  
**Rationale**: Scalable, standard, works well with SPAs  
**Security**: Tokens include `sub` (user ID) claim for authorization

### 5. Feature-Based Frontend Architecture
**Decision**: Organize features in `features/{domain}/` with api/, components/, hooks/, types/  
**Rationale**: Scales better than file-type organization  
**Modularity**: Each feature is independently testable

### 6. Workspace as Unified Interface
**Decision**: Single workspace page with tabs instead of separate routes  
**Rationale**: Reduce navigation friction, see related data at once  
**UX**: Tabs for Wallets and Debt Partners with shared modal forms

---

## Testing Strategy

### Backend Testing
- Unit tests for CQRS handlers
- Validator tests with FluentValidation
- Integration tests for API endpoints
- Database migration verification

### Frontend Testing
- Component tests with React Testing Library
- Hook tests for useSuspenseQuery patterns
- Form validation tests
- API integration tests with mock server

---

## Security Considerations

### Authentication
- JWT tokens with configurable expiry
- Password hashing with bcrypt
- User scope enforcement in all queries/commands

### Authorization
- `[Authorize]` attribute on all controllers
- User ID extracted from JWT `sub` claim
- Database-level user filtering

### Data Validation
- FluentValidation rules on all commands
- Input sanitization on API layer
- CORS configuration for frontend domain

---

## Performance Optimizations

### Database
- Indexes on user_id, parent_wallet_id for fast lookups
- Materialized view for frequently aggregated balances
- Connection pooling via Npgsql

### Frontend
- Code splitting with React.lazy() and Suspense
- Memoization for expensive component renders
- TanStack Query for intelligent caching
- Request debouncing for real-time updates

---

## Deployment & DevOps

### Backend
- Docker containerization (.NET 9)
- PostgreSQL database service
- API documentation via Swagger/Scalar
- Health check endpoints

### Frontend
- Static hosting (Vercel/Netlify)
- Environment variables for API endpoint
- Build optimization with Next.js
- Error tracking with Sentry

---

## Success Criteria

- [ ] Parent wallets display correctly on dashboard
- [ ] Create/edit/delete wallets work end-to-end
- [ ] Balance calculations are accurate
- [ ] Debt partners integrated into workspace
- [ ] All API endpoints return correct data
- [ ] Authentication flow works seamlessly
- [ ] User data is properly scoped
- [ ] No build or TypeScript errors

---

## Timeline & Phases

| Phase | Scope | Duration | Status |
|-------|-------|----------|--------|
| Phase 1 | Authentication & Setup | - | ✓ Complete |
| Phase 2 | Wallet Management | - | ✓ Complete |
| Phase 3 | Debt Partner Management | - | ✓ Complete |
| Phase 4 | Frontend Integration | - | ✓ Complete |
| Phase 5 | Documentation | - | In Progress |

---

## References
- RULES.md: Project conventions and standards
- Existing done documents for completed features
- SRS_v1.1.pdf: System requirements specification
- PostgreSQL naming conventions: snake_case for identifiers

---

**Plan Created**: February 2026  
**Target Completion**: On demand based on user testing
