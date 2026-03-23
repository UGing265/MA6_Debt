---
title: Frontend Architecture
description: "Feature-Based Architecture with Next.js 15"
---

## Overview

The frontend follows a modern **Feature-Based Architecture** using Next.js 15 with the App Router.

## Project Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Authentication routes
│   │   ├── (dashboard)/      # Dashboard and feature routes
│   │   └── page.tsx          # Homepage
│   ├── components/            # Reusable UI components
│   │   └── ui/               # Shadcn/ui components
│   ├── features/             # Feature-based modules
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   └── types/                # TypeScript definitions
```

## Feature Modules

Each feature is self-contained with its own components, API, hooks, and types.

### Feature Structure

```
features/[feature-name]/
├── api/           # API service functions
├── components/    # Feature-specific components
├── hooks/         # Custom hooks
├── types/         # TypeScript interfaces
└── utils/         # Feature utilities
```

### Available Features

| Feature | Description |
|---------|-------------|
| `auth` | Login/Register forms, authentication state |
| `wallet` | Wallet CRUD, hierarchical structure |
| `debt` | Debt partners management, repayment dialogs |
| `transaction` | Quick debt deduction, cash adjustments |
| `transfers` | Money transfer between wallets |
| `history` | Transaction history, filters, search |
| `user` | Profile management, user settings |
| `workspace` | Workspace-related components |

## State Management

The application uses a **decentralized state management** approach:

### Pattern 1: Feature-based Hooks

```typescript
// Each feature provides its own hooks
const { wallets, loading, error } = useWallets();
const { partners, refreshPartners } = useDebtPartners();
const { transactions, createTransaction } = useTransactions();
```

### Pattern 2: Listener-based Coordination

Features communicate through a listener pattern:

```typescript
// Trigger refresh in other features
triggerWalletsRefresh();
triggerDebtPartnersRefresh();
```

### Pattern 3: Server State with Client Caching

- Data fetched on-demand with loading/error states
- No global state library (Redux, Zustand)
- React's built-in `useState` and `useEffect`

## API Integration

### Standard API Layer

Each feature has its own API module:

```typescript
// features/wallet/api/walletApi.ts
export const getWallets = async (): Promise<Wallet[]> => {
  const response = await fetch(`${API_URL}/api/wallets`);
  return response.json();
};
```

### Error Handling

- Centralized error parsing utility (`parseErrorResponse`)
- Toast notifications for user feedback
- Consistent error handling across all API calls

### Authentication

- JWT-based authentication
- Automatic token handling
- Protected routes with Next.js middleware

## Component Architecture

### UI Components

- **Shadcn/ui** - Component library built on Radix UI
- **Tailwind CSS** - Utility-first styling
- **class-variance-authority** - Component variants

### Component Patterns

| Pattern | Description |
|---------|-------------|
| Composition | Slot-based components with Radix UI |
| Form Handling | React Hook Form + Zod validation |
| Styling | Tailwind CSS with CSS variables |

## Route Organization

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── page.tsx              # Main dashboard
│   ├── history/page.tsx      # Transaction history
│   ├── wallet/
│   │   └── [id]/page.tsx     # Wallet details
│   └── profile/page.tsx      # User profile
└── page.tsx                  # Landing page
```

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui (Radix UI)
- **Forms:** React Hook Form + Zod
- **HTTP:** Native fetch API
- **State:** React hooks (no global state library)

## Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| No Global State | Simplicity and scalability |
| Feature-based Organization | Independent, maintainable modules |
| Listener Pattern | Decoupled cross-feature communication |
| Server-first API | All data from backend with client caching |
| Shadcn/ui | Consistent, accessible design system |
