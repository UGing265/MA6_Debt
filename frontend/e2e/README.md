# E2E Smoke Tests

## Setup

To install dependencies and Playwright browsers:

```bash
pnpm install
pnpm exec playwright install chromium
```

## Running Tests

```bash
pnpm test:e2e          # Run tests headless
pnpm test:e2e:ui       # Run with Playwright UI
```

## Requirements

- Node.js must be installed in the environment
- Development server must be available on port 3000 (started automatically by Playwright)

## Current Tests

- **homepage.spec.ts**: Smoke tests for homepage render and CTA navigation
