# US-03 QuickDeduct Constraint Hardening - COMPLETED

**Status**: Implementation completed  
**Scope**: Backend validation and error handling  
**Features**: Cross-field validation, defensive invariants, exception mapping  

---

## Summary

Successfully hardened quick-deduct input/state constraints across validator, handler, and exception middleware to prevent logically invalid transaction combinations and provide clear API error responses.

---

## Components Implemented

### 1. Cross-Field Validator Rules

**File**: `backend/src/Application/Features/Transactions/QuickDeduct/QuickDeductValidator.cs`

Added 4 new validation rules:

1. **PartnerTra requires PartnerId**
   - Rejects `PayerMode.PartnerTra` when no partner specified
   - Prevents transactions where "partner pays" but no partner is identified

2. **ToiTra-only without Partner**
   - If no `PartnerId` provided, `PayerMode` must be `ToiTra`
   - Ensures personal expenses don't use partner-pays mode

3. **DebtAmount Bounds**
   - `DebtAmount >= 0` (new lower bound check)
   - `DebtAmount <= Total` (existing upper bound preserved)

4. **No-Effect Prevention**
   - `PartnerTra` requires valid `DebtAmount` for split tracking
   - Prevents transactions with no financial impact

### 2. Handler Defensive Invariants

**File**: `backend/src/Application/Features/Transactions/QuickDeduct/QuickDeductCommandHandler.cs`

Added runtime guards after partner resolution:

- Invariant 1: PartnerTra mode must have resolved partner
- Invariant 2: DebtAmount must be non-negative
- Invariant 3: DebtAmount cannot exceed Total
- Invariant 4: PartnerTra requires valid DebtAmount

These act as anti-bypass protection even if validator is circumvented.

### 3. Exception Mapping

**File**: `backend/src/API/Middleware/GlobalExceptionHandler.cs`

Added `NotFoundException` handling:

- **Before**: Returned HTTP 500 (generic error)
- **After**: Returns HTTP 404 with structured error response

Status code mapping:
- `ValidationException` → 400 Bad Request
- `NotFoundException` → 404 Not Found
- `UnauthorizedAccessException` → 401 Unauthorized
- Other exceptions → 500 Internal Server Error

---

## Validation Rules Matrix

| Combination | Valid? | Rule Applied |
|-------------|--------|--------------|
| ToiTra + null PartnerId | ✅ | Personal expense allowed |
| ToiTra + PartnerId | ✅ | User pays, partner owes portion |
| PartnerTra + null PartnerId | ❌ | Validator + Handler reject |
| PartnerTra + PartnerId | ✅ | Partner pays, user owes portion |
| DebtAmount < 0 | ❌ | Validator + Handler reject |
| DebtAmount > Total | ❌ | Validator + Handler reject |
| PartnerTra + DebtAmount = null | ❌ | No split to track, rejected |

---

## Files Changed

```
backend/src/Application/Features/Transactions/QuickDeduct/
  ~ QuickDeductValidator.cs          (+4 rules, +1 helper method)
  ~ QuickDeductCommandHandler.cs     (+4 defensive invariants)

backend/src/API/Middleware/
  ~ GlobalExceptionHandler.cs        (+NotFoundException → 404)

docs/plan/
  + US03_Constraint_Hardening.md

docs/done/
  + US03_Constraint_Hardening.md     (this file)
```

---

## API Behavior Changes

### Error Responses

**PartnerTra without PartnerId** (400):
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Validation Error",
  "status": 400,
  "errors": {
    "PartnerId": ["PartnerId is required when PayerMode is PartnerTra"]
  }
}
```

**Wallet Not Found** (404):
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Not Found",
  "status": 404,
  "errors": {
    "NotFound": ["Wallet (d827f649-230c-47df-9568-658bf4a5ef0e) was not found."]
  }
}
```

**Negative DebtAmount** (400):
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Validation Error",
  "status": 400,
  "errors": {
    "DebtAmount": ["DebtAmount cannot be negative"]
  }
}
```

---

## Verification

### Validator Rules
```bash
grep -A2 "PartnerTra requires" backend/src/Application/Features/Transactions/QuickDeduct/QuickDeductValidator.cs
grep "DebtAmount cannot be negative" backend/src/Application/Features/Transactions/QuickDeduct/QuickDeductValidator.cs
```

### Handler Invariants
```bash
grep -A2 "Invariant 1" backend/src/Application/Features/Transactions/QuickDeduct/QuickDeductCommandHandler.cs
grep "anti-bypass" backend/src/Application/Features/Transactions/QuickDeduct/QuickDeductCommandHandler.cs
```

### Exception Mapping
```bash
grep -A5 "NotFoundException" backend/src/API/Middleware/GlobalExceptionHandler.cs
```

---

## Safety Measures

✅ **No schema changes** - Pure validation logic
✅ **No business formula changes** - Hybrid debt-tagging preserved
✅ **Backward compatible** - Valid requests unchanged
✅ **Defense in depth** - Validator + Handler + Middleware layers
✅ **Clear error messages** - Actionable validation feedback

---

## Out of Scope (Not Implemented)

- Test file modifications
- Performance optimization
- Internationalization
- Logging enhancements
- Additional endpoints

---

## Compliance

✅ Documentation workflow: Plan and Done files created
✅ No build/test execution by agent
✅ No package installation
✅ Follows existing code patterns
✅ Clean Architecture compliance

---

## Notes

- All validation rules use FluentValidation `.When()` pattern
- Handler invariants throw `InvalidOperationException` with descriptive messages
- Exception mapping uses standard RFC 7231 problem details format
- Constraints align with US-03 requirements from SRS v1.1

---

*Completed by Atlas on 2026-02-15*
