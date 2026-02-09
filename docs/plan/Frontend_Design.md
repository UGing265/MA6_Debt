# Frontend Design Plan: "Digital Paper Note"

## TL;DR

> **Style**: Note-taking, Hand-crafted, Friendly.
> **Key Colors**: Pale Yellow (Background), Charcoal/Brown (Text), Amber (Accent).
> **Vibe**: Digital adaptation of a physical debt notebook.
> 
> **Deliverables**:
> - Tailwind Config (Colors, Fonts).
> - Shadcn/UI Theme Customization.
> - Login & Register Pages implemented.

---

## 1. Design System

### Color Palette
| Role | Color Name | Hex Code | Tailwind Class | Usage |
|------|------------|----------|----------------|-------|
| **Background** | **Paper Cream** | `#FFFBEB` | `bg-amber-50` | Main app background, "Paper" texture |
| **Surface** | **Note Yellow** | `#FEF3C7` | `bg-amber-100` | Cards, Sticky notes |
| **Primary** | **Ink Black** | `#1F2937` | `text-gray-800` | Primary text (soft black) |
| **Secondary** | **Pencil Gray** | `#6B7280` | `text-gray-500` | Secondary text, placeholders |
| **Accent** | **Highlighter** | `#FCD34D` | `bg-amber-300` | Buttons, Active states |
| **Success** | **Money Green** | `#059669` | `text-emerald-600` | Income, Positive balance |
| **Error** | **Debt Red** | `#DC2626` | `text-red-600` | Expense, Negative balance, Errors |

### Typography
- **Heading Font**: `Patrick Hand` (Google Font) - Handwritten feel for titles.
- **Body Font**: `Quicksand` (Google Font) - Rounded, legible sans-serif for numbers and UI text.

### Component Style (The "Note" Look)
- **Border**: Thin, subtle gray borders (`border-gray-200`).
- **Shadows**: Soft, diffused shadows (`shadow-md`).
- **Radius**: Slightly rounded corners (`rounded-md` or `rounded-lg`).
- **Inputs**: Underlined style (like writing on ruled paper) or simple white boxes.

---

## 2. Implementation Tasks

- [ ] **1. Setup Tailwind & Fonts**
    - Install `next/font` for Patrick Hand and Quicksand.
    - Update `tailwind.config.ts` with custom colors and font families.
    - Set global body background to `Paper Cream`.

- [ ] **2. Setup Shadcn/UI**
    - Initialize shadcn (`npx shadcn@latest init` - use defaults but stick to css variables).
    - Configure `components.json` to use CSS variables.
    - Install core components: `button`, `input`, `label`, `card`, `form`, `sonner` (Toast).
    - **Customize**: Override styles in `globals.css` or `tailwind.config.ts` to match the Note theme.

- [ ] **3. Implement Auth Layout**
    - Create `(auth)/layout.tsx`: A centered container with a subtle "paper texture" or solid cream background.

- [ ] **4. Build Login Page**
    - **UI**: A "Sticky Note" card centered.
    - **Fields**: Username, Password.
    - **Action**: "Open My Notebook" (Login button).
    - **Integration**: Call `POST /api/auth/login`.
    - **Error Handling**: Show toast on 401.

- [ ] **5. Build Register Page**
    - **UI**: Similar to Login.
    - **Fields**: Username, Name, Email (optional), Password.
    - **Action**: "Create New Notebook" (Register button).
    - **Integration**: Call `POST /api/auth/register`.
    - **Redirect**: To Login upon success.

---

## 4. Documentation & Architecture Rules

### Feature-Based Architecture
- All feature-specific code MUST go into `src/features/{feature-name}`.
- **Auth Feature**: `src/features/auth`
    - `components/`: Login/Register Forms, Auth Cards.
    - `api/`: API calls (Login, Register).
    - `types/`: Zod schemas, DTO interfaces.
- **Shared UI**: `src/components/ui` (Shadcn components).

### Documentation Protocol
- **Before Work**: Ensure this plan exists at `docs/plan/Frontend_Design.md`.
- **After Work**: Create `docs/done/Frontend_Design.md` summarizing changes (Tailwind config, Components added, Pages created).

---

## 2. Implementation Tasks

- [ ] **0. Plan Sync**
    - Copy this plan to `docs/plan/Frontend_Design.md`.

- [ ] **1. Setup Tailwind & Fonts**
    - Install `next/font` for Patrick Hand and Quicksand.
    - Update `tailwind.config.ts` with custom colors and font families.
    - Set global body background to `Paper Cream`.

- [ ] **2. Setup Shadcn/UI**
    - Initialize shadcn (`npx shadcn@latest init`).
    - Configure `components.json` to use CSS variables.
    - Install core components: `button`, `input`, `label`, `card`, `form`, `toast`.
    - **Customize**: Override styles in `globals.css` or `tailwind.config.ts` to match the Note theme.

- [ ] **3. Implement Auth Feature (Feature-Based)**
    - **Location**: `src/features/auth`.
    - Create `LoginForm.tsx` and `RegisterForm.tsx` in `components/`.
    - Create `auth.ts` in `api/` for fetch calls.
    - Create Zod schemas in `types/`.

- [ ] **4. Build Pages**
    - **Login Page**: `src/app/(auth)/login/page.tsx` -> Uses `LoginForm`.
    - **Register Page**: `src/app/(auth)/register/page.tsx` -> Uses `RegisterForm`.
    - **Layout**: `src/app/(auth)/layout.tsx` -> Centered "Paper" container.

- [ ] **5. Documentation**
    - Create `docs/done/Frontend_Design.md`.
