---
description: Deep PR review checklist - size, hooks, styling, security, accessibility
category: PR Management
aliases: [checklist, pr-check]
usedBy: [pr-review, pre-pr-check]
---

# PR Review Checklist

Use this checklist when reviewing PRs or before submitting your own.

**Purpose:** Deep manual review (beyond what auto-rules catch)

**Auto-enforced version:** `.cursor/rules/pr-quality.mdc` (enforces before PR)

**Uses:** `/code-standards` for limits and patterns

## Usage

```
/pr-checklist {PR_NUMBER}
```

Run this to generate a structured review based on the checklist below.

> **Note:** Basic quality gates are auto-enforced by `.mdc` rules.
> This command provides the deep-dive checklist for thorough manual review.

## Automated Check (Run First)

```bash
# Get changed files and run quality check
gh pr diff {PR_NUMBER} --name-only | xargs -n1 dirname | sort -u | \
  while read dir; do .cursor/scripts/code-quality-check.sh "$dir"; done
```

---

## 📋 Component Quality Checklist

### Size & Complexity

-   [ ] **No file exceeds 300 lines** (warning at 150)
-   [ ] **No component has > 6 useState** (warning at 4)
-   [ ] **No component has > 5 useEffect** (warning at 3)
-   [ ] **No file has > 35 imports** (warning at 20)
-   [ ] **No hook returns > 15 values** (warning at 8)

### Structure

-   [ ] **Follows feature folder structure**

    -   `Component.tsx` + `.styled.ts` + `.types.ts`
    -   Hooks in `hooks/` subdirectory
    -   Sub-components in `components/` subdirectory

-   [ ] **No barrel files inside component directories**

    -   Direct imports: `import { X } from './X/X'`

-   [ ] **Styled components use namespace import**
    -   `import * as S from './Component.styled'`

### Hooks Quality

-   [ ] **Single responsibility per hook**

    -   Data hooks only fetch
    -   State hooks only manage state
    -   Tracking hooks only track

-   [ ] **useEffect has cleanup for async operations**

    ```typescript
    useEffect(() => {
        const controller = new AbortController();
        // ... fetch with signal
        return () => controller.abort();
    }, []);
    ```

-   [ ] **Uses useWatch instead of watch()**

    -   ❌ `methods.watch()` - causes re-renders
    -   ✅ `useWatch({ name, control })`

-   [ ] **Yup schemas are memoized**

    ```typescript
    const schema = useMemo(() => yup.object({...}), []);
    ```

-   [ ] **No components defined inside render**
    -   Components should be outside or use memo

### Styling

-   [ ] **Uses design tokens exclusively**

    -   `spacing()`, `color()`, `borderRadiusStyles()`
    -   No hardcoded px, colors, or breakpoints

-   [ ] **Responsive styles use OXBiggerThan**

    -   `@media ${OXBiggerThan.Small}`

-   [ ] **No font-size in styled components**
    -   Typography handled by OXTypography only

### State Management

-   [ ] **State colocated with usage**

    -   Local state stays local
    -   Shared state uses Context

-   [ ] **No prop drilling > 3 levels**
    -   Use Context or composition instead

### Error Handling

-   [ ] **Uses ApiError type, not 'any'**

    ```typescript
    catch (err) {
        const error = err as ApiError;
    }
    ```

-   [ ] **Async errors handled gracefully**
    -   Loading states
    -   Error boundaries where appropriate

### Testing

-   [ ] **Test file in same directory or `__tests__/`**
-   [ ] **Tests behavior, not implementation**
-   [ ] **Mocks external dependencies**

### Documentation

-   [ ] **JSDoc comments are simple**

    -   No ticket references
    -   No PR references
    -   Just describe what it does

-   [ ] **Commit messages are natural**
    -   No `fix:`, `feat:`, `refactor:` prefixes
    -   No ticket IDs in message

---

## 🚨 Critical Violations (Block Merge)

These MUST be fixed before merge:

1. **Race conditions in useEffect** - Missing AbortController
2. **God components** - Files > 500 lines
3. **Hardcoded design values** - Must use tokens
4. **Missing error handling** - Async without try/catch
5. **Type safety violations** - Using `any`

---

## ⚠️ Warnings (Should Fix)

These should be fixed but can be addressed in follow-up:

1. **Files 150-300 lines** - Consider splitting
2. **4-6 useState in component** - Consider custom hook
3. **Missing tests** - Add coverage
4. **Complex conditionals** - Extract to functions

---

## 💡 Suggestions (Nice to Have)

1. **Could extract reusable hook**
2. **Could move to business-modules**
3. **Could add Storybook story**
4. **Could improve variable naming**

---

## AI Execution

When running `/pr-checklist {PR_NUMBER}`:

1. Fetch PR diff
2. Analyze against each checklist item
3. Generate report:

```
## PR #{NUMBER} Review

### ✅ Passing (X items)
- Component size within limits
- Design tokens used correctly
- ...

### 🚨 Critical (X items)
- `MainComponent.tsx:45` - Missing AbortController cleanup
- `Helper.ts:12` - Using 'any' type

### ⚠️ Warnings (X items)
- `FeatureCard.tsx` - 180 lines (consider splitting)

### 💡 Suggestions (X items)
- Consider extracting `useFeatureData` hook

---
**Verdict**: {APPROVE | REQUEST_CHANGES | COMMENT}
```
