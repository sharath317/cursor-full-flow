# Refactor Code to Guidelines

## Overview

Refactor existing code to align with project coding standards from `CODING_GUIDELINES.md`, design system patterns, and best practices.

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
