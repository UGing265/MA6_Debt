# MA6 Debt - Personal Debt & Wallet Management

A full-stack personal finance application for managing wallets, tracking debts with partners, and monitoring expenses.

[![Var branch main](https://github.com/UGing265/MA6_Debt/actions/workflows/var-branch.yml/badge.svg?branch=dev)](https://github.com/UGing265/MA6_Debt/actions/workflows/var-branch.yml)
---

## Introduction

MA6 Debt is a comprehensive personal finance management application that helps you:

- Manage multiple wallets with parent-child hierarchy
- Track debts with partners (who owes whom)
- Record transactions with debt tagging
- View monthly expense statistics
- Transfer money between wallets
- Monitor financial dashboard with charts

---

## Tech Stack

### Backend
- **.NET 9** - Web API framework
- **Entity Framework Core** - ORM for PostgreSQL
- **MediatR** - CQRS pattern implementation
- **FluentValidation** - Input validation
- **BCrypt** - Password hashing
- **JWT Bearer** - Authentication
- **Scalar** - API documentation (Swagger alternative)
- **PostgreSQL** - Database

### Frontend
- **Next.js 16** - React framework (App Router)
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Recharts** - Charts library
- **Lucide React** - Icons
- **Sonner** - Toast notifications

---

## Project Structure

```
MA6_Debt/
├── backend/
│   └── src/
│       ├── API/              # Controllers, Middleware
│       ├── Application/      # CQRS Commands, Queries, Handlers
│       ├── Domain/           # Entities
│       └── Persistence/      # DbContext, Migrations
│
├── frontend/
│   └── src/
│       ├── app/              # Next.js App Router pages
│       ├── features/         # Feature-based modules
│       │   ├── auth/         # Authentication
│       │   ├── wallet/       # Wallet management
│       │   ├── debt/         # Debt partners
│       │   ├── transaction/  # Transactions
│       │   ├── history/      # Transaction history
│       │   ├── transfer/     # Wallet transfers
│       │   └── user/         # User profile
│       ├── components/       # Shared UI components
│       └── lib/              # Utilities
│
└── docs/                     # Documentation
```

---

## How to Run

### Prerequisites
- .NET 9 SDK
- Node.js 18+
- PostgreSQL database
- pnpm (recommended)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Configure connection string in `src/API/appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost; Port=5432; Database=ma6_debt_db; Username=your_name; Password=your_password"
  },
  "Jwt": {
    "Secret": "YourSecretKeyLongerThan32Characters!",
    "Issuer": "MA6Debt",
    "Audience": "MyUsers",
    "ExpirationMinutes": 60
  }
}
```

3. Run migrations and start:
```bash
dotnet ef database update --project src/Persistence --startup-project src/API
dotnet run --project src/API
```

Backend runs at: `https://localhost:7297`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment in `.env.local`:
```
NEXT_PUBLIC_API_URL=https://localhost:7297
```

4. Start development server:
```bash
pnpm dev
```

Frontend runs at: `http://localhost:3000`

---

## Features & Flows

### 1. Authentication
- Register with username, email, password
- Login with JWT token
- Auto-redirect to dashboard

### 2. Wallet Management
- Create parent wallets (e.g., "Cash", "Bank")
- Create child wallets (e.g., "Bank -> Savings")
- Set default wallet (star icon)
- View wallet hierarchy with total balance

### 3. Debt Partners
- Add partners (people you share expenses with)
- Track who owes whom
- Record repayments
- Set default partner

### 4. Quick Deduct (Main Transaction Flow)
- Record expenses with optional debt tagging
- **Toi Tra (I Pay)**: You pay the bill, partner owes you
- **Partner Tra (Partner Pays)**: Partner pays, you owe them
- Debt amount is tracked automatically
- Notifications show updated debt balance

### 5. Transaction History
- View all transactions with filters
- Filter by wallet, partner, tag
- Tags: Salary, Bill, Repay, Consume
- Edit/Delete transactions
- View detailed debt info per transaction

### 6. Wallet Transfers
- Transfer money between child wallets
- Track transfer history
- Parent wallet shows aggregated balance

### 7. Dashboard
- Net worth calculation (Cash + Receivable - Payable)
- Monthly expense bar chart
- Recent transactions
- Wallet overview

### 8. Profile Management
- Edit username and email
- Change password with verification

---

## API Endpoints

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### Wallets
- `GET /api/wallets` - List wallets
- `POST /api/wallets` - Create wallet
- `PUT /api/wallets/{id}` - Update wallet
- `DELETE /api/wallets/{id}` - Delete wallet

### Debt Partners
- `GET /api/debt-partners` - List partners
- `POST /api/debt-partners` - Create partner
- `PUT /api/debt-partners/{id}` - Update partner
- `DELETE /api/debt-partners/{id}` - Delete partner

### Transactions
- `GET /api/transactions` - List transactions (paginated)
- `GET /api/transactions/{id}` - Get transaction detail
- `POST /api/transactions/quick-deduct` - Quick deduct
- `POST /api/transactions/adjustment` - Cash adjustment
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction
- `GET /api/transactions/monthly-stats` - Monthly statistics

### Transfers
- `POST /api/transfers` - Create transfer
- `GET /api/transfers` - List transfers

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password
- `GET /api/users/preferences` - Get preferences
- `PUT /api/users/default-wallet` - Set default wallet
- `PUT /api/users/default-partner` - Set default partner

---

## Author

**Made by Thai Shiroru**

---

## Contributors

<!-- contributors:start -->
<table>
<tr><td align="center" width="120"><a href="https://github.com/UGing265"><img src="https://avatars.githubusercontent.com/u/110150477?v=4&amp;s=100" width="72" height="72" alt="UGing265" /><br /><sub><b>UGing265</b></sub></a></td></tr>
</table>
<!-- contributors:end -->

---

## License

MIT License

