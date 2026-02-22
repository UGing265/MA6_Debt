# US-07: Internal Wallet Transfers Backend - COMPLETED

**Status**: Implementation completed  
**Scope**: Backend only  
**Verification**: `dotnet msbuild backend/src/API/API.csproj -t:Restore,Compile`

## Implementation Summary

US-07 adds authenticated internal transfers between two wallets owned by the same user. The create flow validates business rules in `CreateTransferValidator`, then writes one `Transfer` row and two linked `Transaction` rows in a single `SaveChangesAsync` call in `CreateTransferCommandHandler`.

Transfer persistence is audit-friendly:
- Debit leg: transaction on `FromWalletId` with `Amount = -request.Amount`
- Credit leg: transaction on `ToWalletId` with `Amount = request.Amount`
- Transfer linkage: `SourceTransactionId` and `DestinationTransactionId` stored on transfer and returned in `TransferDto`

## Files Touched (High-Level)

- API layer
  - `backend/src/API/Controllers/TransfersController.cs`
  - `backend/src/API/Contracts/Transfers/CreateTransferRequest.cs`
- Application transfer feature
  - `backend/src/Application/Features/Transfers/CreateTransfer/CreateTransferCommand.cs`
  - `backend/src/Application/Features/Transfers/CreateTransfer/CreateTransferValidator.cs`
  - `backend/src/Application/Features/Transfers/CreateTransfer/CreateTransferCommandHandler.cs`
  - `backend/src/Application/Features/Transfers/GetTransfers/GetTransfersQuery.cs`
  - `backend/src/Application/Features/Transfers/GetTransfers/GetTransfersQueryHandler.cs`
  - `backend/src/Application/Features/Transfers/GetTransferById/GetTransferByIdQuery.cs`
  - `backend/src/Application/Features/Transfers/GetTransferById/GetTransferByIdQueryHandler.cs`
  - `backend/src/Application/Features/Transfers/TransferDto.cs`
- Integration points used by US-07 behavior
  - `backend/src/Application/Features/Transactions/GetTransactions/GetTransactionsQueryHandler.cs`
  - `backend/src/Application/Features/Transactions/TransactionDto.cs`
  - `backend/src/Application/Features/Transactions/UpdateTransaction/UpdateTransactionCommandHandler.cs`
  - `backend/src/Application/Features/Transactions/DeleteTransaction/DeleteTransactionCommandHandler.cs`
  - `backend/src/Application/Common/Locking/MonthLockPolicy.cs`
  - `backend/src/Application/Features/Wallets/GetWallets/GetWalletsQueryHandler.cs`
  - `backend/src/Application/Features/Wallets/GetWalletById/GetWalletByIdQueryHandler.cs`

## API Endpoint Examples

### POST `/api/transfers`

Creates an internal transfer for the authenticated user.

Request:
```http
POST /api/transfers
Authorization: Bearer {token}
Content-Type: application/json

{
  "fromWalletId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "toWalletId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "amount": 125000,
  "sourceTransactionId": null,
  "destinationTransactionId": null
}
```

Success response (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440100",
  "fromWalletId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "toWalletId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "amount": 125000,
  "sourceTransactionId": "550e8400-e29b-41d4-a716-446655440101",
  "destinationTransactionId": "550e8400-e29b-41d4-a716-446655440102",
  "createdAt": "2026-02-21T10:00:00Z"
}
```

Validation/business rule response (400):
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Validation Error",
  "status": 400,
  "errors": {
    "Amount": ["Amount must be greater than zero"]
  }
}
```

Wallet not found or not owned response (404):
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Not Found",
  "status": 404,
  "errors": {
    "NotFound": ["Wallet with key '3fa85f64-5717-4562-b3fc-2c963f66afa6' was not found."]
  }
}
```

### GET `/api/transfers`

Returns transfers scoped to the authenticated user.

Request:
```http
GET /api/transfers
Authorization: Bearer {token}
```

Success response (200 OK):
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440100",
    "fromWalletId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "toWalletId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    "amount": 125000,
    "sourceTransactionId": "550e8400-e29b-41d4-a716-446655440101",
    "destinationTransactionId": "550e8400-e29b-41d4-a716-446655440102",
    "createdAt": "2026-02-21T10:00:00Z"
  }
]
```

### GET `/api/transfers/{id}`

Returns one transfer for the authenticated user.

Request:
```http
GET /api/transfers/550e8400-e29b-41d4-a716-446655440100
Authorization: Bearer {token}
```

Success response (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440100",
  "fromWalletId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "toWalletId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "amount": 125000,
  "sourceTransactionId": "550e8400-e29b-41d4-a716-446655440101",
  "destinationTransactionId": "550e8400-e29b-41d4-a716-446655440102",
  "createdAt": "2026-02-21T10:00:00Z"
}
```

Not found response (404):
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Not Found",
  "status": 404,
  "errors": {
    "NotFound": ["Transfer not found."]
  }
}
```

## Transfer Rules (Current Behavior)

- `UserId`, `FromWalletId`, and `ToWalletId` must be provided.
- `Amount` must be greater than zero.
- Source and destination wallets must be different.
- Both wallets must exist under the current authenticated user, otherwise a 404 not found is raised.
- Both wallets must share the same `ParentWalletId`.
- Source wallet must have sufficient balance, computed as `SUM(Transactions.Amount)` for that wallet.
- If `SourceTransactionId` is provided, it must belong to `FromWalletId`.
- If `DestinationTransactionId` is provided, it must belong to `ToWalletId`.

## Error Responses

- `400 Validation Error`: FluentValidation rule failures from command validation.
- `404 Not Found`: wallet or transfer not found in user scope (`NotFoundException`).
- `401 Unauthorized`: invalid or missing auth token (`UnauthorizedAccessException`).
- `500 Internal Server Error`: unhandled failures.

Exception-to-HTTP mapping is handled by `backend/src/API/Middleware/GlobalExceptionHandler.cs`.

## Integration Points

- Transfer legs in transaction history search:
  - `GetTransactionsQueryHandler` correlates `Transaction.Id` with `Transfer.SourceTransactionId` and `Transfer.DestinationTransactionId`.
  - `TransactionDto` includes `TransferId`, `TransferFromWalletId`, `TransferToWalletId`, and `TransferDirection`.
- Locking behavior via transaction update and delete paths:
  - `UpdateTransactionCommandHandler` and `DeleteTransactionCommandHandler` call `MonthLockPolicy.IsLocked(...)` before mutation.
  - Transfer-created transaction legs use the same transaction mutation paths, so lock policy applies to those records.
- Balance and net worth behavior:
  - Transfer creation writes signed amounts (`-amount` debit, `+amount` credit) so net effect across wallets is zero.
  - Wallet balance reads (`GetWalletsQueryHandler`, `GetWalletByIdQueryHandler`) use `SUM(Transactions.Amount)`, so transfer legs are included automatically.
