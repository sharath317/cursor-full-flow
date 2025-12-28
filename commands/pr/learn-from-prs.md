---
description: Analyze org PRs to learn review patterns, common issues, evolve rules
category: AI Self-Improvement
aliases: [learn-prs, org-patterns]
---

# Learn From PRs - Analyze Org Patterns & Evolve

Periodically scan PRs across the organization to learn patterns, common review comments, and evolve local commands.

## Usage

```
/learn-from-prs
/learn-from-prs --since="2 weeks"
/learn-from-prs --team=web-booking
/learn-from-prs --focus=sixtbot
```

## Parallel Analysis Mode

For comprehensive analysis, this command uses `/parallel-tasks` methodology with focused workers:

```
┌─────────────────────────────────────────────────────────────┐
│  PARALLEL WORKERS                                           │
├─────────────────────────────────────────────────────────────┤
│  Worker A: SixtBot Patterns                                 │
│  Worker B: Review Comments                                  │
│  Worker C: Approval Patterns                                │
│  Worker D: Fix Patterns                                     │
│  Worker E: Team Conventions                                 │
└─────────────────────────────────────────────────────────────┘
```

For deep analysis, run: `/parallel-tasks "Analyze PR patterns" --scope "last 50 PRs"`

## What This Analyzes

```
┌─────────────────────────────────────────────────────────────┐
│  DATA SOURCES                                               │
├─────────────────────────────────────────────────────────────┤
│  📊 Recent PRs (merged in last 2 weeks)                     │
│  💬 Review comments (patterns, common feedback)             │
│  🤖 SixtBot comments (linting, bundle size, CI failures)    │
│  ✅ Approved patterns (what gets approved quickly)          │
│  ❌ Rejected patterns (what causes delays)                  │
│  🔄 Fix patterns (how issues get resolved)                  │
└─────────────────────────────────────────────────────────────┘
```

## Commands Used

```bash
# Fetch recent merged PRs
gh pr list --state merged --limit 50 --json number,title,author,mergedAt,files,additions,deletions

# Fetch PR review comments
gh api repos/Sixt/com.sixt.web.public/pulls/{PR}/comments

# Fetch PR reviews
gh api repos/Sixt/com.sixt.web.public/pulls/{PR}/reviews

# Fetch SixtBot comments specifically
gh pr view {PR} --comments | grep -A 20 "sixt-bot\|SixtBot"

# Fetch CI check results
gh pr checks {PR}
```

## Analysis Output

```
════════════════════════════════════════════════════════════════
  📊 PR ANALYSIS REPORT (Last 2 Weeks)
════════════════════════════════════════════════════════════════

Analyzed: 47 merged PRs
Teams: @Sixt/web-booking, @Sixt/business-modules, @Sixt/core-oxide
Period: Dec 9 - Dec 23, 2024

════════════════════════════════════════════════════════════════
  🤖 SIXTBOT PATTERNS
════════════════════════════════════════════════════════════════

Most Common SixtBot Warnings:
┌─────────────────────────────────────────────────────────────┐
│  #  │ Warning Type              │ Count │ Auto-Fixable?     │
├─────┼───────────────────────────┼───────┼───────────────────┤
│  1  │ Bundle size increase      │  23   │ ❌ Review needed  │
│  2  │ Missing test coverage     │  18   │ ❌ Write tests    │
│  3  │ ESLint warnings           │  15   │ ✅ Auto-fix       │
│  4  │ TypeScript strict errors  │  12   │ ⚠️ Manual fix     │
│  5  │ Unused imports            │   8   │ ✅ Auto-fix       │
└─────────────────────────────────────────────────────────────┘

💡 Suggestion: Run `pnpm lint --fix` before commit to avoid 23 SixtBot comments

════════════════════════════════════════════════════════════════
  💬 COMMON REVIEW COMMENTS
════════════════════════════════════════════════════════════════

Top Review Feedback (by frequency):
┌─────────────────────────────────────────────────────────────┐
│  #  │ Feedback Category         │ Count │ Prevention        │
├─────┼───────────────────────────┼───────┼───────────────────┤
│  1  │ Missing error handling    │  14   │ Add try/catch     │
│  2  │ Type safety (use generics)│  11   │ Avoid 'any'       │
│  3  │ useCallback dependencies  │   9   │ Include all deps  │
│  4  │ Hardcoded values          │   7   │ Use constants     │
│  5  │ Missing accessibility     │   6   │ Add ARIA labels   │
│  6  │ Code duplication          │   5   │ Extract helper    │
│  7  │ Performance (re-renders)  │   4   │ Memoize properly  │
└─────────────────────────────────────────────────────────────┘

💡 Adding these to /review-code checklist

════════════════════════════════════════════════════════════════
  ✅ PATTERNS THAT GET QUICK APPROVAL
════════════════════════════════════════════════════════════════

Fast-Track PRs (< 1 day to merge):
- Small changes (< 100 lines): 85% approved same day
- Single CODEOWNER: 78% faster than multi-owner
- Tests included: 2x faster approval
- Clear PR description: 1.5x faster

Patterns in quickly-approved code:
1. Follows existing component structure
2. Uses design system utilities (spacing, color)
3. Includes JSDoc for complex functions
4. Has error boundaries for UI components
5. Uses TypeScript strict patterns

💡 Updating /full-flow to emphasize these patterns

════════════════════════════════════════════════════════════════
  ❌ PATTERNS THAT CAUSE DELAYS
════════════════════════════════════════════════════════════════

Slow PRs (> 3 days to merge):
- Large changes (> 300 lines): Average 4.2 days
- Multiple CODEOWNERS: Average 3.8 days
- No tests: Average 3.5 days (many revision cycles)
- Breaking changes: Average 5.1 days

Common rejection reasons:
1. Missing TypeScript types (any usage)
2. Not following component structure
3. Missing error handling
4. Accessibility issues
5. Bundle size too large

💡 Adding pre-commit checks to /full-flow

════════════════════════════════════════════════════════════════
  🔄 HOW ISSUES GET FIXED
════════════════════════════════════════════════════════════════

Common Fix Patterns:
┌─────────────────────────────────────────────────────────────┐
│ Issue                    │ Common Fix                       │
├──────────────────────────┼──────────────────────────────────┤
│ Missing deps in useEffect│ Add exhaustive-deps             │
│ Type 'any' usage         │ Create proper interface         │
│ Hardcoded strings        │ Move to constants file          │
│ Large component          │ Extract sub-components          │
│ Missing error handling   │ Wrap in try/catch + ErrorBoundary│
│ Bundle size              │ Lazy load with React.lazy()     │
│ Re-render issues         │ useMemo/useCallback             │
└─────────────────────────────────────────────────────────────┘

💡 Adding these fix patterns to /pr-fix suggestions

════════════════════════════════════════════════════════════════
  📈 COMMAND EVOLUTION SUGGESTIONS
════════════════════════════════════════════════════════════════

Based on analysis, I suggest updating:

1. /review-code - Add new checklist items:
   □ Error handling for async operations
   □ TypeScript generics instead of 'any'
   □ useCallback/useEffect dependency check
   □ Accessibility (ARIA labels)

2. /full-flow - Add pre-commit checks:
   □ Run `pnpm lint --fix` automatically
   □ Check bundle size before PR
   □ Validate TypeScript strict mode

3. /pr-fix - Add fix suggestions:
   □ Common patterns for each issue type
   □ Code snippets for quick fixes

4. /split-pr - Lower threshold:
   □ Current: 300 lines
   □ Suggested: 200 lines (faster reviews)

Apply these updates? (y/n for each)
```

## Team-Specific Analysis

```
/learn-from-prs --team=web-booking
```

```
════════════════════════════════════════════════════════════════
  📊 WEB-BOOKING TEAM ANALYSIS
════════════════════════════════════════════════════════════════

Team PRs: 23 (last 2 weeks)
Avg Review Time: 1.8 days
Avg Revisions: 1.3

Top Reviewers:
  @karthickshanmugam0689: 18 reviews (avg 4h response)
  @teammate-1: 12 reviews (avg 8h response)
  @teammate-2: 8 reviews (avg 12h response)

Team-Specific Patterns:
- Prefer styled-components over inline styles
- Use OXTypography for all text
- Always include loading states
- Test edge cases in helpers

💡 Adding team conventions to /project-docs
```

## SixtBot Deep Dive

```
/learn-from-prs --focus=sixtbot
```

```
════════════════════════════════════════════════════════════════
  🤖 SIXTBOT ANALYSIS
════════════════════════════════════════════════════════════════

SixtBot Comments Analyzed: 156

Comment Types:
┌─────────────────────────────────────────────────────────────┐
│ Type                  │ Count │ Action                      │
├───────────────────────┼───────┼─────────────────────────────┤
│ Bundle Size Report    │  47   │ Review if > 5KB increase    │
│ Lint Errors           │  35   │ Run lint --fix before push  │
│ Test Coverage         │  28   │ Add tests for new code      │
│ TypeScript Errors     │  22   │ Fix type issues             │
│ CI Failure            │  15   │ Check build logs            │
│ Security Scan         │   9   │ Address vulnerabilities     │
└─────────────────────────────────────────────────────────────┘

Bundle Size Trends:
  - Average increase: 2.3KB per PR
  - Largest increase: 45KB (lazy loading fixed it)
  - Best practice: Code split large features

Common CI Failures:
  1. Import errors (wrong path)
  2. Type mismatches
  3. Missing dependencies
  4. Test timeouts

💡 Adding pre-push validation to prevent SixtBot warnings
```

## Automatic Evolution

After analysis, I can update commands:

```
════════════════════════════════════════════════════════════════
  🔄 APPLYING LEARNINGS
════════════════════════════════════════════════════════════════

Updating local commands based on analysis:

1. ✅ /review-code
   Added: Error handling check
   Added: TypeScript generics check
   Added: Dependency array check

2. ✅ /full-flow
   Added: Pre-commit lint --fix
   Added: Bundle size check warning

3. ✅ /pr-fix
   Added: Common fix patterns
   Added: Code snippet suggestions

4. ✅ /project-docs
   Added: Team conventions
   Added: SixtBot avoidance tips

5. ✅ /suggest-reviewers
   Updated: Reviewer response times
   Updated: Availability scores

Commands evolved! Run `/self-improve show-learnings` to see all updates.
```

## Scheduling

Run periodically:

```
# Weekly analysis (recommended)
/learn-from-prs --since="1 week"

# Bi-weekly deep dive
/learn-from-prs --since="2 weeks"

# After major releases
/learn-from-prs --since="last release"
```

## What Gets Stored

| Category               | Storage      | Used By               |
| ---------------------- | ------------ | --------------------- |
| Common review comments | Memory       | /review-code, /pr-fix |
| SixtBot patterns       | Memory       | /full-flow pre-checks |
| Fix patterns           | Memory       | /pr-fix suggestions   |
| Reviewer stats         | Memory       | /suggest-reviewers    |
| Team conventions       | project-docs | All commands          |
| Approval patterns      | Memory       | /full-flow validation |

## Privacy Note

-   Only analyzes public PRs in the repo
-   No personal data stored
-   Patterns are aggregated, not individual
-   You control what gets applied
