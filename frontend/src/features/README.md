# Feature-Based Architecture

This project uses a feature-based directory structure to keep code organized and scalable.

## Directory Structure

### `src/features/`
Contains all business logic, broken down by domain feature.
- **Each feature folder** (e.g., `auth`, `wallet`) contains:
  - `components/`: UI components specific to this feature.
  - `hooks/`: React hooks specific to this feature.
  - `types/`: TypeScript definitions for this feature.
  - `api/`: (Optional) API calls specific to this feature.

### `src/components/`
Contains **shared** UI components used across multiple features (e.g., Button, Input, Modal).
- `ui/`: Design system components (often from Shadcn/UI).

### `src/hooks/`
Contains **shared** hooks used across the app (e.g., `useTheme`, `useDebounce`).

### `src/lib/`
Contains shared utility functions and libraries (e.g., `axios`, `cn`, `formatDate`).

### `src/types/`
Contains **shared** TypeScript definitions (e.g., `ApiResponse`, `UserRole`).

## Rules
1. **Feature Isolation**: Try to keep feature-specific code inside its feature folder.
2. **Shared Code**: If a component is used by *two or more* features, move it to `src/components`.
3. **Imports**: Use `@/features/wallet/...` to import from other features (if necessary).
