---
description: Review PR changes, identify issues, post comments on critical problems only
category: PR Management
aliases: [review, check-pr]
uses: [code-standards, pr-checklist]
---

# PR Review - Review and Summarize PRs

Review a PR, summarize changes, and post comments on critical issues only.

**Uses:** `/code-standards` for size limits, `/pr-checklist` for quality checks

## Usage

```
/pr-review {PR_NUMBER}
/pr-review {PR_NUMBER} --risk          # Focus on risks and breaking changes
/pr-review {PR_NUMBER} --architecture  # Focus on design and patterns
/pr-review {PR_NUMBER} --velocity      # Quick review, critical-only
/pr-review {PR_NUMBER} "Focus on security and performance"
```

## Review Intent Modes

Choose a mode based on PR size and context:

### `--risk` Mode (Default for Large PRs)

Focus on what could break or cause issues.

```
Review Scope:
  🔴 Security vulnerabilities
  🔴 Breaking changes to public APIs
  🔴 Data handling risks
  🔴 Race conditions and async issues
  🟠 Missing error handling
  🟠 Performance regressions

Output:
  - Detailed comments on all risks
  - Risk severity matrix
  - Suggested mitigations
```

### `--architecture` Mode (For Refactors/New Features)

Focus on design decisions and patterns.

```
Review Scope:
  🏗️ Alignment with existing patterns
  🏗️ Component structure decisions
  🏗️ State management approach
  🏗️ Abstraction boundaries
  🏗️ Dependency direction

Output:
  - Pattern compliance check
  - Architectural recommendations
  - Long-term maintainability notes
```

### `--velocity` Mode (For Small PRs)

Quick review, minimal feedback.

```
Review Scope:
  🔴 Critical issues ONLY
  ⏭️ Skip: style, naming, minor improvements
  ⏭️ Skip: suggestions and nice-to-haves

Output:
  - Approve if no critical issues
  - Single summary comment (if any)
  - No inline comments for minor issues
```

### Mode Selection Guide

| PR Characteristics       | Recommended Mode  |
| ------------------------ | ----------------- |
| <50 lines, single file   | `--velocity`      |
| 50-200 lines, routine    | Default (no flag) |
| >200 lines or multi-team | `--risk`          |
| Refactor or new pattern  | `--architecture`  |
| Security-related         | `--risk`          |
| Hotfix                   | `--velocity`      |

## Examples

```
/pr-review 22990
/pr-review 22990 "Check API client changes"
```

## What This Does

1. **Fetches PR details** - Title, description, files changed
2. **Applies `/pr-checklist`** - Size, hooks, styling, structure checks
3. **Enforces `/code-standards`** - Component limits, design tokens, patterns
4. **Identifies critical issues** - Security, logic errors, breaking changes
5. **Posts summary comment** - Nit-level summary with recommendations
6. **Posts inline comments** - Only on critical issues (skips minor ones)

## Issue Priority (Critical-First Focus)

### 🔴 CRITICAL - Always Post as Comment

| Category         | Examples                        | Impact                  |
| ---------------- | ------------------------------- | ----------------------- |
| Security         | XSS, injection, auth bypass     | User data at risk       |
| Data Corruption  | Wrong mutations, lost data      | User impact             |
| Breaking Changes | Public API changes, type breaks | Other teams blocked     |
| Runtime Crashes  | Null access, infinite loops     | App unusable            |
| Resource Leaks   | Memory leaks, open connections  | Performance degradation |
| Race Conditions  | Async bugs, stale data          | Unpredictable behavior  |

### 🟠 HIGH - Post if Significant

| Category               | Examples                            | Impact                  |
| ---------------------- | ----------------------------------- | ----------------------- |
| Logic Errors           | Wrong conditions, off-by-one        | Feature broken          |
| Missing Error Handling | Unhandled promises, no try/catch    | Silent failures         |
| Performance            | N+1 queries, unnecessary re-renders | Slow experience         |
| Accessibility          | Missing ARIA, no keyboard nav       | Unusable for some users |

### 🟡 MEDIUM - Mention in Summary Only

| Category             | Examples                    | Impact                  |
| -------------------- | --------------------------- | ----------------------- |
| Missing Dependencies | useCallback deps incomplete | Potential stale closure |
| Type Safety          | Any types, missing generics | Maintainability         |
| Test Coverage        | Missing edge case tests     | Future bugs             |

### 🟢 SKIP - Don't Mention

| Category          | Examples            | Why Skip       |
| ----------------- | ------------------- | -------------- |
| Style             | Formatting, spacing | Linter handles |
| Naming            | Variable names      | Subjective     |
| Minor Refactoring | Could be cleaner    | Not blocking   |
| Documentation     | Missing JSDoc       | Not critical   |

## Review Strategy

```
0. Pre-Check: /code-standards & /pr-checklist
   - Run .cursor/scripts/code-quality-check.sh on changed files
   - Check for size limit violations (> 150 LOC, > 20 imports)
   - Check for hook violations (> 4 useState, > 3 useEffect)

1. First Pass: Security & Data Safety
   - Any user input handling?
   - Any sensitive data?
   - Any external calls?

2. Second Pass: Logic & Correctness
   - Does it do what AC says?
   - Edge cases handled?
   - Error states handled?

3. Third Pass: Performance & Patterns (from /code-standards)
   - useEffect has AbortController cleanup?
   - Using useWatch instead of watch()?
   - Yup schemas memoized?
   - No components inside render?
   - Design tokens used (no hardcoded values)?

4. Skip: Style & Preferences
   - Let linters handle formatting
   - Don't bikeshed naming
```

## Quick Script for Automated Check

Before reviewing, run:

```bash
# Get changed files
gh pr diff {PR_NUMBER} --name-only > /tmp/changed_files.txt

# Check quality on each directory
for dir in $(cat /tmp/changed_files.txt | xargs -n1 dirname | sort -u); do
    .cursor/scripts/code-quality-check.sh "$dir"
done
```

## Large PR? Use Parallel Review

For large PRs (>300 lines, >10 files), use `/parallel-tasks` methodology:

```
/parallel-tasks "Review PR #{NUMBER} comprehensively"

Workers:
- Security Auditor (XSS, auth, data handling)
- Performance Engineer (re-renders, bundle size, API calls)
- Accessibility Expert (ARIA, keyboard nav, screen readers)
- Logic Reviewer (correctness, edge cases, AC compliance)
- Pattern Checker (project conventions, CODING_GUIDELINES)
```

Each worker focuses on ONE concern, producing sharper insights than a single pass.

## Impact-Based Commenting

```markdown
# For CRITICAL issues - Inline Comment

⚠️ **Security Issue**
This exposes user data without authentication check.

**Current:**
const userData = await fetchUser(id);

**Suggested:**
if (!isAuthenticated()) throw new UnauthorizedError();
const userData = await fetchUser(id);

---

# For HIGH issues - Inline Comment (shorter)

Missing error handling for API call. Consider wrapping in try/catch.

---

# For MEDIUM issues - Summary only

Note: A few `useCallback` dependencies could be tightened up.

---

# For LOW issues - Don't mention

(Skip entirely)
```

## Commands Used

```bash
# Fetch PR details
gh pr view {PR_NUMBER} --json title,body,files,additions,deletions,author

# Get PR diff
gh pr diff {PR_NUMBER}

# Post summary comment
gh pr review {PR_NUMBER} --comment --body "## Review Summary\n\n{summary}"

# Post inline comment on specific line
gh api repos/Sixt/com.sixt.web.public/pulls/{PR_NUMBER}/comments \
  -X POST \
  -f body="{comment}" \
  -f path="{file}" \
  -f line={line} \
  -f side="RIGHT"
```

## Output Format

```
📋 Reviewing PR #22990...

## Summary
- **Author**: sanjana-sixt
- **Title**: [CATS-3173] select connector profile for login
- **Files Changed**: 8
- **Lines**: +245 / -12

## Good Practices
✅ Clear flow with documented steps
✅ Proper error handling with try/catch
✅ Type-safe API client design

## Critical Issues Found
1. ⚠️ Missing dependency in useCallback (line 45)
   - getCurrentUser should be in deps array

2. ⚠️ Silent return without feedback (line 30)
   - Caller won't know operation was skipped

## Minor Issues (Skipped)
- 3 naming suggestions
- 2 documentation improvements

## Recommendation
✅ Approve with minor fixes
```

## AI Execution

When user runs `/pr-review {PR_NUMBER}`:

1. **Fetch PR**: Use `gh pr view {PR_NUMBER} --json title,body,files,additions,deletions,author`
2. **Get diff**: Use `gh pr diff {PR_NUMBER}` for changed code
3. **Analyze changes**: Review for critical issues only
4. **Generate summary**: Create structured review summary
5. **Post comment**: Use `gh pr review {PR_NUMBER} --comment --body "..."`
6. **Report**: Show what was posted and any issues found
