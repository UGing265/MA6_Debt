# US-03 QuickDeduct Constraint Hardening Implementation Plan

## Overview

Harden quick-deduct input/state constraints across validator, handler, controller contract, and exception mapping so invalid combinations are rejected early and consistently.

**Status**: Planning Phase  
**Scope**: Backend only  
**Risk Level**: Low (additive validation only)

---

## Problem Statement

Current quick-deduct flow allows some logically inconsistent combinations:

1. **PartnerTra without PartnerId**: Creates a transaction where the partner pays but no partner is specified, resulting in no debt tracking.
2. **Negative DebtAmount**: Validator only checks `DebtAmount <= Total`, missing the lower bound.
3. **No-effect states**: Some combinations produce transactions with no actual financial impact.
4. **Exception mapping**: `NotFoundException` returns generic 500 instead of 404.

---

## Solution Approach

### 1. Cross-Field Validator Rules

Add explicit rules in `QuickDeductValidator`:

- **PartnerTra requires PartnerId**: Reject `PayerMode.PartnerTra` when no partner specified
- **ToiTra-only without partner**: If no `PartnerId`, `PayerMode` must be `ToiTra`
- **DebtAmount bounds**: `0 <= DebtAmount <= Total`
- **No-effect prevention**: `PartnerTra` requires valid `DebtAmount` for split tracking

### 2. Handler Defensive Invariants

Add runtime guards in `QuickDeductCommandHandler`:
- Verify calculated deltas are meaningful before persistence
- Fail fast if validator bypass detected

### 3. Exception Mapping Fix

Update `GlobalExceptionHandler`:
- Map `NotFoundException` to HTTP 404
- Keep `ValidationException` as HTTP 400

---

## Validation Rules Matrix

| Combination | Valid? | Rule |
|-------------|--------|------|
| ToiTra + null PartnerId | ✅ | Personal expense, no debt |
| ToiTra + PartnerId | ✅ | User pays, partner owes portion |
| PartnerTra + null PartnerId | ❌ | Who pays? No partner specified |
| PartnerTra + PartnerId | ✅ | Partner pays, user owes portion |
| DebtAmount < 0 | ❌ | Negative debt is invalid |
| DebtAmount > Total | ❌ | Cannot owe more than total bill |
| DebtAmount = 0 + PartnerTra | ❌ | No split to track |

---

## Files to Modify

### Application Layer
- `backend/src/Application/Features/Transactions/QuickDeduct/QuickDeductValidator.cs`
  - Add 4 cross-field validation rules
  - Add helper method `HasDefaultPartner`

- `backend/src/Application/Features/Transactions/QuickDeduct/QuickDeductCommandHandler.cs`
  - Add defensive invariant checks before `SaveChangesAsync`

### API Layer
- `backend/src/API/Middleware/GlobalExceptionHandler.cs`
  - Add `NotFoundException` → 404 mapping

### Documentation
- `docs/plan/US03_Constraint_Hardening.md` (this file)
- `docs/done/US03_Constraint_Hardening.md` (completion report)

---

## Constraint Details

### Rule 1: PartnerTra Requires PartnerId
```csharp
RuleFor(x => x)
    .Must(cmd => cmd.PartnerId.HasValue || HasDefaultPartner(cmd))
    .When(x => x.PayerMode == PayerMode.PartnerTra)
    .WithMessage("PartnerId is required when PayerMode is PartnerTra");
```

### Rule 2: ToiTra-Only Without Partner
```csharp
RuleFor(x => x.PayerMode)
    .Must(payerMode => payerMode == PayerMode.ToiTra)
    .When(x => !x.PartnerId.HasValue && !HasDefaultPartner(x))
    .WithMessage("When PartnerId is not provided, PayerMode must be ToiTra");
```

### Rule 3: DebtAmount Bounds
```csharp
RuleFor(x => x.DebtAmount)
    .Must(debtAmount => debtAmount == null || debtAmount >= 0)
    .WithMessage("DebtAmount cannot be negative");
```

### Rule 4: No-Effect Prevention
```csharp
RuleFor(x => x)
    .Must(cmd => cmd.DebtAmount.HasValue && cmd.DebtAmount.Value >= 0)
    .When(x => x.PayerMode == PayerMode.PartnerTra)
    .WithMessage("PartnerTra mode requires a valid DebtAmount to track the split");
```

---

## Exception Mapping

### Current Behavior
- `NotFoundException` → HTTP 500 (generic error)
- `ValidationException` → HTTP 400 (structured errors)

### Target Behavior
- `NotFoundException` → HTTP 404 (resource not found)
- `ValidationException` → HTTP 400 (validation errors)
- Other exceptions → HTTP 500 (server error)

### Implementation
```csharp
if (exception is NotFoundException)
{
    context.Response.StatusCode = StatusCodes.Status404NotFound;
    // ... serialize error
}
```

---

## Verification Checklist

### Before Implementation
- [ ] Review existing validation patterns in validator
- [ ] Confirm exception handler structure
- [ ] Verify no breaking changes to valid request formats

### After Implementation
- [ ] `PartnerTra` without `PartnerId` returns 400
- [ ] `DebtAmount < 0` returns 400
- [ ] `DebtAmount > Total` returns 400
- [ ] Missing wallet/partner returns 404 (not 500)
- [ ] Valid requests still work correctly
- [ ] All error messages are clear and actionable

---

## Constraints & Guardrails

### Must Follow
- ✅ Add validation rules only (no removal)
- ✅ Use existing FluentValidation patterns
- ✅ Keep error messages in English (consistent with project)
- ✅ Preserve US-03 business formulas
- ✅ No schema changes

### Must NOT Do
- ❌ Modify hybrid debt-tagging formulas
- ❌ Change Transaction entity schema
- ❌ Alter US-04 notification logic
- ❌ Add new packages
- ❌ Remove existing validation rules
- ❌ Refactor unrelated code

---

## Out of Scope

- Test file changes (user handles testing)
- Performance optimization
- Internationalization
- Logging enhancements
- Partial update endpoints (PATCH)

---

## References

- `docs/main/SRS_v1.1.pdf` - US-03 requirements
- `RULES.md` - Project conventions
- `docs/done/US03_US04_QuickDeduct_Backend.md` - Prior implementation
- `docs/done/US03_DB_Migration_AutoStart.md` - Recent changes

---

*Plan created by Atlas on 2026-02-15*
