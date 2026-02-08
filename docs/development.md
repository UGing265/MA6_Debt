---
title: Development Setup
description: "How to set up MA6_Debt locally"
---

## Prerequisites

- .NET 9 SDK
- Node.js 20+
- PostgreSQL 16+
- Docker (Optional)

## Backend Setup

1. Navigate to `backend/`
2. Update `appsettings.json` with your PostgreSQL credentials.
3. Run migrations:
   ```bash
   dotnet ef database update -s src/API -p src/Persistence
   ```
4. Start the API:
   ```bash
   dotnet run --project src/API
   ```

## Frontend Setup

1. Navigate to `frontend/`
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the dev server:
   ```bash
   pnpm dev
   ```
