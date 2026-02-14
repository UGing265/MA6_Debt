# Implementation Plan - US-02: Debt Partner Management

## 1. Overview
This user story focuses on managing Debt Partners, which are entities (people or organizations) that the user owes money to (Payable) or who owe money to the user (Receivable).

### Requirements:
- CRUD operations for Debt Partners.
- Fields: `Name`, `InitialBalance` (signed decimal).
- Soft delete support.
- `InitialBalance` is the starting point for debt calculation.

### Signed Balance Semantics (SRS v1.1):
- `InitialBalance > 0`: Partner owes user (receivable)
- `InitialBalance < 0`: User owes partner (payable)
- `InitialBalance = 0`: Neutral

## 2. Implementation Steps

### Application Layer (`backend/src/Application`)
1.  **DTOs**:
    *   Create `DebtPartnerDto` in `Application/Features/DebtPartners/Queries`.
2.  **Commands**:
    *   `CreateDebtPartnerCommand`: Handles creation of a new debt partner.
    *   `UpdateDebtPartnerCommand`: Handles updating existing debt partner details.
    *   `DeleteDebtPartnerCommand`: Handles soft deletion by setting `IsDeleted = true`.
3.  **Queries**:
    *   `GetDebtPartnersQuery`: Returns a list of debt partners for the current user.
    *   `GetDebtPartnerByIdQuery`: Returns details of a specific debt partner.
4.  **Validators**:
    *   `CreateDebtPartnerCommandValidator`: Ensures `Name` is not empty.
    *   `UpdateDebtPartnerCommandValidator`: Similar to create validator.

### API Layer (`backend/src/API`)
1.  **Controller**:
    *   Create `DebtPartnersController` in `API/Controllers`.
    *   Implement endpoints mapping to the commands and queries.

## 3. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/debt-partners` | Create a new debt partner |
| GET | `/api/debt-partners` | Get all debt partners for the current user |
| GET | `/api/debt-partners/{id}` | Get a specific debt partner by ID |
| PUT | `/api/debt-partners/{id}` | Update a debt partner |
| DELETE | `/api/debt-partners/{id}` | Soft delete a debt partner |

## 4. Verification Strategy

### Unit Testing
- Test `CreateDebtPartnerCommandHandler` for successful creation and validation failures.
- Test `UpdateDebtPartnerCommandHandler` for updating fields and handling non-existent IDs.
- Test `DeleteDebtPartnerCommandHandler` for soft delete logic.
- Test Queries for correct data retrieval and filtering by `UserId`.

### Integration Testing
- Test API endpoints using `WebApplicationFactory`.
- Verify that `IsDeleted` partners are not returned in `GetDebtPartnersQuery`.
- Verify that `InitialBalance` is correctly saved.
