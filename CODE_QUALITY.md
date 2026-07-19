# AR Smart Lab: Code Quality & Developer Standards

This report documents our codebase standards, type guidelines, styling systems, and unit testing adapters.

---

## 1. TypeScript Standards & Strict Type Safety

The project utilizes TypeScript with strict compiler flags configured under `tsconfig.app.json`:
- `strict: true` (mandatory null checks and parameter typing).
- `verbatimModuleSyntax: true` (forces separation of runtime imports from compile-time interfaces via `import type`).
- `noUnusedLocals: true` (guarantees zero dead code).

### Common ES Type Guidelines:
1. **Type-Only Separation:** Always import types explicitly:
   ```typescript
   import type { EngineProps, EngineImperativeAPI } from '../../core/types';
   ```
2. **Strict Props Interfaces:** All engine components must satisfy the standard properties signature (`EngineProps` and custom configuration templates).
3. **Imperative Refs Handler:** Custom engines must expose key controls (`reset()`, `focus()`, `export()`) to the parent loader using `forwardRef` and `useImperativeHandle`.

---

## 2. Style System & Reusable UI Components

We follow a unified styling structure:
- **Tailwind CSS + Custom Utilities:** Clean layout styling using predefined styles in `index.css` (variables for `--background`, `--foreground`, `--primary`, `--glass-panel`, etc.).
- **Typography:** Outfit & Inter font faces are configured to ensure modern, high-contrast, premium readability.
- **Glassmorphism panels:** Consistently styled using `glass-panel` utility classes.

---

## 3. Linting & Validation Setup

Linting and code-formatting are validated during continuous integration checkouts:
- **Oxlint Setup:** Oxlint is configured with rules targeting React hooks, imports alignment, and general performance bugs.
- **Strict Build Compilations:** The project build step compiles zero compiler warnings.
  ```bash
  # Check build validity
  npx tsc --noEmit --project tsconfig.app.json
  ```

---

## 4. Testability & Adapter Contracts

The workspace features a decoupling layer through the **Engine Adapter Store** (`EngineAdapterStore.ts`).
- **IEngineAdapter Interface:** Every engine registers an adapter implementing:
  - `getState()`: Serializes active layout coordinates and metrics.
  - `isCompleted(validationKey: string)`: Automates lesson step verification tests (e.g. checking if a point is placed at the origin).
  - `reset()`: Resets simulation states.
- **Test Automation:** The adapter architecture is designed to allow headless automated scripts to test coordinate geometry, algebra, and geometry steps automatically without rendering the Canvas or UI screens.
