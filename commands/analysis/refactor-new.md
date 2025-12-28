---
description: Refactor code to match CODING_GUIDELINES, design system, best practices
category: Refactoring
aliases: [refactor, clean, modernize]
---

# Refactor Code to Guidelines

## Overview

Refactor existing code to align with project coding standards from `CODING_GUIDELINES.md`, design system patterns, and best practices.

## Usage

```
/refactor-new {PATH}
/refactor-new {PATH} --churn-aware
/refactor-new {PATH} --scope="structure|styling|performance|accessibility"
```

## Large Refactor? Use Parallel Tasks

For large-scale refactoring (>5 files, multiple concerns), use `/parallel-tasks` to decompose:

```
/parallel-tasks "Refactor {COMPONENT} to follow guidelines" --scope "{PATH}"

Workers:
- Component Structure (file organization, exports)
- Styling (spacing, colors, design tokens)
- Accessibility (ARIA, keyboard nav)
- Performance (memoization, re-renders)
- Testing (update tests for new structure)
```

## Churn-Aware Mode (Recommended)

Use `--churn-aware` to prioritize high-impact refactors and protect stable code:

```
/refactor-new apps/rent-checkout --churn-aware
```

### What Churn-Aware Does

```
════════════════════════════════════════════════════════════════
  CHURN ANALYSIS: {PATH}
════════════════════════════════════════════════════════════════

📊 File Churn Analysis (last 6 months)

🔴 HIGH CHURN (Prioritize Refactoring)
  - MainWithBooking.tsx: 145 commits, 12 authors
  - BookingDetails.tsx: 280 commits, 8 authors
  - PackagesV2.tsx: 89 commits, 5 authors

🟡 MEDIUM CHURN (Consider Refactoring)
  - ProtectionPackageCard.tsx: 34 commits, 4 authors
  - helpers.ts: 28 commits, 3 authors

🟢 LOW CHURN (Stable - Avoid Touching)
  - types.ts: 5 commits, 2 authors
  - constants.ts: 3 commits, 1 author
  - Layout.tsx: 8 commits, 2 authors

════════════════════════════════════════════════════════════════
  REFACTOR STRATEGY
════════════════════════════════════════════════════════════════

✅ PRIORITIZE: High-churn files (reduces future conflicts)
⚠️ CAUTION: Medium-churn files (verify value before touching)
🛡️ PROTECT: Low-churn stable files (don't touch unless necessary)
```

### Churn-Aware Rules

| File Churn Level          | Action                 | Rationale                         |
| ------------------------- | ---------------------- | --------------------------------- |
| 🔴 HIGH (>50 commits/6mo) | Prioritize refactoring | High ROI, reduces merge conflicts |
| 🟡 MEDIUM (10-50 commits) | Refactor if needed     | Moderate benefit                  |
| 🟢 LOW (<10 commits)      | Avoid touching         | Stable, don't introduce risk      |

### Commands for Churn Analysis

```bash
# Get commit count per file in last 6 months
git log --since="6 months ago" --name-only --pretty=format: | \
  sort | uniq -c | sort -rn | head -20

# Get authors per file
git log --since="6 months ago" --format='%an' -- {FILE} | sort -u | wc -l
```

## Pre-Refactoring

-   [ ] Read and understand the current implementation completely
-   [ ] Review applicable sections in `CODING_GUIDELINES.md`
-   [ ] Check linter errors for the file
-   [ ] Identify existing tests that need updating
-   [ ] Note any breaking changes for downstream consumers

## Key Refactoring Principles

### Component Structure

-   [ ] Follow component file organization pattern (`.tsx`, `.styled.ts`, `.types.ts`, `.test.tsx`, `.mock.ts`)
-   [ ] Use proper hook organization order in components
-   [ ] Add JSDoc documentation for public APIs (see `CODING_GUIDELINES.md` → Documentation)

### Naming Conventions

-   [ ] Apply naming rules from `CODING_GUIDELINES.md` → Naming Conventions

### Code Quality

-   [ ] Extract complex logic into custom hooks (see `CODING_GUIDELINES.md` → Component Development)
-   [ ] Use `useValidatedContext` for context validation
-   [ ] Remove unused imports and variables
-   [ ] Eliminate code duplication

### Accessibility

-   [ ] Use semantic HTML elements
-   [ ] Add ARIA labels to interactive elements
-   [ ] Ensure keyboard navigation works
-   [ ] Verify color contrast meets WCAG standards

### Performance

-   [ ] Add `useMemo` for expensive calculations
-   [ ] Add `useCallback` for functions passed as props
-   [ ] Consider `React.memo` for pure components

### Testing

-   [ ] Update tests to match refactored structure
-   [ ] Follow `testing/patterns/general-unit-testing/README.md`

## Post-Refactoring Checklist

-   [ ] All linter errors resolved
-   [ ] TypeScript errors resolved
-   [ ] Component renders correctly
-   [ ] No console errors or warnings
-   [ ] Accessibility verified
-   [ ] Documentation updated
