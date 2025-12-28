---
description: Run validation before PR - compile, lint, tests, size limits, security scan
category: PR Management
aliases: [validate, pre-check, pre-pr]
uses: [code-standards, pr-checklist]
---

# Pre-PR Check - Shift Left Validation

Run comprehensive validation BEFORE opening a PR to catch issues early.

**Shift left** — save reviewer time and reduce PR cycles.

## Usage

```
/pre-pr-check
/pre-pr-check --quick          # Essential checks only
/pre-pr-check --strict         # All checks, block on warnings
/pre-pr-check {FILES}          # Check specific files only
```

## What This Checks

```
════════════════════════════════════════════════════════════════
  PRE-PR VALIDATION
════════════════════════════════════════════════════════════════

Running 8 validation checks...

┌─────────────────────────────────────────────────────────────┐
│  CHECK                          │ STATUS │ DETAILS          │
├─────────────────────────────────┼────────┼──────────────────┤
│  1. TypeScript Compilation      │   ✅   │ No errors        │
│  2. Linting                     │   ✅   │ No errors        │
│  3. Code Standards              │   ⚠️   │ 2 warnings       │
│  4. Test Coverage Delta         │   ✅   │ +5% coverage     │
│  5. Bundle Size Impact          │   ⚠️   │ +12KB (warning)  │
│  6. Churn Impact                │   ✅   │ Low-churn files  │
│  7. Translation Risk            │   ✅   │ No new strings   │
│  8. Pattern Compliance          │   ✅   │ Follows ADRs     │
└─────────────────────────────────┴────────┴──────────────────┘

════════════════════════════════════════════════════════════════
  RESULT: ⚠️ WARNINGS (Can proceed, but address before review)
════════════════════════════════════════════════════════════════
```

## Check Details

### 1. TypeScript Compilation

```bash
pnpm --filter @sixt-web/{PACKAGE} compile
```

Verifies:

-   No type errors
-   All imports resolve
-   No missing dependencies

### 2. Linting

```bash
pnpm --filter @sixt-web/{PACKAGE} lint
```

Verifies:

-   ESLint rules pass
-   No auto-fixable issues remaining (run `--fix` first)

### 3. Code Standards (from `/code-standards`)

```
Checking against code-standards limits:

Component Size:
  ✅ MainComponent.tsx: 145 lines (< 150 limit)
  ⚠️ HelperComponent.tsx: 180 lines (> 150 warning)

Hook Complexity:
  ✅ useFeature.ts: 4 useState (< 6 limit)
  ✅ useFeature.ts: 2 useEffect (< 5 limit)

Import Count:
  ✅ All files under 35 imports
```

### 4. Test Coverage Delta

```bash
# Compare coverage before and after changes
pnpm test --coverage --changedSince=origin/master
```

Output:

```
Test Coverage Delta:
  Before: 78.5%
  After:  83.2%
  Delta:  +4.7% ✅

New files without tests:
  ⚠️ src/components/NewComponent.tsx (no test file)
```

### 5. Bundle Size Impact

```bash
# Estimate bundle size change
pnpm build --analyze
```

Output:

```
Bundle Size Impact:
  Before: 245.3 KB
  After:  257.8 KB
  Delta:  +12.5 KB ⚠️ (threshold: 10KB)

Largest new chunks:
  - NewFeature.chunk.js: 8.2 KB
  - vendor-lodash.js: 4.3 KB

Suggestions:
  - Consider lazy loading NewFeature
  - Check if lodash import is tree-shaken
```

### 6. Churn Impact

```
Analyzing churn levels of changed files:

Changed Files:
  🟢 types.ts (stable file, 3 commits/6mo) - OK
  🟢 constants.ts (stable file, 2 commits/6mo) - OK
  🟡 helpers.ts (medium churn, 28 commits/6mo) - Monitor
  🔴 MainWithBooking.tsx (high churn, 145 commits/6mo) - Caution

⚠️ Warning: You're modifying a high-churn file.
   Consider: Is this change necessary?
   See: /churn-map for context
```

### 7. Translation Risk

```
Checking for new translation strings...

New strings found:
  ✅ src/components/Feature.tsx:45 - Uses existing key
  ⚠️ src/components/New.tsx:23 - Hardcoded string detected!
     "Please select an option"

Action Required:
  Move to translation file or mark as intentionally hardcoded
```

### 8. Pattern Compliance

```
Checking against recorded decisions (ADRs):

  ✅ ADR-015: Using Context for shared state
  ✅ ADR-023: Using React Query for API calls
  ⚠️ ADR-030: Component structure pattern
     → NewComponent.tsx doesn't have .styled.ts file
```

## Output Summary

### 🟢 PASS - Ready for PR

```
════════════════════════════════════════════════════════════════
  ✅ PRE-PR CHECK PASSED
════════════════════════════════════════════════════════════════

All 8 checks passed. Your code is ready for PR!

Suggested next steps:
  1. git add -A
  2. git commit -m "{descriptive message}"
  3. git push
  4. /jira-pr {TICKET}

Or use: /full-flow {TICKET} to continue workflow
```

### 🟡 WARNINGS - Can Proceed

```
════════════════════════════════════════════════════════════════
  ⚠️ PRE-PR CHECK: WARNINGS
════════════════════════════════════════════════════════════════

Passed with 3 warnings. You CAN proceed, but consider fixing:

1. ⚠️ Bundle size +12KB (threshold: 10KB)
   Fix: Lazy load NewFeature component

2. ⚠️ HelperComponent.tsx: 180 lines (> 150)
   Fix: Extract sub-component

3. ⚠️ Missing test for NewComponent.tsx
   Fix: Add NewComponent.test.tsx

Proceed anyway? (y/n)
If yes, these will be flagged in review.
```

### 🔴 BLOCKERS - Must Fix

```
════════════════════════════════════════════════════════════════
  🚫 PRE-PR CHECK: BLOCKED
════════════════════════════════════════════════════════════════

Cannot proceed. Fix these issues first:

1. 🔴 TypeScript Error
   src/components/Feature.tsx:45
   Property 'name' does not exist on type 'Props'

2. 🔴 ESLint Error
   src/hooks/useFeature.ts:23
   React Hook useEffect has missing dependencies

3. 🔴 Code Standards Critical
   MainComponent.tsx: 350 lines (> 300 hard limit)

Fix these issues and run /pre-pr-check again.
```

## Quick Mode

For faster feedback (essential checks only):

```
/pre-pr-check --quick
```

Runs only:

1. TypeScript Compilation
2. Linting
3. Critical code standards

Skips:

-   Coverage delta
-   Bundle size
-   Churn analysis
-   Translation check

## Integration with Workflow

### Automatic Trigger

In `/full-flow`, before PR creation:

```
════════════════════════════════════════════════════════════════
  PHASE 3: SELF-REVIEW + PRE-PR CHECK
════════════════════════════════════════════════════════════════

Running /pre-pr-check...

[check results here]

Continue to PR creation? (y/n)
```

### Git Hook (Optional)

Add to `.git/hooks/pre-push`:

```bash
#!/bin/bash
# Run pre-PR check before pushing
.cursor/scripts/pre-pr-check.sh

if [ $? -ne 0 ]; then
  echo "Pre-PR check failed. Fix issues before pushing."
  exit 1
fi
```

## Commands Used

```bash
# TypeScript check
pnpm --filter @sixt-web/{PACKAGE} tsc --noEmit

# Lint check
pnpm --filter @sixt-web/{PACKAGE} lint

# Test coverage
pnpm --filter @sixt-web/{PACKAGE} test --coverage --changedSince=origin/master

# Bundle size (if applicable)
pnpm --filter @sixt-web/{PACKAGE} build

# Code standards
.cursor/scripts/code-quality-check.sh {PATH}

# Churn check
git log --since="6 months ago" --name-only --pretty=format: -- {CHANGED_FILES} | sort | uniq -c

# Translation check
grep -r "\"[A-Z][a-z].*\"" --include="*.tsx" {CHANGED_FILES}
```

## Customization

Create `.cursor/pre-pr-config.json` to customize thresholds:

```json
{
    "bundleSizeWarningKB": 10,
    "bundleSizeBlockKB": 50,
    "componentLineWarning": 150,
    "componentLineBlock": 300,
    "coverageDeltaWarning": -5,
    "skipChecks": ["translationRisk"]
}
```
