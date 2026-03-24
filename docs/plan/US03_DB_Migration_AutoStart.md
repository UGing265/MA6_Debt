# US-03 DB Migration Auto-Start Implementation Plan

## Overview

Plan to fix runtime `42703 column debt_amount does not exist` error by creating EF migration for missing US-03 transaction columns and implementing safe auto-migration for Development/Staging environments.

**Status**: Planning Phase
**Scope**: Backend only (Persistence + API layers)
**Risk Level**: Low (additive migration only)

---

## Problem Statement

The US-03 Quick Deduct feature adds 5 new audit columns to the `Transaction` entity:
- `debt_amount` (numeric, nullable)
- `payer_mode` (integer, nullable)
- `total_amount` (numeric, nullable)
- `partner_balance_before` (numeric, nullable)
- `partner_balance_after` (numeric, nullable)

These columns exist in the C# entity model but are **missing from the database schema**, causing runtime PostgreSQL errors when attempting to insert transactions.

---

## Solution Approach

### 1. EF Migration (Code-First)

Create a new EF Core migration to add the missing columns:
- Migration name: `AddUs03TransactionFields`
- Operation type: **Additive only** (no destructive changes)
- All columns: **nullable** to avoid data loss for existing rows

### 2. Auto-Migration Startup Logic

Implement environment-gated auto-migration in `Program.cs`:
- **Development**: Auto-migrate on startup
- **Staging**: Auto-migrate on startup
- **Production**: **Never** auto-migrate (log skip message only)

### 3. Safety Measures

- Migration wrapped in try-catch with detailed logging
- Production explicitly excluded from auto-migration
- All new columns are nullable (no defaults that could misinterpret data)
- No raw SQL in migration (code-first only)

---

## Implementation Details

### Migration File Structure

```csharp
public partial class AddUs03TransactionFields : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<decimal>(
            name: "debt_amount",
            table: "transactions",
            type: "numeric",
            nullable: true);
            
        migrationBuilder.AddColumn<decimal>(
            name: "partner_balance_after",
            table: "transactions",
            type: "numeric",
            nullable: true);
            
        migrationBuilder.AddColumn<decimal>(
            name: "partner_balance_before",
            table: "transactions",
            type: "numeric",
            nullable: true);
            
        migrationBuilder.AddColumn<int>(
            name: "payer_mode",
            table: "transactions",
            type: "integer",
            nullable: true);
            
        migrationBuilder.AddColumn<decimal>(
            name: "total_amount",
            table: "transactions",
            type: "numeric",
            nullable: true);
    }
    
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(name: "debt_amount", table: "transactions");
        migrationBuilder.DropColumn(name: "partner_balance_after", table: "transactions");
        migrationBuilder.DropColumn(name: "partner_balance_before", table: "transactions");
        migrationBuilder.DropColumn(name: "payer_mode", table: "transactions");
        migrationBuilder.DropColumn(name: "total_amount", table: "transactions");
    }
}
```

### Startup Migration Logic

```csharp
using (var scope = app.Services.CreateScope())
{
    var env = scope.ServiceProvider.GetRequiredService<IHostEnvironment>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var dbContext = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

    if (env.IsDevelopment() || env.IsEnvironment("Staging"))
    {
        logger.LogInformation("{Environment} environment - applying migrations", env.EnvironmentName);
        dbContext.Database.Migrate();
        logger.LogInformation("Migrations applied successfully");
    }
    else
    {
        logger.LogInformation("{Environment} environment - skipping auto-migration", env.EnvironmentName);
    }
}
```

---

## Files to Modify

### New Files
1. `backend/src/Persistence/Migrations/20260215064000_AddUs03TransactionFields.cs`
2. `backend/src/Persistence/Migrations/20260215064000_AddUs03TransactionFields.Designer.cs`

### Modified Files
1. `backend/src/Persistence/Migrations/ApplicationDbContextModelSnapshot.cs`
   - Add 5 columns to Transaction entity definition
   
2. `backend/src/API/Program.cs`
   - Add startup auto-migration block after `var app = builder.Build();`

### Documentation
1. `docs/plan/US03_DB_Migration_AutoStart.md` (this file)
2. `docs/done/US03_DB_Migration_AutoStart.md` (completion report)

---

## Verification Checklist

### Before Implementation
- [ ] Review existing migrations for naming conventions
- [ ] Verify all 5 columns are nullable in entity model
- [ ] Confirm snake_case naming convention in project

### After Implementation
- [ ] Migration file contains only AddColumn operations (no destructive ops)
- [ ] ModelSnapshot updated with all 5 columns
- [ ] Program.cs has environment gate before Migrate() call
- [ ] Production path explicitly skips migration
- [ ] No manual SQL in any migration file
- [ ] All columns use correct PostgreSQL types (numeric/integer)

---

## Constraints & Guardrails

### Must Follow
- ✅ EF migrations only (no handwritten SQL scripts)
- ✅ All new columns nullable
- ✅ Dev/Staging auto-migrate enabled
- ✅ Production auto-migrate disabled
- ✅ Snake_case naming for DB columns

### Must NOT Do
- ❌ No `DROP COLUMN`, `ALTER COLUMN`, or table renames
- ❌ No default values that could misinterpret existing data
- ❌ No data seeding or backfilling in migration
- ❌ No raw SQL in migration files
- ❌ No migration in Production environment
- ❌ No changes to GlobalExceptionHandler (out of scope)

---

## Rollback Plan

If migration needs to be reverted:

```bash
dotnet ef database update ConvertToSnakeCaseAndRenameBalance \
  --project backend/src/Persistence \
  --startup-project backend/src/API
```

This will run the `Down()` method, dropping the 5 new columns.

**Note**: Downgrade will lose any data in these columns. In production, plan migration timing carefully.

---

## Out of Scope

The following are explicitly excluded from this plan:

- Exception handler improvements (separate concern)
- Data seeding or backfilling
- Index creation on new columns
- Production deployment automation
- Connection string validation enhancements
- Docker compose changes

---

## References

- `docs/main/SRS_v1.1.pdf` - US-03 requirements
- `RULES.md` - Project conventions and constraints
- `docs/done/US03_US04_QuickDeduct_Backend.md` - Prior implementation
- EF Core Migrations documentation

---

*Plan created by Atlas (Prometheus) on 2026-02-15*
