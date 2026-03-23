# Design System: MA6 Debt (Financial)

## 1. Pattern & Architecture
- **Type:** Data-Dense Dashboard
- **Structure:** Sidebar Navigation + Main Content Area
- **Interaction:** Fast updates, immediate feedback (Toast), minimal modal diving.

## 2. Global Style & Theme
- **Theme Name:** Professional Financial
- **Core Concept:** High Trust, High Clarity, Clean Contrast
- **Base Background:** Cream / Off-white (`#FFFBEB`)
- **Brand Colors:**
  - **Primary:** Note Yellow (`#FFD166` or Tailwind `amber-300`/`yellow-400` equivalent)
  - **Text Base:** Ink Black (`#0F172A` / `#1E293B`)
  - **Muted Text:** Pencil Gray (`#64748B` / `#475569`)
  - **Success / Receivable:** Green (`#10B981` / `#059669`)
  - **Danger / Payable:** Soft Red (`#FEF2F2` bg, `#DC2626` text)

## 3. Typography
- **Font Stack:** Modern Sans-Serif (Inter, System UI)
- **Use Case:** High readability for numbers and tabular data.
- **Line Heights:** 1.5 for body text, 1.2 for headings.

## 4. UI/UX Rules (Pro Max Guidelines)

### A. Accessibility & Contrast (CRITICAL)
- **Color Contrast:** All floating text and form labels must maintain > 4.5:1 contrast against their backgrounds. Avoid placing `text-gray-400` on white. Use strictly `text-gray-600` or `text-ink-black/70` for muted elements.
- **Focus States:** Every interactive element (Input, Button, Tab) must display a clear focus ring. *Standard:* `focus:ring-2 focus:ring-note-yellow/30`.

### B. Touch Targets & Sizing (CRITICAL)
- **Minimum Interactive Size:** Any clickable button or input field must be at least `44x44px` on mobile/tablet view.
- **Implementation:** Use `min-h-[44px]` on Inputs, Buttons, and TabsTriggers instead of the standard Tailwind `h-10` (40px).

### C. Interactions & Animation
- **Hover Feedback:** Buttons and interactive cards must provide immediate visual feedback via background or border color changes.
- **Transitions:** Use `transition-all duration-200 ease-in-out` uniformly across interactive elements to ensure state transitions don't feel "snappy" or broken.
- **Click States:** Apply active scaling `active:scale-[0.98]` on secondary buttons to give physical click feedback.

### D. Layout & Optical Alignment
- **Border Radius:** Outer containers (Modals, Cards) use larger radius (`rounded-xl` or `rounded-lg`). Inner elements (Inputs, Buttons) nested inside must mathematically use a slightly smaller radius (`rounded-md` or `rounded-lg` depending on padding) to appear visually parallel.
- **Spacing:** Avoid cramped forms. Use consistent `space-y-4` or `space-y-6` to separate form logical blocks.

## 5. Pre-Delivery Checklist
- [ ] No emojis used as icons (strictly SVG from Lucide/Heroicons).
- [ ] `cursor-pointer` applied automatically to all `<button>` and `<Link>` elements.
- [ ] No layout shifts during hover (don't use strict scaling without transition, avoid sudden border additions).
- [ ] All inputs are tested with keyboard navigation (`Tab` key).
