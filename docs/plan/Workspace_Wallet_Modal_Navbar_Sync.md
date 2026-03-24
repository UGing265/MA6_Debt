# Workspace Wallet Modal Navbar Sync - Plan

**Status**: Planning  
**Phase**: Wave 2 - UI Polish & Integration  
**Features**: Dialog component migration, navbar integration, typography standardization  
**Scope**: Frontend consolidation and consistency improvements

---

## Overview

This plan defines the refinement phase for the Workspace feature, focusing on:
- **Dialog Component Migration**: Replace custom dialog implementations with Shadcn/UI dialog wrapper
- **Navbar Sync**: Integrate workspace page with navbar state management
- **Typography Standards**: Apply consistent heading sizes and font weights across components

## Objectives

1. **Migrate all modal/dialog interactions** to use the unified `dialog.tsx` Shadcn/UI component
2. **Synchronize navbar state** with workspace tab navigation
3. **Standardize typography** across all workspace-related components
4. **Maintain consistency** with existing design system (amber/orange theme)
5. **Ensure no API changes** - work with existing endpoints

---

## Scope Definition

### Included (In Scope)
- ✅ Dialog component consolidation in debt partner CRUD flows
- ✅ Dialog component consolidation in wallet create/edit flows
- ✅ Navbar state synchronization with active tab
- ✅ Typography standardization (heading sizes, weights, line-heights)
- ✅ Component refactoring for consistency
- ✅ Update existing documentation

### Excluded (Out of Scope)
- ❌ New API endpoints (use existing `/api/wallets` and `/api/debtpartners`)
- ❌ Search/filter functionality (reserved for Wave 3)
- ❌ New features or business logic changes
- ❌ Performance optimization (if not needed for consistency)

---

## Architecture Changes

### 1. Dialog Component Standardization

#### Current State
- Debt partner CRUD uses `<AlertDialog>` from Shadcn/UI
- Wallet forms use inline modal state management
- Inconsistent dialog trigger patterns

#### Target State
```typescript
// Unified dialog pattern across all CRUD operations
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Action</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Operation Title</DialogTitle>
    </DialogHeader>
    {/* Form or confirmation content */}
  </DialogContent>
</Dialog>
```

#### Implementation Details
- Use Shadcn/UI `dialog.tsx` component for all modals
- Keep `AlertDialog` for destructive operations (delete confirmations)
- Apply consistent backdrop, padding, and animations
- Ensure keyboard navigation (Esc to close, Tab through fields)

### 2. Navbar Sync Strategy

#### Workspace Navbar Requirements
- Display active tab indicator
- Sync with URL query parameters (`?tab=wallets` vs `?tab=partners`)
- Show workspace title with breadcrumb
- Maintain navbar state across navigation

#### Implementation
```typescript
// workspace/page.tsx
const searchParams = useSearchParams();
const activeTab = searchParams?.get("tab") || "wallets";

// Navbar receives:
// - activeTab: string
// - onTabChange: (tab: string) => void
// - title: "Workspace"
```

### 3. Typography Standardization

#### Heading Hierarchy
| Level | Component | Size | Weight | Line-Height | Usage |
|-------|-----------|------|--------|-------------|-------|
| H1 | Tab title | 28px | 600 | 36px | "Wallets" / "Debt Partners" |
| H2 | Section header | 24px | 600 | 32px | Form section titles |
| H3 | Card title | 20px | 600 | 28px | Summary card header |
| H4 | Item name | 16px | 500 | 24px | Debt partner name in list |
| Body | Description | 14px | 400 | 20px | Form labels, list descriptions |
| Small | Helper text | 12px | 400 | 18px | Form helpers, error messages |

#### Application Rules
1. **Tab headers**: Use H1 with amber/orange theme color
2. **Form titles**: Use H2 (e.g., "Create Wallet", "Edit Partner")
3. **Card headers**: Use H3 with consistent spacing
4. **Item labels**: Use H4 for clarity
5. **All headings**: Ensure consistent color, spacing, and weight

### 4. File Modifications

#### Modified Components
1. **`frontend/src/features/workspace/components/WalletsTabContent.tsx`**
   - Update typography (H1 for "Wallets" title)
   - Ensure dialog pattern consistency

2. **`frontend/src/features/workspace/components/DebtPartnersTabContent.tsx`**
   - Update typography (H1 for "Debt Partners" title)
   - Ensure dialog pattern consistency

3. **`frontend/src/features/wallet/components/WalletForm.tsx`**
   - Update typography hierarchy
   - Align with standardized heading sizes

4. **`frontend/src/features/debt/components/DebtPartnerForm.tsx`**
   - Update typography hierarchy
   - Align with standardized heading sizes

5. **`frontend/src/features/debt/components/DebtPartnerList.tsx`**
   - Update item typography (H4 for names)
   - Consistent spacing with typography rules

6. **`frontend/src/features/wallet/components/WalletList.tsx`**
   - Update typography for consistency
   - Apply standard line-heights

7. **`frontend/src/app/(dashboard)/workspace/page.tsx`**
   - Integrate navbar state management
   - Ensure tab state syncs with navbar

---

## Implementation Steps

### Phase 1: Dialog Migration (Task 1)
1. Audit all modal/dialog usage in workspace components
2. Replace custom dialog implementations with Shadcn/UI `dialog.tsx`
3. Ensure consistent open/close handling
4. Test keyboard navigation

### Phase 2: Navbar Sync (Task 2)
1. Create navbar integration helper hook
2. Sync active tab with navbar state
3. Update workspace page to manage navbar context
4. Test breadcrumb and active indicator display

### Phase 3: Typography Standardization (Task 3)
1. Audit all heading components in workspace
2. Apply standardized sizes and weights
3. Update spacing to match typography rules
4. Verify consistency across all viewport sizes

### Phase 4: Documentation & Verification (Task 4)
1. Update plan documentation
2. Create done documentation
3. List all modified files with changes
4. Verify consistency improvements

---

## Key Decisions

### Decision 1: Dialog Component Choice
**Choice**: Use Shadcn/UI `dialog.tsx` + `AlertDialog` for destructive ops  
**Rationale**: 
- Unified component library consistency
- Better accessibility (ARIA support)
- Keyboard navigation built-in
- Matches existing project patterns

### Decision 2: Typography Scaling
**Choice**: 2-step weight progression (400→500→600) with size increments  
**Rationale**:
- Clear visual hierarchy
- Improves scannability
- Accessible contrast ratios
- Reduces cognitive load

### Decision 3: Navbar State Management
**Choice**: Use URL query params + React context for navbar sync  
**Rationale**:
- Preserves browser history
- Shareable URLs with tab state
- Consistent with workspace navigation pattern
- Avoids prop drilling

---

## Files to Modify

### UI Components
- `frontend/src/components/ui/dialog.tsx` (already exists, verify usage)

### Feature Components
- `frontend/src/features/workspace/components/WalletsTabContent.tsx`
- `frontend/src/features/workspace/components/DebtPartnersTabContent.tsx`
- `frontend/src/features/wallet/components/WalletForm.tsx`
- `frontend/src/features/wallet/components/WalletList.tsx`
- `frontend/src/features/debt/components/DebtPartnerForm.tsx`
- `frontend/src/features/debt/components/DebtPartnerList.tsx`

### Page Components
- `frontend/src/app/(dashboard)/workspace/page.tsx`

### Layout Components
- `frontend/src/app/(dashboard)/layout.tsx` (navbar integration)

---

## API Usage

### No API Changes Required
All CRUD operations use existing endpoints:

**Wallet APIs**
- `GET /api/wallets` - List all wallets
- `GET /api/wallets/:id` - Get single wallet
- `POST /api/wallets` - Create wallet
- `PUT /api/wallets/:id` - Update wallet
- `DELETE /api/wallets/:id` - Delete wallet

**Debt Partner APIs**
- `GET /api/debtpartners` - List all debt partners
- `GET /api/debtpartners/:id` - Get single debt partner
- `POST /api/debtpartners` - Create debt partner
- `PUT /api/debtpartners/:id` - Update debt partner
- `DELETE /api/debtpartners/:id` - Soft delete debt partner

---

## Visual Standards

### Color Consistency
| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Wallets accent | Amber | #FCD34D | Primary buttons, headers |
| Wallets hover | Light Amber | #FBBF24 | Hover states |
| Debt Partners accent | Orange | #FF7A00 | Primary buttons, headers |
| Debt Partners hover | Dark Orange | #E56E00 | Hover states |
| Text primary | Gray | #1F2937 | Body text, labels |
| Text secondary | Gray | #6B7280 | Helper text, descriptions |
| Borders | Gray | #E5E7EB | Card borders, dividers |
| Background | Cream | #FFFBEB | Card backgrounds |

### Spacing Consistency
- Card padding: `24px` (p-6 in Tailwind)
- Section gap: `24px` (space-y-6 in Tailwind)
- Form field gap: `16px` (space-y-4 in Tailwind)
- Button group gap: `12px` (gap-3 in Tailwind)

---

## Verification Checklist

### Dialog Migration
- [ ] All wallet forms use Shadcn dialog component
- [ ] All debt partner forms use Shadcn dialog component
- [ ] Delete confirmations use AlertDialog
- [ ] Keyboard navigation works (Esc, Tab, Enter)
- [ ] Dialog backdrop closes on outside click
- [ ] Focus management correct (trap in dialog, restore on close)

### Navbar Sync
- [ ] Navbar displays active tab indicator
- [ ] Tab click updates URL query parameter
- [ ] URL navigation updates active tab
- [ ] Breadcrumb shows "Workspace"
- [ ] Back button preserves tab state
- [ ] Share URL includes tab state

### Typography
- [ ] All H1 headings use 28px/600 weight
- [ ] All H2 headings use 24px/600 weight
- [ ] All H3 headings use 20px/600 weight
- [ ] Body text uses 14px/400 weight
- [ ] Line-heights match specification
- [ ] Spacing between elements follows rules
- [ ] Mobile responsive (no overflow)

### Cross-Component Consistency
- [ ] Wallet tab matches debt partner tab styling
- [ ] Forms look identical across features
- [ ] Error messages display consistently
- [ ] Loading states match (spinner style/color)
- [ ] Empty states match (icon/text/button)
- [ ] Button styles uniform across tabs

---

## Risk Mitigation

### Risk 1: Breaking Existing Dialog Functionality
**Mitigation**: Test all CRUD flows before merge
- Verify create/edit dialogs open and close correctly
- Verify delete confirmations display correctly
- Test form submission within dialogs

### Risk 2: Navbar State Inconsistency
**Mitigation**: Use URL as source of truth
- Always read from searchParams first
- Sync navbar display with URL state
- Test back/forward navigation

### Risk 3: Typography Inconsistency Across Viewport Sizes
**Mitigation**: Test responsive behavior thoroughly
- Mobile (320px), tablet (768px), desktop (1280px)
- Use MUI responsive breakpoints
- Verify no text overflow or truncation

---

## Success Criteria

- ✅ All dialogs use Shadcn/UI component
- ✅ Navbar syncs with tab navigation
- ✅ Typography follows standard hierarchy
- ✅ No breaking changes to existing functionality
- ✅ All CRUD operations work identically
- ✅ Documentation complete and accurate
- ✅ No new API endpoints created

---

## References

- **Existing Workspace Implementation**: `docs/done/US01_US02_FE_Workspace.md`
- **Design System**: `docs/plan/Frontend_Design.md`
- **Backend APIs**: `docs/done/US02_DebtPartner_Backend.md`
- **Project Rules**: `RULES.md`

---

**Created**: 2026-02-15  
**Phase**: Wave 2 - UI Polish & Integration  
**Owner**: Frontend Team
