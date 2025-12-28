---
description: Fetch PR review comments, apply fixes, reply to reviewers automatically
category: PR Management
aliases: [fix, address-comments]
uses: [code-standards, pr-checklist]
---

# PR Fix - Address Review Comments

Fetch PR review comments, apply fixes, and reply to reviewers.

**Uses:** `/code-standards` for fix patterns, `/pr-checklist` for validation

## Usage

```
/pr-fix {PR_NUMBER}
/pr-fix {PR_NUMBER} "Focus on specific comment"
```

## Examples

```
/pr-fix 23043
/pr-fix 22949 "Fix the ESTree types issue"
```

## What This Does

1. **Fetches all review comments** - General and inline
2. **Summarizes issues** - Grouped by severity
3. **Applies fixes** - Using patterns from `/code-standards`
4. **Validates fixes** - Runs `/pr-checklist` checks
5. **Commits & pushes** - Single commit for all fixes
6. **Replies to each comment** - Confirms resolution

## Commands Used

```bash
# Fetch general comments
gh pr view {PR_NUMBER} --comments

# Fetch inline review comments
gh api repos/Sixt/com.sixt.web.public/pulls/{PR_NUMBER}/comments \
  --jq '.[] | {id: .id, path: .path, line: .line, user: .user.login, body: .body}'

# Fetch review threads
gh api repos/Sixt/com.sixt.web.public/pulls/{PR_NUMBER}/reviews \
  --jq '.[] | {id: .id, state: .state, user: .user.login, body: .body}'

# Reply to comment
gh api repos/Sixt/com.sixt.web.public/pulls/{PR_NUMBER}/comments/{ID}/replies \
  -X POST -f body="✅ Fixed! {explanation}"

# Push fixes
git add -A
git commit -m "Address review feedback

- {what was changed, naturally written}
- {another change}"
git push
```

## Commit Message Guidelines

**AVOID** (looks automated):

-   `fix: address review comments`
-   `refactor: update logic per feedback`
-   `feat(RBW-1234): add new feature`
-   Ticket IDs like `[RBW-3459]` or `CNBE-3008`
-   Conventional commit prefixes (`fix:`, `feat:`, `chore:`, `refactor:`)

**PREFER** (natural, human-written):

-   `Address review feedback`
-   `Prevent duplicate title on mobile bottom sheet`
-   `Use breakpoint hook for responsive tooltip content`
-   `Simplify line item display logic`
-   `Update tooltip behavior for mobile screens`

Write commit messages as if explaining to a colleague what you changed, not following a robotic format.

## Common Fix Patterns (From Real PRs)

### Race Condition in useEffect

```typescript
// Add AbortController cleanup
useEffect(() => {
    const controller = new AbortController();
    fetchData({ signal: controller.signal });
    return () => controller.abort();
}, [deps]);
```

### watch() Performance Issue

```typescript
// Replace methods.watch() with useWatch
const value = useWatch({ name: 'fieldName', control });
```

### Yup Schema Recreated

```typescript
// Memoize the schema
const schema = useMemo(() => yup.object({...}), []);
```

### Component Inside Render

```typescript
// Move outside or use memo
const InfoTrigger = memo(({ onClick }) => ...);
```

### Missing ApiError Type

```typescript
// Use proper error typing
catch (err) {
  const apiError = err as ApiError;
}
```

### useEffect Dependencies

```typescript
// Be specific, not exhaustive
useEffect(() => {
    if (!primaryCondition) return; // Guard first
    doSomething();
}, [primaryCondition]); // Only what triggers the effect
```

## Reply Templates

```markdown
# For code fixes

✅ Fixed! Updated to use ESTree.ImportDeclaration type.

# For clarifications

ℹ️ Good point! Added JSDoc comment explaining the rationale.

# For intentional decisions

💡 This is intentional because {reason}. Added a comment to clarify.

# For deferred items

📌 Created follow-up ticket RBW-XXXX to address this separately.

# For suggestions adopted

👍 Great suggestion! Implemented as recommended.
```

## Output Format

```
📋 Fetching review comments for PR #22949...

## Review Comments Found:

| # | Reviewer | File:Line | Issue | Severity |
|---|----------|-----------|-------|----------|
| 1 | karthick | rules.ts:57 | Use ESTree types | High |
| 2 | karthick | rules.ts:25 | Better JSDoc | Medium |
| 3 | karthick | docs:116 | Remove section | Low |

## Applying Fixes...

✅ #1: Used ESTree.ImportDeclaration type
✅ #2: Added JSDoc with @example annotations
✅ #3: Removed "When not to use" section

## Committing...

✅ Committed: Address review feedback
✅ Pushed to origin

## Replying to Comments...

✅ Replied to comment #1: "Fixed! Updated to use ESTree.ImportDeclaration"
✅ Replied to comment #2: "Fixed! Added comprehensive JSDoc"
✅ Replied to comment #3: "Fixed! Removed the section"

🎉 All review comments addressed!
   PR ready for re-review.
```

## Handling Different Comment Types

### SixtBot Comments

-   Usually automated checks (bundle size, linting)
-   Address underlying issues, no reply needed

### Reviewer Comments (Inline)

-   Code-specific feedback
-   Apply fix, reply with confirmation

### Reviewer Comments (General)

-   Overall suggestions
-   Address in code, reply with summary

### Requested Changes

-   Must be resolved before merge
-   Apply fixes, request re-review

## AI Execution

When user runs `/pr-fix {PR_NUMBER}`:

1. **Fetch comments**: Use `gh api` to get all review comments
2. **Categorize**: Group by severity (blocking, suggestion, nit)
3. **Summarize**: Show table of all comments
4. **Get confirmation**: Ask if user wants to proceed with all fixes
5. **Apply fixes**: Make code changes using `/code-standards` patterns
6. **Validate**: Run `/pr-checklist` checks on modified files
7. **Run quality check**: `.cursor/scripts/code-quality-check.sh {AFFECTED_PATH}`
8. **Commit**: Single commit with all fixes (natural message, no prefixes)
9. **Push**: Push to PR branch
10. **Reply**: Send confirmation reply to each comment
11. **Report**: Show summary of actions taken

**Validation Before Push:**

```bash
# Ensure fixes don't introduce new issues
.cursor/scripts/code-quality-check.sh {AFFECTED_PATH}

# If critical issues found, fix them before pushing
```

## Skipping Comments

Some comments don't need fixes:

-   Questions answered in code
-   Already resolved
-   Out of scope

```
/pr-fix 23043 --skip=2,5
```

## Manual Mode

To review each fix before applying:

```
/pr-fix 23043 --interactive
```

This will show each comment and proposed fix, asking for confirmation.
