# US-05 & US-06: Frontend History Plan

## Overview
This plan covers the frontend implementation for transaction history in a dedicated `/history` page. Scope includes history data rendering, filter/query behavior, transfer-aware row presentation, and lock-safe row actions.

## Scope
- Frontend only (Next.js, React, TypeScript)
- No backend code changes
- No new npm packages
- Consume existing history-related APIs from backend

## Constraints
- Follow `RULES.md` documentation workflow (plan in `docs/plan`, completion note in `docs/done`)
- Do not run build/test/lint in agent environment
- Keep implementation FE-only, no backend modification claims
- Keep compatibility for legacy route `/workspace?tab=history` by redirecting to `/history`

## API Contracts Consumed by Frontend
- `GET /api/transactions`
  - Query params used by FE: `search`, `walletId`
- `PUT /api/transactions/{id}`
  - Used by FE to update note for an existing history item
- `DELETE /api/transactions/{id}`
  - Used by FE to delete a history item

## Planned File Areas

### Route and Navigation
- `frontend/src/app/(dashboard)/history/page.tsx`
- `frontend/src/app/(dashboard)/layout.tsx`
- `frontend/src/app/(dashboard)/workspace/page.tsx`

### History Feature
- `frontend/src/features/history/types/history.ts`
- `frontend/src/features/history/api/history.ts`
- `frontend/src/features/history/hooks/useHistoryQueryState.ts`
- `frontend/src/features/history/components/HistoryFilters.tsx`
- `frontend/src/features/history/components/HistoryPageContainer.tsx`
- `frontend/src/features/history/components/HistoryList.tsx`
- `frontend/src/features/history/components/HistoryRow.tsx`

## Implementation Phases

### Phase 1: Contracts and API Layer
1. Define history DTO/types for transaction rows and transfer metadata.
2. Add FE API helpers for list, note update, and delete operations.
3. Support `search` and `walletId` query params when fetching history.

### Phase 2: URL-Driven Query State and Filters
1. Add query-state hook to sync URL params and local filter state.
2. Implement debounced search updates for URL query.
3. Add wallet filter control tied to query-state hook.

### Phase 3: History List and Row Rendering
1. Build page container to fetch and sort newest-first history rows.
2. Add list-level loading, error, and empty states.
3. Add row rendering with transfer-aware amount sign, color, and transfer label.

### Phase 4: Lock-Safe Actions and Compatibility
1. Add edit note and delete actions with lock-safe disabled behavior.
2. Surface lock hints and lock-state badges in row UI.
3. Keep legacy compatibility by redirecting `/workspace?tab=history` to `/history`.

## Verification Checklist
- [ ] `/history` route renders history page container
- [ ] Search filter updates URL query and refreshes list
- [ ] Wallet filter updates URL query and refreshes list
- [ ] List handles loading, error, and empty states
- [ ] Transfer rows render deterministic sign and transfer label
- [ ] Locked rows show visible but disabled edit/delete actions
- [ ] Note update uses `PUT /api/transactions/{id}`
- [ ] Delete uses `DELETE /api/transactions/{id}`
- [ ] Legacy `/workspace?tab=history` redirects to `/history`

## Known Limitations
- Runtime build/test execution is not performed by agent per project rules
- FE lock behavior depends on server lock signals and lock-like error messages
- Pagination/infinite scrolling is not included in this scope
