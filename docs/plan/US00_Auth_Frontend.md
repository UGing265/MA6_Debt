# Frontend Error Handling & UI Enhancement Plan

## TL;DR

> **Quick Summary**: Improve frontend error messaging to show specific validation errors (duplicate username, weak password, etc.) from backend 400 responses, and enhance UI/UX with deeper yellow (#F5D066 - 5% darker), better visual hierarchy, form animations, and refined note-taking style.
>
> **Deliverables**:
> - Enhanced error handling that parses and displays field-specific errors from backend
> - Redesigned Login/Register forms with improved visual hierarchy and animations
> - Updated color palette (deeper yellow) while maintaining note-taking aesthetic
> - Better form UX with loading states, disabled buttons, and visual feedback
> - Polished layout with spacing, shadows, and handwritten typography
>
> **Estimated Effort**: Short (2-3 hours)
> **Parallel Execution**: YES - Both forms can be updated independently, then unified
> **Critical Path**: API error response structure → Error parsing utility → Form components → Styling & animations

---

## Context

### Original Issue
1. **Frontend Error Handling Too Basic**: When register fails with 400, user sees generic "Registration failed" without knowing which field is wrong
2. **UI/UX Too Simple**: Design lacks polish, hierarchy, and visual sophistication while maintaining note-taking style

### Current State
- Login/Register forms use basic shadcn/UI components
- Error handling: `throw new Error(errorData.message || "Registration failed")`
- Color: `#FEF3C7` (pale yellow) - too light
- No form animations or loading states
- Minimal visual hierarchy

### User Preference
- Keep note-taking style and handwritten aesthetic
- Yellow color: 5% darker (approximately `#F5D066`)
- Enhance visual sophistication without losing simplicity

---

## Work Objectives

### Core Objective
Provide users with clear, specific error messages for each validation failure, and enhance visual design with deeper yellow, better hierarchy, animations, and refined typography while maintaining the digital paper note aesthetic.

### Concrete Deliverables
1. **`frontend/src/features/auth/utils/errorParser.ts`** - Error response parsing utility
2. **`frontend/src/features/auth/components/LoginForm.tsx`** (enhanced) - Better error display, loading state, animations
3. **`frontend/src/features/auth/components/RegisterForm.tsx`** (enhanced) - Better error display, loading state, animations
4. **`frontend/src/app/globals.css`** (updated) - Deeper yellow color, animations, enhanced spacing
5. **`frontend/src/app/(auth)/layout.tsx`** (updated) - Improved visual hierarchy and spacing
6. **`frontend/src/app/(auth)/login/page.tsx`** (enhanced) - Link to register, visual polish
7. **`frontend/src/app/(auth)/register/page.tsx`** (enhanced) - Link to login, visual polish

### Definition of Done
- [ ] Backend 400 errors show specific field errors (e.g., "Username already exists", "Password too weak")
- [ ] Forms have loading states and disabled buttons during submission
- [ ] Input fields have focus states and visual feedback
- [ ] Color palette updated to `#F5D066` (deeper yellow)
- [ ] Forms have smooth animations on load and error display
- [ ] Form validation errors appear below fields with clear messaging
- [ ] Register form shows password requirements dynamically
- [ ] Navigation links between login/register pages functional
- [ ] All error scenarios tested (empty fields, duplicate username, weak password, invalid credentials)

### Must Have
- Specific error messages for each validation failure
- Loading state during form submission (button disabled, spinner)
- Visual feedback on inputs (focus rings, border colors)
- Deeper yellow color (#F5D066 or similar) replacing #FEF3C7
- Smooth animations and transitions
- Consistent spacing and typography using Patrick Hand + Quicksand
- Register form shows requirements for password

### Must NOT Have (Guardrails)
- Generic error messages ("Registration failed" without details)
- Client-side validation errors showing backend errors (keep separate concerns)
- Over-engineered animations (keep subtle, professional)
- Colors outside the note-taking palette (stick to cream, yellow, ink black, gray)
- Auto-login after registration (manual login required)
- Any changes to backend error response format (frontend must adapt to existing format)
- Changing the email-optional behavior from registration

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: YES (bun test available)
- **Automated tests**: None required (frontend integration tests will verify via Playwright)
- **Manual verification**: Agent will test error scenarios directly

### Agent-Executed QA Scenarios

**Scenario 1: Login with valid credentials**
- Tool: Playwright
- Preconditions: Dev server running, user exists with username "testuser" and password "Pass123!"
- Steps:
  1. Navigate to `http://localhost:3000/login`
  2. Wait for form to load (500ms)
  3. Fill `input[name="username"]` → "testuser"
  4. Fill `input[name="password"]` → "Pass123!"
  5. Click `button[type="submit"]`
  6. Wait for "Welcome!" toast notification (2s timeout)
  7. Assert URL changed to `/dashboard` (or redirect happened)
  8. Screenshot: `.sisyphus/evidence/task-1-login-success.png`
- Expected Result: User logged in and redirected to dashboard
- Failure Indicators: Toast not shown, URL unchanged, error message appears

**Scenario 2: Login with invalid credentials shows specific error**
- Tool: Playwright
- Preconditions: Dev server running, user "testuser" exists
- Steps:
  1. Navigate to `http://localhost:3000/login`
  2. Fill username → "testuser"
  3. Fill password → "WrongPassword"
  4. Click submit button
  5. Wait for error message to appear (2s timeout)
  6. Assert error message visible and readable (text contains "Invalid")
  7. Assert button re-enabled (not in loading state)
  8. Screenshot: `.sisyphus/evidence/task-2-login-invalid-creds.png`
- Expected Result: Clear error message shown, form remains interactive
- Failure Indicators: Generic error message, button still disabled, no visible error

**Scenario 3: Register with duplicate username shows specific error**
- Tool: Playwright
- Preconditions: Dev server running, user "existinguser" already exists
- Steps:
  1. Navigate to `http://localhost:3000/register`
  2. Fill `input[name="username"]` → "existinguser"
  3. Fill `input[name="name"]` → "Test User"
  4. Fill `input[name="password"]` → "SecurePass123!"
  5. Fill `input[name="passwordConfirm"]` → "SecurePass123!"
  6. Leave email empty (optional field)
  7. Click submit button
  8. Wait 2 seconds for error message
  9. Assert error message contains "already exists" or "duplicate"
  10. Assert form fields still populated (not cleared)
  11. Screenshot: `.sisyphus/evidence/task-3-register-duplicate.png`
- Expected Result: Specific error about username, form keeps data
- Failure Indicators: Generic error, form cleared, button stuck in loading

**Scenario 4: Register with weak password shows validation error**
- Tool: Playwright
- Preconditions: Dev server running, no user with "newuser"
- Steps:
  1. Navigate to `http://localhost:3000/register`
  2. Fill username → "newuser"
  3. Fill name → "New User"
  4. Fill password → "weak" (less than 6 chars, no uppercase/digit)
  5. Fill passwordConfirm → "weak"
  6. Click submit
  7. Wait 2 seconds for error message
  8. Assert error shows password requirements (uppercase, lowercase, digit, etc.)
  9. Screenshot: `.sisyphus/evidence/task-4-register-weak-pwd.png`
- Expected Result: Specific password requirement error shown
- Failure Indicators: Generic error, no password details

**Scenario 5: Register form displays password requirements dynamically**
- Tool: Playwright
- Preconditions: Dev server running
- Steps:
  1. Navigate to `http://localhost:3000/register`
  2. Find password requirements indicator (if visible on page)
  3. Fill password input with "Pass"
  4. Assert requirements show progress (e.g., "✓ Uppercase" but "✗ Digit")
  5. Fill password with "Pass123"
  6. Assert requirements all checked
  7. Screenshot: `.sisyphus/evidence/task-5-register-requirements.png`
- Expected Result: Visual feedback on password requirements as user types
- Failure Indicators: No requirements display, no real-time updates

**Scenario 6: Register then login (integration flow)**
- Tool: Playwright
- Preconditions: Dev server running, new username available
- Steps:
  1. Navigate to `/register`
  2. Register new user: username="newtest", name="New Test", password="TestPass123!", email="test@test.com"
  3. Wait for success notification (or redirect to login)
  4. Assert form cleared or page changed
  5. If not auto-redirected, click "Already have account? Login" link
  6. Wait for login page
  7. Fill username → "newtest"
  8. Fill password → "TestPass123!"
  9. Click login
  10. Wait for "Welcome!" toast (2s timeout)
  11. Assert redirected to `/dashboard`
  12. Screenshot: `.sisyphus/evidence/task-6-register-login-flow.png`
- Expected Result: New user can register and immediately login successfully
- Failure Indicators: Registration fails, login not possible, missing navigation links

**Scenario 7: Form loads with proper styling (colors, fonts, spacing)**
- Tool: Playwright
- Preconditions: Dev server running
- Steps:
  1. Navigate to `/login`
  2. Wait for page load (1s)
  3. Check background color: should be cream (`#FFFBEB` or near white)
  4. Check form background: should be note-yellow (`#F5D066` - darker than before)
  5. Check heading font: should be handwritten (Patrick Hand)
  6. Check body font: should be friendly (Quicksand)
  7. Check button color: should be darker yellow
  8. Take screenshot of full page
  9. Assert no layout issues, text is readable
  10. Screenshot: `.sisyphus/evidence/task-7-styling.png`
- Expected Result: Form displays with correct colors, fonts, and spacing
- Failure Indicators: Wrong colors, misaligned elements, poor readability

**Scenario 8: Form has smooth animations on load**
- Tool: Playwright
- Preconditions: Dev server running
- Steps:
  1. Navigate to `/login`
  2. Observe form entrance (should fade in smoothly, not instant)
  3. Focus on input field
  4. Assert focus ring appears smoothly (not jerky)
  5. Type in field
  6. Assert input animates smoothly
  7. Submit form
  8. Assert button shows loading state (spinner or disabled appearance)
  9. Screenshot: `.sisyphus/evidence/task-8-animations.png`
- Expected Result: All transitions are smooth and professional
- Failure Indicators: Instant appearance, no focus effects, jerky animations

**Scenario 9: Button shows loading state during submission**
- Tool: Playwright
- Preconditions: Dev server running
- Steps:
  1. Navigate to `/register`
  2. Fill all fields with valid data
  3. Click submit button
  4. Immediately take screenshot (during submission)
  5. Assert button text changes or shows spinner
  6. Assert button is disabled (no double-submit)
  7. Wait for response
  8. Assert button returns to normal state
  9. Screenshot: `.sisyphus/evidence/task-9-loading-state.png`
- Expected Result: Clear loading state during form submission
- Failure Indicators: Button doesn't change, button still clickable during submission

---

## Implementation Strategy

### Phase 1: Error Parsing Utility
Create utility to parse backend error responses and extract field-specific messages.

### Phase 2: Login Form Enhancement
Update LoginForm with error parsing, loading state, animations, and improved styling.

### Phase 3: Register Form Enhancement
Update RegisterForm with error parsing, loading state, animations, password requirements, and improved styling.

### Phase 4: Global Styling & Layout
Update colors, animations, spacing, and typography across auth pages.

### Phase 5: Navigation & Links
Add links between login/register pages for better UX.

---

## TODOs

- [ ] 1. Create error parsing utility
  
  **What to do**:
  - Create `frontend/src/features/auth/utils/errorParser.ts`
  - Parse backend error responses with structure like `{ message: "...", errors: { fieldName: ["error1", "error2"] } }`
  - Export function `parseErrorResponse(error: any): { general: string; fields: Record<string, string[]> }`
  - Handle both string errors and detailed field errors
  - Map field names to display names (e.g., "userName" → "Username", "passwordConfirm" → "Password")
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-development`]
    - `frontend-development`: Error handling patterns in React/TypeScript
  
  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Tasks 2 and 3 (forms depend on this utility)
  - **Blocked By**: None (can start immediately)
  
  **References**:
  - `frontend/src/features/auth/api/auth.ts` - Current error handling (line 14-16, 31-33)
  - Backend endpoint: Should return `{ message: "...", errors: { fieldName: ["error1"] } }` structure
  
  **Acceptance Criteria**:
  - [ ] Utility handles backend response with `message` and `errors` fields
  - [ ] Returns object with `general` (string) and `fields` (Record<string, string[]>)
  - [ ] Handles undefined/null error responses gracefully
  - [ ] Tested with mock error responses:
    - `{ message: "Validation failed", errors: { userName: ["already exists"] } }`
    - `{ message: "Invalid credentials" }` (no field errors)
    - Generic string error
  
  **Agent-Executed QA Scenarios**:
  
  ```
  Scenario: Parse field-specific error response
    Tool: interactive_bash
    Steps:
      1. Create test file testing error parser
      2. Import errorParser function
      3. Call with: { message: "Validation failed", errors: { userName: ["already exists"] } }
      4. Assert returned { general: "Validation failed", fields: { userName: ["already exists"] } }
      5. Call with: { message: "Invalid credentials" }
      6. Assert returned { general: "Invalid credentials", fields: {} }
    Expected Result: Correct parsing of all error formats
  ```
  
  **Commit**: YES (with task 2)
  - Message: `feat(auth): add error response parser utility`
  - Files: `frontend/src/features/auth/utils/errorParser.ts`

---

- [ ] 2. Enhance Login Form with error handling and styling
  
  **What to do**:
  - Update `frontend/src/features/auth/components/LoginForm.tsx`
  - Import `errorParser` utility from task 1
  - Add `isLoading` state to track form submission
  - Parse errors from catch block using `errorParser`
  - Display general errors in toast notification
  - Display field-specific errors below each input (red text, small font)
  - Add loading state to submit button (disabled, show spinner or change text)
  - Improve styling: deeper yellow background, better spacing, handwritten feel
  - Add smooth fade-in animation to form
  - Add focus states to inputs (deeper yellow ring)
  - Keep existing validation (Zod) for client-side checks
  
  **Must NOT do**:
  - Don't remove Zod client-side validation
  - Don't auto-login after successful login (user manually redirected)
  - Don't change input field names or types
  
  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`, `frontend-development`]
    - `frontend-ui-ux`: Form design, error display, visual hierarchy
    - `frontend-development`: React form state, Zod integration
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with task 3)
  - **Parallel Group**: Wave 2 (with task 3, register form)
  - **Blocked By**: Task 1 (error parser utility)
  - **Blocks**: Task 5 (global styling) - can proceed after this
  
  **References**:
  - `frontend/src/features/auth/utils/errorParser.ts` - Error parsing (task 1)
  - `frontend/src/features/auth/api/auth.ts:5-20` - Login API call
  - `frontend/src/features/auth/components/RegisterForm.tsx` - Similar form pattern to follow
  - `frontend/src/app/globals.css:9-14` - Current colors (will update to darker yellow)
  
  **Acceptance Criteria**:
  - [ ] Form submission sets `isLoading` state to true
  - [ ] Button is disabled and shows loading state during submission
  - [ ] General errors from backend appear in toast notification
  - [ ] Field-specific errors appear below corresponding inputs (e.g., "Invalid credentials" under password)
  - [ ] Form inputs remain populated when error occurs (not cleared)
  - [ ] Loading state clears when response received (success or error)
  - [ ] Form has smooth fade-in animation on mount
  - [ ] Inputs have focus rings with deeper yellow color
  - [ ] Spacing and typography follow Patrick Hand + Quicksand pattern
  - [ ] Responsive on mobile (full width, proper spacing)
  
  **Agent-Executed QA Scenarios**:
  
  ```
  Scenario: Show field-specific error for invalid credentials
    Tool: Playwright
    Preconditions: Dev server running, user exists
    Steps:
      1. Navigate to /login
      2. Fill username: "testuser"
      3. Fill password: "WrongPassword"
      4. Click submit button
      5. Assert button shows loading state (disabled, spinner visible)
      6. Wait 2s for response
      7. Assert error message appears below password input
      8. Assert toast shows general error (if applicable)
      9. Assert button re-enabled
      10. Assert form fields still populated
    Expected Result: Clear field error shown, form remains usable
    Evidence: .sisyphus/evidence/task-2-login-field-error.png
  
  Scenario: Form animates on load
    Tool: Playwright
    Steps:
      1. Navigate to /login
      2. Observe form entrance (should fade in, not instant)
      3. Assert focus ring appears smoothly on input focus
      4. Assert transitions are smooth (no jerky movements)
    Expected Result: Smooth animations throughout
    Evidence: .sisyphus/evidence/task-2-animations.png
  ```
  
  **Commit**: YES (with task 3)
  - Message: `feat(auth): enhance login form with error handling and improved UI`
  - Files: `frontend/src/features/auth/components/LoginForm.tsx`

---

- [ ] 3. Enhance Register Form with error handling, requirements, and styling
  
  **What to do**:
  - Update `frontend/src/features/auth/components/RegisterForm.tsx`
  - Import `errorParser` utility
  - Add `isLoading` state for form submission
  - Parse errors from backend using `errorParser`
  - Display field-specific errors below inputs (red text)
  - Add password requirements visual indicator:
    - Show requirements as user types in password field
    - Display checkmarks/X for: minimum length, uppercase, lowercase, digit
    - Show all requirements met when password is valid
  - Add loading state to submit button
  - Improve styling: deeper yellow background, better spacing
  - Add smooth animations
  - Keep email optional (no required validation)
  - Keep password confirmation validation
  
  **Must NOT do**:
  - Don't require email field (must remain optional)
  - Don't auto-login after registration
  - Don't remove password confirmation field
  - Don't add extra fields beyond: username, name, email, password, passwordConfirm
  
  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`, `frontend-development`]
    - `frontend-ui-ux`: Password requirements display, form layout
    - `frontend-development`: React state, password validation logic
  
  **Parallelization**:
  - **Can Run In Parallel**: YES (with task 2)
  - **Parallel Group**: Wave 2 (with task 2, login form)
  - **Blocked By**: Task 1 (error parser utility)
  - **Blocks**: Task 5 (global styling)
  
  **References**:
  - `frontend/src/features/auth/utils/errorParser.ts` - Error parsing (task 1)
  - `frontend/src/features/auth/api/auth.ts:22-35` - Register API call
  - `frontend/src/features/auth/types/auth.ts` - Register input types (email optional)
  - `frontend/src/features/auth/components/LoginForm.tsx` - Similar form pattern
  
  **Acceptance Criteria**:
  - [ ] Form submission sets `isLoading` state to true
  - [ ] Button is disabled during submission with loading state
  - [ ] General errors appear in toast notification
  - [ ] Field-specific errors appear below inputs
  - [ ] Password requirements indicator shows real-time feedback:
    - ✓ Minimum 6 characters
    - ✓ Uppercase letter (A-Z)
    - ✓ Lowercase letter (a-z)
    - ✓ Digit (0-9)
  - [ ] Form inputs remain populated when error occurs
  - [ ] Loading state clears when response received
  - [ ] Email field is optional (no validation, accepts empty)
  - [ ] Password confirmation validation works (matches password field)
  - [ ] Smooth fade-in animation on mount
  - [ ] Responsive on mobile
  
  **Agent-Executed QA Scenarios**:
  
  ```
  Scenario: Show password requirements as user types
    Tool: Playwright
    Steps:
      1. Navigate to /register
      2. Fill username: "testuser"
      3. Fill name: "Test User"
      4. Focus on password field
      5. Type: "pass" (lowercase only)
      6. Assert requirements show: ✗ Uppercase, ✗ Digit, ✓ Minimum length
      7. Clear password, type: "Pass1" (mixed + digit)
      8. Assert requirements show: ✓ Uppercase, ✓ Lowercase, ✓ Digit, ✓ Minimum
      9. Assert button becomes enabled
    Expected Result: Real-time password requirement feedback
    Evidence: .sisyphus/evidence/task-3-pwd-requirements.png
  
  Scenario: Show field-specific error for duplicate username
    Tool: Playwright
    Preconditions: User "existinguser" already exists
    Steps:
      1. Navigate to /register
      2. Fill username: "existinguser"
      3. Fill name: "Test"
      4. Fill password: "Pass123!"
      5. Fill passwordConfirm: "Pass123!"
      6. Leave email empty
      7. Click submit
      8. Wait 2s for response
      9. Assert error shows: "username already exists" or similar
      10. Assert form fields still populated
      11. Assert button re-enabled
    Expected Result: Specific username error shown
    Evidence: .sisyphus/evidence/task-3-dup-username.png
  ```
  
  **Commit**: YES (with task 2)
  - Message: `feat(auth): enhance register form with requirements display and error handling`
  - Files: `frontend/src/features/auth/components/RegisterForm.tsx`

---

- [ ] 4. Update global styling with deeper yellow and animations
  
  **What to do**:
  - Update `frontend/src/app/globals.css`
  - Replace `--note-yellow: #FEF3C7` with deeper yellow (approximately `#F5D066` - 5% darker)
  - Add Tailwind animation definitions:
    - `fade-in`: opacity 0 to 1 over 300ms on component mount
    - `slide-up`: translateY from 20px to 0 over 300ms
    - `pulse-subtle`: slight opacity pulse for loading states
  - Add smooth transition classes for form elements
  - Ensure button hover and focus states use the new deeper yellow
  - Update input focus rings to use new yellow color
  - Improve overall spacing and shadow consistency
  - Update card backgrounds to match new color scheme
  
  **Must NOT do**:
  - Don't change paper cream (#FFFBEB) or ink black colors
  - Don't change font definitions (Patrick Hand, Quicksand)
  - Don't remove any existing color variables
  - Don't change dark mode colors unless necessary for contrast
  
  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`ui-styling`]
    - `ui-styling`: Tailwind CSS, color systems, animations
  
  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: Tasks 2 and 3 (forms should be updated to match colors)
  - **Blocks**: Task 5 (page layout uses these animations)
  
  **References**:
  - `frontend/src/app/globals.css:1-47` - Current theme and colors
  - Tailwind v4 animation docs - Animation syntax reference
  - `frontend/src/features/auth/components/LoginForm.tsx` - Will use new animations
  
  **Acceptance Criteria**:
  - [ ] `--note-yellow` changed to `#F5D066` (or verified as ~5% darker than `#FEF3C7`)
  - [ ] New animations defined:
    - `fade-in`: opacity transition 0→1 in 300ms
    - `slide-up`: transform and opacity transition in 300ms
    - `pulse-subtle`: subtle opacity pulse for loading states
  - [ ] Button hover states use new deeper yellow
  - [ ] Input focus rings use new yellow color
  - [ ] All shadows and borders render correctly with new colors
  - [ ] Dark mode contrast remains acceptable
  - [ ] No breaking changes to existing color variables
  
  **Agent-Executed QA Scenarios**:
  
  ```
  Scenario: Verify color changes applied correctly
    Tool: Playwright
    Steps:
      1. Navigate to /login
      2. Use browser DevTools to inspect button color
      3. Assert button background color is darker yellow (F5D066 or similar)
      4. Inspect form background
      5. Assert background is cream (#FFFBEB)
      6. Inspect input focus ring color
      7. Assert focus ring uses new yellow (F5D066)
      8. Take screenshot of styled form
    Expected Result: All colors updated and visible
    Evidence: .sisyphus/evidence/task-4-colors.png
  
  Scenario: Verify animations are smooth
    Tool: Playwright
    Steps:
      1. Navigate to /login
      2. Observe form entrance animation (fade-in)
      3. Focus on input field
      4. Observe focus animation
      5. Assert all transitions are smooth (no stuttering)
      6. Take video/screenshots of animations
    Expected Result: Smooth transitions throughout
    Evidence: .sisyphus/evidence/task-4-animations.png
  ```
  
  **Commit**: YES (combined with task 5)
  - Message: `style(auth): update colors to deeper yellow and add smooth animations`
  - Files: `frontend/src/app/globals.css`

---

- [ ] 5. Enhance auth layout and pages with improved spacing and typography
  
  **What to do**:
  - Update `frontend/src/app/(auth)/layout.tsx`
    - Improve spacing around form container
    - Add subtle shadow or border to form
    - Center content vertically and horizontally better
    - Ensure mobile responsiveness
    - Add subtle background texture or pattern (optional handwritten feel)
  - Update `frontend/src/app/(auth)/login/page.tsx`
    - Add heading: "Sign In"
    - Add subtitle or description
    - Add link to register page: "Don't have an account? Register here"
    - Improve typography using Patrick Hand for headings
  - Update `frontend/src/app/(auth)/register/page.tsx`
    - Add heading: "Create Account"
    - Add subtitle
    - Add link to login page: "Already have an account? Sign in"
    - Improve typography
  - Add smooth page transitions (fade-in)
  - Ensure all fonts use Patrick Hand (headings) and Quicksand (body)
  
  **Must NOT do**:
  - Don't change the background color from cream
  - Don't add images or external assets
  - Don't change route structure (/login, /register)
  - Don't modify form components themselves (those are in tasks 2-3)
  
  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`, `ui-styling`]
    - `frontend-ui-ux`: Layout, spacing, typography hierarchy
    - `ui-styling`: Tailwind classes, responsive design
  
  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: Tasks 2, 3, 4 (uses updated forms and colors)
  
  **References**:
  - `frontend/src/app/(auth)/layout.tsx:1-30` - Current layout structure
  - `frontend/src/app/(auth)/login/page.tsx` - Current login page
  - `frontend/src/app/(auth)/register/page.tsx` - Current register page
  - `frontend/src/app/globals.css` - Colors and fonts (updated in task 4)
  
  **Acceptance Criteria**:
  - [ ] Login page has heading "Sign In" (Patrick Hand font)
  - [ ] Register page has heading "Create Account"
  - [ ] Both pages have descriptive subtitle
  - [ ] Login page has link to register: "Don't have an account? Register"
  - [ ] Register page has link to login: "Already have an account? Sign in"
  - [ ] Form container centered on page (vertical and horizontal)
  - [ ] Proper spacing around form (margins and padding)
  - [ ] Form has subtle shadow or border for definition
  - [ ] Mobile responsive (full width on small screens, constrained on large)
  - [ ] All fonts render correctly (Patrick Hand for headings, Quicksand for body)
  - [ ] Page transitions are smooth (fade-in animations)
  - [ ] No text readability issues
  
  **Agent-Executed QA Scenarios**:
  
  ```
  Scenario: Login page displays with correct layout and typography
    Tool: Playwright
    Steps:
      1. Navigate to /login
      2. Assert heading "Sign In" visible (Patrick Hand font)
      3. Assert subtitle/description visible
      4. Assert form is centered on page
      5. Assert link to register page: "Don't have an account? Register"
      6. Click register link
      7. Assert navigated to /register
      8. Assert register page has heading "Create Account"
      9. Assert link to login page: "Already have an account? Sign in"
      10. Take screenshots of both pages
    Expected Result: Both pages have proper layout and navigation
    Evidence: .sisyphus/evidence/task-5-layout.png
  
  Scenario: Pages are responsive on mobile
    Tool: Playwright
    Steps:
      1. Set viewport to 375x667 (iPhone size)
      2. Navigate to /login
      3. Assert form is full width (no overflow)
      4. Assert text is readable
      5. Assert form is centered
      6. Assert inputs are properly sized for touch
      7. Resize to tablet (768x1024)
      8. Assert layout adapts correctly
      9. Resize to desktop (1920x1080)
      10. Assert form is constrained (not full width)
    Expected Result: Responsive design works on all sizes
    Evidence: .sisyphus/evidence/task-5-responsive.png
  ```
  
  **Commit**: YES (combined with task 4)
  - Message: `style(auth): enhance layout, spacing, and typography for note-taking aesthetic`
  - Files:
    - `frontend/src/app/(auth)/layout.tsx`
    - `frontend/src/app/(auth)/login/page.tsx`
    - `frontend/src/app/(auth)/register/page.tsx`

---

## Success Criteria

### Verification Commands
```bash
# Check build succeeds
npm run build

# Run TypeScript check
npm run type-check || tsc --noEmit

# Visual verification (manual)
npm run dev
# Then navigate to http://localhost:3000/login and test error scenarios
```

### Final Checklist
- [ ] All error messages are specific and helpful
- [ ] Loading states show during form submission
- [ ] Colors updated to deeper yellow (#F5D066)
- [ ] Animations are smooth and professional
- [ ] Forms have good spacing and typography
- [ ] Navigation between login/register works
- [ ] Password requirements display on register form
- [ ] All QA scenarios pass (error handling, styling, animations)
- [ ] Build succeeds without errors
- [ ] No console errors or warnings

---

## Next Steps

After this plan completes:
1. Verify all features work with actual backend running
2. Test on real PostgreSQL database
3. Move to US-01: Wallet Management features
4. Update documentation in `docs/done/`
