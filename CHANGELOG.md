# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2026-03-25
### Fixed
- Fixed legacy `ENV` syntax warnings in frontend Dockerfile by updating to modern `key=value` format

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
