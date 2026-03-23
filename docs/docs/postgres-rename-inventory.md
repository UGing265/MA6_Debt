# PostgreSQL Rename Inventory (PascalCase -> snake_case)

Sources:
- `backend/src/Persistence/Migrations/20260208102938_InitialCreate.cs`
- `backend/src/Persistence/Migrations/20260214092505_DebtPartnersSignedInitialBalanceDropType.cs`
- `backend/src/Persistence/Migrations/ApplicationDbContextModelSnapshot.cs`

Scope:
- Schema: `public`
- Inventory includes all *current* DB object names that are PascalCase / mixed-case identifiers.

Snake case rules (deterministic):
- For plain PascalCase: insert `_` before capitals (except first), lowercase all.
  - `DefaultWalletId` -> `default_wallet_id`
- For prefixed names with `_` (constraints/indexes): split by `_`, snake-case each segment, then join with `_`.
  - `FK_DebtPartners_Users_UserId` -> `fk_debt_partners_users_user_id`
  - `IX_Wallets_UserId` -> `ix_wallets_user_id`

Object counts (current schema):
- Tables: 5
- Columns: 33
- Constraints: 12 (5 PK + 7 FK)
- Indexes: 12 (7 explicit `IX_*` + 5 PK-backed indexes named `PK_*`)
- Sequences: 0 (all PKs are `uuid`)

## Tables

| Old (PascalCase) | New (snake_case) |
|---|---|
| `Users` | `users` |
| `Wallets` | `wallets` |
| `DebtPartners` | `debt_partners` |
| `Transactions` | `transactions` |
| `Transfers` | `transfers` |

## Columns

### Users -> users

| Old | New |
|---|---|
| `Id` | `id` |
| `Username` | `username` |
| `PasswordHash` | `password_hash` |
| `Name` | `name` |
| `Email` | `email` |
| `DefaultWalletId` | `default_wallet_id` |
| `DefaultPartnerId` | `default_partner_id` |
| `CreatedAt` | `created_at` |

### Wallets -> wallets

| Old | New |
|---|---|
| `Id` | `id` |
| `UserId` | `user_id` |
| `ParentWalletId` | `parent_wallet_id` |
| `Name` | `name` |
| `Description` | `description` |
| `CreatedAt` | `created_at` |

### DebtPartners -> debt_partners

| Old | New |
|---|---|
| `Id` | `id` |
| `UserId` | `user_id` |
| `Name` | `name` |
| `InitialBalance` | `initial_balance` |
| `IsDeleted` | `is_deleted` |
| `CreatedAt` | `created_at` |

### Transactions -> transactions

| Old | New |
|---|---|
| `Id` | `id` |
| `WalletId` | `wallet_id` |
| `PartnerId` | `partner_id` |
| `Amount` | `amount` |
| `Note` | `note` |
| `TransactionDate` | `transaction_date` |
| `CreatedAt` | `created_at` |

### Transfers -> transfers

| Old | New |
|---|---|
| `Id` | `id` |
| `FromWalletId` | `from_wallet_id` |
| `ToWalletId` | `to_wallet_id` |
| `Amount` | `amount` |
| `TransferDate` | `transfer_date` |
| `CreatedAt` | `created_at` |

## Constraints

### Primary keys

| Old | New |
|---|---|
| `PK_Users` | `pk_users` |
| `PK_Wallets` | `pk_wallets` |
| `PK_DebtPartners` | `pk_debt_partners` |
| `PK_Transactions` | `pk_transactions` |
| `PK_Transfers` | `pk_transfers` |

### Foreign keys

| Old | New |
|---|---|
| `FK_DebtPartners_Users_UserId` | `fk_debt_partners_users_user_id` |
| `FK_Wallets_Users_UserId` | `fk_wallets_users_user_id` |
| `FK_Wallets_Wallets_ParentWalletId` | `fk_wallets_wallets_parent_wallet_id` |
| `FK_Transactions_DebtPartners_PartnerId` | `fk_transactions_debt_partners_partner_id` |
| `FK_Transactions_Wallets_WalletId` | `fk_transactions_wallets_wallet_id` |
| `FK_Transfers_Wallets_FromWalletId` | `fk_transfers_wallets_from_wallet_id` |
| `FK_Transfers_Wallets_ToWalletId` | `fk_transfers_wallets_to_wallet_id` |

## Indexes

### Explicit indexes (`migrationBuilder.CreateIndex`)

| Old | New |
|---|---|
| `IX_DebtPartners_UserId` | `ix_debt_partners_user_id` |
| `IX_Transactions_PartnerId` | `ix_transactions_partner_id` |
| `IX_Transactions_WalletId` | `ix_transactions_wallet_id` |
| `IX_Transfers_FromWalletId` | `ix_transfers_from_wallet_id` |
| `IX_Transfers_ToWalletId` | `ix_transfers_to_wallet_id` |
| `IX_Wallets_ParentWalletId` | `ix_wallets_parent_wallet_id` |
| `IX_Wallets_UserId` | `ix_wallets_user_id` |

### PK-backed indexes (PostgreSQL auto-creates these for PK constraints)

These indexes typically share the same name as the PK constraint.

| Old | New |
|---|---|
| `PK_Users` | `pk_users` |
| `PK_Wallets` | `pk_wallets` |
| `PK_DebtPartners` | `pk_debt_partners` |
| `PK_Transactions` | `pk_transactions` |
| `PK_Transfers` | `pk_transfers` |

## Sequences

None. All primary keys are `uuid` and no identity/serial columns are defined in migrations.

## Dropped / Not In Current Schema (do not rename in DB)

These existed in `InitialCreate` but are removed by later migrations.

| Old (table.column) | New (snake_case) | Status |
|---|---|---|
| `DebtPartners.Type` | `debt_partners.type` | Dropped in `backend/src/Persistence/Migrations/20260214092505_DebtPartnersSignedInitialBalanceDropType.cs` |
