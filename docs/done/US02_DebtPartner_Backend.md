# US-02: Debt Partner Backend - COMPLETED

**Status**: Completed  
**Feature**: US-02 Debt Partner  
**Scope**: Backend only

---

## Components Implemented

### Architecture Change: Signed Balance Model (SRS v1.1)
**BREAKING CHANGE**: Removed `Type` field. Debt direction now determined by `InitialBalance` sign:
- Positive (`> 0`): Partner owes user (receivable)
- Negative (`< 0`): User owes partner (payable)
- Zero: Neutral

**Migration**: `20260214092505_DebtPartnersSignedInitialBalanceDropType` converts existing data and drops Type column.

### 1. DebtPartner DTO
- **File**: `backend/src/Application/Features/DebtPartners/DebtPartnerDto.cs`
- Response model used by Debt Partner APIs.
- **Note**: No longer includes `Type` property.

### 2. Create Debt Partner
- **Files**:
  - `backend/src/Application/Features/DebtPartners/CreateDebtPartner/CreateDebtPartnerCommand.cs`
  - `backend/src/Application/Features/DebtPartners/CreateDebtPartner/CreateDebtPartnerCommandHandler.cs`
  - `backend/src/Application/Features/DebtPartners/CreateDebtPartner/CreateDebtPartnerValidator.cs`

### 3. Update Debt Partner
- **Files**:
  - `backend/src/Application/Features/DebtPartners/UpdateDebtPartner/UpdateDebtPartnerCommand.cs`
  - `backend/src/Application/Features/DebtPartners/UpdateDebtPartner/UpdateDebtPartnerCommandHandler.cs`
  - `backend/src/Application/Features/DebtPartners/UpdateDebtPartner/UpdateDebtPartnerValidator.cs`

### 4. Delete Debt Partner (Soft Delete)
- **Files**:
  - `backend/src/Application/Features/DebtPartners/DeleteDebtPartner/DeleteDebtPartnerCommand.cs`
  - `backend/src/Application/Features/DebtPartners/DeleteDebtPartner/DeleteDebtPartnerCommandHandler.cs`
  - `backend/src/Application/Features/DebtPartners/DeleteDebtPartner/DeleteDebtPartnerValidator.cs`
- Soft delete logic implemented in handler.

### 5. Get Debt Partners
- **Files**:
  - `backend/src/Application/Features/DebtPartners/GetDebtPartners/GetDebtPartnersQuery.cs`
  - `backend/src/Application/Features/DebtPartners/GetDebtPartners/GetDebtPartnersQueryHandler.cs`

### 6. Get Debt Partner By Id
- **Files**:
  - `backend/src/Application/Features/DebtPartners/GetDebtPartnerById/GetDebtPartnerByIdQuery.cs`
  - `backend/src/Application/Features/DebtPartners/GetDebtPartnerById/GetDebtPartnerByIdQueryHandler.cs`

### 7. API Controller
- **File**: `backend/src/API/Controllers/DebtPartnersController.cs`
- Endpoints implemented and wired to MediatR commands/queries.

---

## Soft Delete Notes
- Delete sets `IsDeleted = true` on the `DebtPartner` entity (no physical delete).
- Read/query handlers exclude soft-deleted records using `!dp.IsDeleted`.

---

## API Contract Changes

### Request/Response Changes
- **Removed**: `Type` field from all requests and responses
- **Request body** now only requires: `name`, `initialBalance`
- **Response body** returns: `id`, `name`, `initialBalance`
- **Breaking change**: Clients expecting `type` in response will need updates

### Validation Changes
- `Type` validation removed
- `InitialBalance` accepts any decimal value (positive, negative, or zero)
- `Name` remains required

---

## Verification (Available Endpoints)
- `POST /api/debtpartners` - Accepts signed InitialBalance
- `GET /api/debtpartners` - Returns partners without Type field
- `GET /api/debtpartners/{id}` - Returns partner without Type field
- `PUT /api/debtpartners/{id}` - Accepts signed InitialBalance
- `DELETE /api/debtpartners/{id}` (soft delete)
