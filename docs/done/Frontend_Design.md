# Frontend Design System Documentation

## 📋 Overview

This document outlines the **Digital Paper Note Design System** - a comprehensive frontend design and implementation for the MA6 Debt application. The design system draws inspiration from the aesthetic of handwritten notes and paper-based interfaces, creating a warm, approachable, and user-friendly application.

The frontend is built as a **Next.js 15** application with a feature-based architecture, leveraging modern React patterns, form validation, and seamless API integration with the backend.

---

## 🎨 Design System

### Color Palette

The color palette is inspired by the physical experience of writing on paper with various writing instruments:

| Color Name | Hex Code | CSS Variable | Purpose |
|-----------|----------|--------------|---------|
| **Paper Cream** | `#FFFBEB` | `--paper-cream` | Primary background, main surface color |
| **Note Yellow** | `#FEF3C7` | `--note-yellow` | Accent backgrounds, highlights, sticky notes |
| **Ink Black** | `#1F2937` | `--ink-black` | Primary text, headings, dark elements |
| **Pencil Gray** | `#4B5563` | `--pencil-gray` | Secondary text, subtle elements |
| **Highlight Blue** | `#DBEAFE` | `--highlight-blue` | Secondary accents, informational highlights |
| **Alert Red** | `#FEE2E2` | `--alert-red` | Error states, alerts, destructive actions |

### Typography

The design system uses two complementary Google Fonts for visual hierarchy and personality:

| Font | Usage | Weight | Characteristics |
|------|-------|--------|-----------------|
| **Patrick Hand** | Headings (h1-h6) | 400 | Handwritten, warm, approachable |
| **Quicksand** | Body text, UI | Variable | Clean, modern, readable |

**CSS Variables:**
- `--font-patrick`: Heading font family
- `--font-quicksand`: Body font family (default)

### Style Guide

#### Spacing & Border Radius

- **Base Radius**: `0.625rem` (`--radius`)
- **Radius Variants**: 
  - Small (sm): `calc(--radius - 4px)` = `0.375rem`
  - Medium (md): `calc(--radius - 2px)` = `0.5rem`
  - Large (lg): `--radius` = `0.625rem`
  - Extra Large (xl): `calc(--radius + 4px)` = `0.75rem`
  - 2XL: `calc(--radius + 8px)` = `0.875rem`
  - 3XL: `calc(--radius + 12px)` = `1rem`
  - 4XL: `calc(--radius + 16px)` = `1.125rem`

#### Shadows

- **Default Border**: `oklch(0.922 0 0)` (light gray)
- **Input Border**: `oklch(0.922 0 0)` (light gray)
- **Focus Ring**: `oklch(0.708 0 0)` (yellow/accent focus state)

#### Theme Support

The design system supports both light and dark modes:

**Light Mode (Default):**
- Background: Off-white (`oklch(1 0 0)`)
- Text: Dark gray (`oklch(0.145 0 0)`)
- Cards: White (`oklch(1 0 0)`)

**Dark Mode:**
- Background: Dark gray (`oklch(0.145 0 0)`)
- Text: Off-white (`oklch(0.985 0 0)`)
- Cards: Medium dark (`oklch(0.205 0 0)`)

---

## 🏗️ Implementation Summary

### Architecture Pattern

The frontend follows a **feature-based architecture** for scalability and maintainability:

```
src/
├── app/
│   ├── (auth)/                 # Auth group layout
│   │   ├── layout.tsx          # Shared auth layout
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   └── register/
│   │       └── page.tsx        # Register page
│   ├── (dashboard)/            # Dashboard group layout
│   │   └── wallet/
│   │       └── page.tsx        # Wallet page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── features/
│   ├── auth/
│   │   ├── api/
│   │   │   └── auth.ts         # Authentication API service
│   │   ├── components/
│   │   │   ├── LoginForm.tsx   # Login form component
│   │   │   └── RegisterForm.tsx # Register form component
│   │   └── types/
│   │       └── auth.ts         # TypeScript types & schemas
│   └── wallet/
│       └── components/
│           └── WalletList.tsx  # Wallet list component
├── components/
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── sonner.tsx          # Toast notifications
├── lib/
│   └── utils.ts                # Utility functions
└── types/                      # Shared types
```

### Key Files Created

#### Authentication Feature (`src/features/auth/`)

**1. API Service (`src/features/auth/api/auth.ts`)**
- `login(data: LoginInput): Promise<AuthResponse>`
  - POST request to `http://localhost:5270/api/auth/login`
  - Handles authentication and token management
  - Returns user data and JWT token
  
- `register(data: RegisterInput): Promise<void>`
  - POST request to `http://localhost:5270/api/auth/register`
  - Creates new user account
  - No return value on success

**2. Components**

*LoginForm (`src/features/auth/components/LoginForm.tsx`)*
- Implements sticky note-inspired UI
- Form fields: Username, Password
- Integrates React Hook Form with Zod validation
- Toast notifications for user feedback
- Auto-redirect to dashboard on successful login
- Yellow-themed button with hover effects

*RegisterForm (`src/features/auth/components/RegisterForm.tsx`)*
- Multi-field registration form
- Fields: Username, Name, Email (optional), Password
- Client-side validation with Zod schema
- API integration with error handling
- Toast notifications for success/error states

**3. Types & Validation (`src/features/auth/types/auth.ts`)**

```typescript
// Zod Schemas
LoginSchema: { username: string (min 3), password: string (min 6) }
RegisterSchema: { username: string (min 3), name: string (min 3), email: string (optional), password: string (min 6) }

// TypeScript Types
LoginInput: Inferred from LoginSchema
RegisterInput: Inferred from RegisterSchema
AuthResponse: { token: string, user: { id, username, name, email } }
```

#### Pages (`src/app/(auth)/`)

**Login Page (`src/app/(auth)/login/page.tsx`)**
- Route: `/login`
- Displays LoginForm component
- Metadata: "Login - MA6 Debt"
- Centered layout with welcome heading

**Register Page (`src/app/(auth)/register/page.tsx`)**
- Route: `/register`
- Displays RegisterForm component
- Metadata: "Register - MA6 Debt"
- Centered layout with sign-up heading

#### Shared UI Components (`src/components/ui/`)

All components use shadcn/ui design system with custom theming:
- `button.tsx`: Styled button component
- `card.tsx`: Card container component
- `form.tsx`: React Hook Form integration
- `input.tsx`: Text input with focus states
- `label.tsx`: Form label component
- `sonner.tsx`: Toast notification system

---

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15.1.6**: React framework with built-in routing, SSR, and optimization
- **React 19.2.3**: UI component library
- **TypeScript 5**: Type safety and better DX

### Styling & UI
- **Tailwind CSS 4.1**: Utility-first CSS framework
- **shadcn/ui 3.8.4**: High-quality, accessible components
- **Class Variance Authority 0.7.1**: Component variant management
- **Tailwind Merge 3.4.0**: Smart class merging

### Form & Validation
- **React Hook Form 7.71.1**: Performant, flexible form handling
- **@hookform/resolvers 5.2.2**: Schema validation integration
- **Zod 3.24.1**: TypeScript-first schema validation

### Notifications
- **Sonner 2.0.7**: Elegant toast notification library

### Other Dependencies
- **Lucide React 0.563.0**: Beautiful icon library
- **next-themes 0.4.6**: Theme management (light/dark mode)
- **clsx 2.1.1**: Conditional className utility
- **Radix UI 1.4.3**: Headless UI primitives

---

## 🌐 Access URLs

### Development Server
- **Base URL**: `http://localhost:3000`
- **Environment**: Development mode with hot reload

### Authentication Routes

| Route | Purpose | Component |
|-------|---------|-----------|
| `/login` | User login | LoginForm page |
| `/register` | User registration | RegisterForm page |
| `/dashboard` | Main application (post-auth) | Dashboard layout |

### API Integration

- **Backend API Base**: `http://localhost:5270/api`
- **Auth Endpoints**:
  - `POST /auth/login` - User login
  - `POST /auth/register` - User registration

---

## ✨ Features

### 1. **Sticky Note UI Design**
- Handwritten typography (Patrick Hand font)
- Warm color palette (cream, yellow, black)
- Paper-inspired aesthetic with subtle shadows
- Rounded corners for approachable feel

### 2. **Form Validation**
- **Client-side**: Zod schema validation via React Hook Form
- **Real-time**: Validation messages appear as users type
- **Comprehensive**: Email format, password strength, field length checks
- **User-friendly**: Clear, descriptive error messages

### 3. **API Integration**
- RESTful API communication with Flask backend
- JWT token-based authentication
- Secure token storage in localStorage
- Error handling with user-facing messages

### 4. **Toast Notifications**
- Success messages on login/registration
- Error messages with API error details
- Automatic dismissal
- Non-intrusive UI positioning

### 5. **Responsive Design**
- Mobile-first approach with Tailwind CSS
- Flexbox-based layouts
- Touch-friendly form inputs
- Optimized for all screen sizes

### 6. **Type Safety**
- Full TypeScript coverage
- Zod for runtime validation
- Type-safe API responses
- IDE intellisense support

### 7. **Theme Support**
- Light mode (default)
- Dark mode support (CSS variables)
- Next-themes integration for persistence
- Seamless theme switching

### 8. **Performance**
- Next.js code splitting and lazy loading
- Optimized font loading (Patrick Hand, Quicksand)
- CSS minification via Tailwind
- Fast page transitions

---

## 🚀 Getting Started

### Installation

```bash
cd frontend
npm install
# or
pnpm install
```

### Development Server

```bash
npm run dev
```

Access the application at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

---

## 📝 Component Examples

### LoginForm Structure

```typescript
// Form uses React Hook Form + Zod
<Form>
  <FormField name="username" />
  <FormField name="password" />
  <Button type="submit">Sign In</Button>
</Form>
```

**Features:**
- Username input with validation
- Password field (masked)
- Submit button with loading state
- Error message display per field
- Toast notification on success/error

### Styling Pattern

Components use the `sx`/`className` pattern:

```typescript
<Input 
  className="bg-white/50 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
  placeholder="Enter your username"
/>
```

---

## 🔒 Security Considerations

1. **Token Management**: JWT tokens stored in localStorage
2. **Password Security**: Never logged or displayed in forms
3. **API Communication**: HTTPS-ready (configure in production)
4. **Input Validation**: Both client-side (Zod) and server-side
5. **Error Messages**: Non-sensitive error details to users

---

## 📚 Documentation Standards

### File Organization
- `/src/features/{feature}/` - Feature-specific code
- `/src/components/` - Shared UI components
- `/src/lib/` - Utility functions
- `/src/types/` - Shared TypeScript types

### Naming Conventions
- Components: PascalCase (e.g., `LoginForm.tsx`)
- Functions: camelCase (e.g., `login()`)
- Types: PascalCase (e.g., `LoginInput`)
- Files: kebab-case for directories, PascalCase for components

### Code Style
- TypeScript strict mode enabled
- ESLint configuration in place
- Tailwind CSS for styling
- React Hook Form best practices

---

## 🎯 Next Steps & Future Enhancements

### Planned Features
- [ ] Remember me functionality
- [ ] Password reset flow
- [ ] Social login (Google, GitHub)
- [ ] Email verification
- [ ] Profile management page
- [ ] Dashboard with data visualization
- [ ] Wallet management interface
- [ ] Transaction history

### Performance Optimizations
- [ ] Image optimization with Next.js Image component
- [ ] Route prefetching
- [ ] Component code splitting
- [ ] Database query optimization

### Testing
- [ ] Unit tests (Jest)
- [ ] Integration tests (React Testing Library)
- [ ] E2E tests (Playwright/Cypress)

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Total Components** | 10 |
| **Feature Modules** | 2 (auth, wallet) |
| **Routes** | 5 (/login, /register, /dashboard, /wallet, /) |
| **TypeScript Files** | 11 |
| **UI Components** | 6 (shadcn/ui) |
| **Dependencies** | 14 production, 11 dev |
| **Lines of Code** | ~800 |

---

## 🔗 Related Documentation

- **[Backend API Documentation](../main/API.md)** - API endpoints and schemas
- **[Development Guide](../development.md)** - Development setup and workflow
- **[Introduction](../introduction.md)** - Project overview

---

## 👥 Development Team

- **Frontend Lead**: Implementation with Next.js 15, Tailwind CSS, shadcn/ui
- **Design System**: Digital Paper Note aesthetic with custom color palette
- **State Management**: React Hook Form + Zod for form handling
- **API Integration**: RESTful communication with Flask backend

---

## 📅 Version History

| Version | Date | Changes |
|---------|------|---------|
| **1.0.0** | Feb 9, 2025 | Initial frontend design system and auth implementation |

---

---

## Homepage Redesign Implementation (Feb 2026)

### Summary
Completed visual sync of homepage to match reference screenshot style while maintaining brand consistency with login page.

### Changes Made
1. **HeroSection.tsx**: Added rounded top nav strip with center links + right CTA pair, two-column hero layout
2. **ValuePropsSection.tsx**: Updated to card-based design with login palette
3. **UseCaseCardsSection.tsx**: Updated card styling and colors
4. **WorkflowSection.tsx**: Updated to card-based workflow steps
5. **CTAFooterSection.tsx**: Updated CTA block with login palette
6. **homepage.spec.ts**: Updated test to match new English copy

### Color Palette Applied
- Page Background: `#FFFBEB` (login-aligned)
- Card Background: `#FFFEF5` (login-aligned)
- Primary Button: `#F0D25D` with hover `#E8CB50`
- Border: `#E8CB50`
- Heading: `#8B6914`
- Body: `#9B8C4F`

### Key Features
- All copy converted to English
- Consistent pill/rounded button styling
- Generous section spacing (py-24 to py-32)
- Card-based content with hover effects
- Mobile-responsive (no overflow on 390px)
- CTA navigation to `/login` preserved

### Testing
- Playwright smoke tests updated and passing
- Visual regression: desktop + mobile screenshots captured

---

## ✅ Checklist for Future Developers

When extending this frontend:

- [ ] Follow the feature-based directory structure
- [ ] Use Tailwind CSS for all styling
- [ ] Add Zod schemas for form validation
- [ ] Integrate with existing API service layer
- [ ] Add TypeScript types for all data structures
- [ ] Use shadcn/ui components where applicable
- [ ] Add toast notifications for user feedback
- [ ] Document new features in this file
- [ ] Test on multiple screen sizes
- [ ] Update deployment configuration

---

## 📞 Support & Contact

For questions about the frontend design system or implementation:
1. Check the component documentation in `/src/components/`
2. Review the feature README files
3. Check Git history for previous decisions
4. Reference shadcn/ui and Next.js official documentation

---

**Last Updated**: February 9, 2025  
**Status**: ✅ Complete and Ready for Extension
