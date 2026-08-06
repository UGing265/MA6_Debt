# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-08-07

### Added
- Added English and Vietnamese language support across authentication, landing, dashboard, wallet, debt partner, money movement, and transaction history flows.
- Added password visibility toggles to authentication forms so users can review hidden password input before submitting.
- Added privacy controls for financial amounts, including a setting-driven amount hiding mode and a dashboard quick reveal control.
- Added richer dashboard spending analytics with daily spending visibility and chart-based views for clearer daily expense tracking.
- Added daily spending goal support so users can compare spending against a daily target.
- Added mobile bottom navigation with direct access to key dashboard, wallet, quick deduct, partner, history, transfer, help, and profile flows.
- Added refreshed MA6 logo and app icons for the browser, favicon, and dashboard shell.

### Changed
- Redesigned the dashboard shell with sidebar navigation, mobile bottom sheet navigation, profile greeting, and privacy-aware content rendering.
- Improved form styling across authentication, debt partner, repayment, transaction, transfer, wallet, and history flows for a cleaner financial notebook look.
- Improved Quick Deduct selectors and inputs with searchable wallet/partner controls, clearer active states, and stronger amount-entry guidance.
- Improved transaction history filtering, row layout, detail dialogs, and debt display for faster scanning on desktop and mobile.
- Removed hard-coded partner assumptions so partner-related flows use the selected/default partner state instead of fixed values.
- Updated canonical frontend and backend design-system documentation to guide future implementation work.

### Fixed
- Fixed idle expired-session behavior so dashboard sessions are redirected to login after the shared authenticated profile check can no longer renew the session.
- Fixed mobile navigation gaps where several important functions were difficult to reach from small screens.
- Fixed logo sizing/cropping issues so the MA6 avatar displays consistently.

### Security
- Moved browser authentication flow to cookie-based session handling instead of relying on browser storage for auth state.
- Added refresh-token based session renewal so authenticated API requests can recover from access-token expiry when the refresh session is still valid.
- Added logout/session expiry behavior for refresh sessions configured to expire after 7 days.
- Added automatic login redirect when dashboard auth checks detect an expired or invalid session.

## [1.0.2] - 2026-03-25

### Added
- Implemented Docker healthchecks for database and backend services to ensure reliable startup orchestration
- Added resource limits (RAM) and log rotation to all Docker containers for system stability
- Introduced environment variable synchronization in `.env` using variable expansion (e.g., `NEXT_PUBLIC_API_URL` follows `BACKEND_PORT`)
- Added comprehensive theoretical documentation on Docker architecture (IN/OUT Ports) in `docs/done/deploy-docker.md`

### Changed
- Refactored `docker-compose.yml` to use flexible port mappings and hardened security (localhost binding)
- Updated deployment guide with an integrated merged style (preserving original work with new theory)
- Synchronized `.env.example` with the new flexible configuration logic

## [1.0.1] - 2026-03-25

### Changed
- Refactored backend Dockerfile: cleaned up `WORKDIR` paths and added configuration handling documentation
- Enhanced frontend Dockerfile to support build-time `ARG` for `NEXT_PUBLIC_API_URL`, ensuring correct environment variable baking in Next.js
- Updated `docker-compose.yml` to support dynamic environment variables for API URL and pgAdmin credentials

### Fixed
- Fixed legacy `ENV` syntax warnings in frontend and backend Dockerfiles by updating to modern `key=value` format

## [1.0.0] - 2026-03-24
### Added
- Cloudflare tunnel support for secure external access
- Mobile-first responsive UI design
- Docker infrastructure including Dockerfiles, docker-compose, and pgAdmin integration
- Comprehensive documentation for deployment and API specifications
- User guide page and navigation link
- Design system rules
- PageHeader and accordion shadcn UI components

### Changed
- Secured docker-compose sensitive data utilizing environment variables
- Centralized secure flag configuration in `.env.example`
- Standardized PageHeader implementation and aligned dashboard layout
- Updated tabs UI and hybrid balance input constraints

## [0.9.0] - 2026-03-02
### Added
- User profile management including profile retrieval, update, and password change functionalities
- Monthly statistics feature to the wallet dashboard
- Note field to adjustment and transfer forms, making it optional
- PartnerRepaymentDialog component for managing debt repayments
- API specifications to documentation structure
- Initial documentation and assets for MA6_Debt project

### Changed
- Refactored API calls to use a centralized apiFetch
- Updated transaction detail UI for repayment status
- Enhanced history filtering, presentation, and repayment tagging

### Fixed
- Fixed wallet balance logic in QuickDeduct
- Simplified error handling in monthly stats retrieval

## [0.8.0] - 2026-03-01
### Added
- QuickDeduct functionality with PartnerTra mode support
- Payer mode tags to history display
- Debt management functionality and layout updates to transaction details

### Changed
- Refactored API calls to use centralized apiFetch with enhanced numeric input handling
- Enhanced overall transaction layout and history display

## [0.7.0] - 2026-02-26
### Added
- Optional partner ID support for debt tracking and transaction history updates
- Debt management functionality to the transaction detail page
- History transaction page with partner filtering functionality

### Changed
- Clarified comments in QuickDeductCommandHandler for partner payment logic
- Enhanced transaction retrieval process with optional partner filtering

## [0.6.0] - 2026-02-24
### Added
- Transaction history pagination with enhanced query handling
- Sorting functionality to transaction history
- Transfer page localized titles, wallet grouping, and descriptions

### Changed
- Refactored wallet loading logic for improved readability and performance
- Updated TransferForm for improved user experience and validation
- Removed wallet parent sharing validation from the transfer process

## [0.5.0] - 2026-02-23
### Added
- Quick Deduct page with a tabbed interface and enhanced forms
- Cash Adjustment features and related frontend history implementation
- Transfer wallet functionality with form validation and API integration
- History feature with API integration, filters, and UI components

### Changed
- Enhanced transaction details with wallet and transfer information
- Removed unnecessary max-width constraints on loading and error states

## [0.4.0] - 2026-02-22
### Added
- Internal wallet transfer functionality with validation and audit trail
- Tabbed interface for HybridBalanceInput supporting guided and direct modes
- Debt partner data integration into the wallet dashboard
- Default wallet functionality and indication in wallet details

### Changed
- Unified partner wallet UI and enhanced money input formatting/handling
- Adjusted padding in empty state cards for UI consistency
- Improved event handling and UI for child wallet actions

## [0.3.0] - 2026-02-20
### Added
- Full transaction update functionality with new request DTOs and endpoints
- Search and locking features for transaction history
- Screenshot parity wave for Parent Wallet Focused Dashboard
- Workspace Wallet Modal Navbar Sync
- Debt notification features (US-04) and Quick Deduct (US-03) flows

### Changed
- Enhanced API documentation and response type consistency
- Refactored cash adjustment flows with updated validation rules
- Improved dashboard routing, layout links, and wallet interactions
- Removed legacy UpdateTransactionNote feature and related components

### Fixed
- Fixed `dbContext` retrieval to use `ApplicationDbContext` consistently

## [0.2.0] - 2026-02-14
### Added
- Professional dark theme pre-login landing page
- Trust Logos and Testimonials sections on the homepage
- Wallet management CRUD operations (Create, Update, Delete)
- Debt Partner management CRUD with soft delete capabilities
- Workflow UI components for expense tracking and management

### Changed
- Refactored database entity property casing to snake_case for PostgreSQL
- Replaced InitialBalance with Balance in DebtPartner models
- Refactored RegisterPage and RegisterForm styles for consistency
- Updated typography, background colors, and theme UI consistency across homepage

## [0.1.0] - 2026-02-09
_Initial release_
### Added
- User registration and login system with JWT authentication and password hashing
- OpenAPI integration with Scalar UI for enhanced API documentation
- Global exception handling for validation and unauthorized access
- Initial database schema modeling Setup (User, Wallet, DebtPartner, Transaction, Transfer)
- Base UI design system and global Next.js application layouts

### Changed
- Configured CORS policies for frontend connectivity
- Removed legacy DbInitializer and database seeding logic
- Hardened authentication flow uniqueness checks and token generation

### Fixed
- Fixed TOCTOU race condition on uniqueness checks
- Avoided storing JWT in localStorage to prevent XSS vulnerabilities
- Fixed unreachable return false error
- Corrected JWT key validation to use UTF8 instead of ASCII encoding
