# AR Smart Lab: Accessibility Audit (WCAG Compliance)

This report details keyboard accessibility, visual settings overlays, ARIA setups, and Speech synthesis configurations.

---

## 1. Accessibility Features & Settings Store

We manage user-specific accessibility preferences globally in `SettingsStore.ts`. When toggled, these options inject styles globally:

### A. High Contrast Mode
- **Action:** Injects strict outline wrappers and high-contrast color palettes (pure black backgrounds `#000000` and high-visibility yellow `#facc15` or cyan borders).
- **Target:** Visual elements on the 3D canvas and SVG coordinate grids.

### B. Large Text Scaling
- **Action:** Applies text scaling factors across components:
  - Font sizes increase dynamically (e.g. `text-sm` -> `text-base`).
  - KaTeX math formulas are rendered with larger scale configurations (`BlockMath` container sizing scales up).
- **Target:** Axis labels, toolbar buttons, and side panel step explanations.

### C. Speech Narration
- **Action:** Reads step-by-step guidance, objectives, and calculations using Web Speech synthesis.
- **Target:** Students with visual impairments or reading difficulties.

---

## 2. Keyboard Navigation & Focus Indicators

Every interactive element in AR Smart Lab is keyboard accessible:
- **Tab Order:** Interactive tools, buttons, input sliders, and tabs are configured with sequential `tabIndex` attributes.
- **Visual Focus Rings:** Buttons and inputs render distinct focus borders (`focus:ring-2 focus:ring-blue-500 focus:outline-none`) when navigated via tab keys.
- **Keyboard Shortcuts:**
  - `Spacebar` toggles Panning mode in coordinate grids.
  - `Escape` cancels active lines drawing.

---

## 3. ARIA Landmarks & Structural HTML

We adhere to semantic HTML5 principles to ensure compatibility with screen readers (NVDA, JAWS, VoiceOver):
- **Semantic Structure:** Primary content areas are wrapped inside `<main>`, sidebar calculators in `<aside>`, toolbar settings in `<nav>`, and headers in `<header>`.
- **Descriptive Labels:** Screen reader indicators (`aria-label`, `aria-describedby`) are present on icon-only buttons (such as toolbar actions in `TeacherToolbar`).
- **Interactive States:** Tool states and active selections communicate via `aria-pressed` or `aria-selected` properties.
