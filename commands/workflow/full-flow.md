---
description: Complete Jira ticket → implementation → PR → merge workflow with auto state detection
category: Workflow Orchestration
aliases: [flow, ticket-flow, e2e]
---

# Full Flow - End-to-End Development Workflow

Complete workflow from Jira ticket to merged PR with all automation steps.

## Usage

```
/full-flow {TICKET_ID}
/full-flow {TICKET_ID} "Additional context"
```

## Examples

```
/full-flow RBW-3459
/full-flow RBW-3459 "Focus on tooltip implementation"
```

## Complex Ticket? Use Parallel Analysis

For complex tickets with multiple concerns, run `/parallel-tasks` before implementation:

```
/parallel-tasks "Implement {TICKET_ID} requirements"

Workers:
- Requirements Analysis (AC breakdown, edge cases)
- Codebase Impact (affected files, dependencies)
- Design Integration (Figma mapping, component selection)
- Testing Strategy (what to test, edge cases)
```

This provides comprehensive analysis before coding begins.

## Automatic State Detection

When running `/full-flow` multiple times, I automatically detect what's already done:

```bash
# State checks performed automatically
┌─────────────────────────────────────────────────────────────┐
│  STATE DETECTION                                            │
├─────────────────────────────────────────────────────────────┤
│  ✅ Branch exists: RBW-3459-display-name-charges           │
│  ✅ Has commits: 3 commits ahead of master                  │
│  ✅ PR exists: #23043 (draft)                               │
│  ⏳ PR status: Changes requested                            │
│  ❌ How to Test: Not found in Jira comments                 │
└─────────────────────────────────────────────────────────────┘

Skipping: Phase 1 (branch), Phase 4 (PR creation)
Resuming from: Phase 6 (PR feedback) + Phase 5 (test instructions)
```

### State Check Commands

```bash
# 1. Check if branch exists for ticket
git branch -a | grep -i "{TICKET_ID}"

# 2. Check current branch
git branch --show-current

# 3. Check commits ahead of master
git rev-list --count origin/master..HEAD

# 4. Check if PR exists
gh pr list --head "$(git branch --show-current)" --json number,state,title

# 5. Check PR status (draft, open, merged, closed)
gh pr view --json state,reviewDecision,isDraft

# 6. Check if "How to Test" comment exists
jira issue view {TICKET_ID} --comments 10 | grep -i "how to test"

# 7. Check for pending review comments
gh api repos/Sixt/com.sixt.web.public/pulls/{PR}/reviews \
  --jq '[.[] | select(.state == "CHANGES_REQUESTED")] | length'
```

### State → Action Mapping

| State Detected                    | Action                               |
| --------------------------------- | ------------------------------------ |
| No branch for ticket              | Create branch, start from Phase 1    |
| Branch exists, no commits         | Resume at Phase 2 (implementation)   |
| Branch exists, has commits, no PR | Resume at Phase 4 (create PR)        |
| PR exists (draft)                 | Check if needs updates, then Phase 5 |
| PR exists (changes requested)     | Resume at Phase 6 (fix comments)     |
| PR exists (approved)              | Just show status, ready to merge     |
| PR merged                         | Show completion summary              |
| How to Test missing               | Add it (Phase 5)                     |
| Everything complete               | Show final status only               |

## Complete Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: GATHER CONTEXT (Enhanced)                         │
├─────────────────────────────────────────────────────────────┤
│  1. Fetch Jira ticket (summary, description, AC, comments)  │
│  2. Parse linked resources (Figma, Confluence, backend PRs) │
│  3. Analyze codebase (patterns, types, CODEOWNERS)          │
│  4. Check recent activity (PRs, git history, conflicts)     │
│  5. Generate implementation plan                            │
│  6. Create feature branch                                   │
│  7. Confirm understanding with user                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: IMPLEMENTATION                                    │
├─────────────────────────────────────────────────────────────┤
│  5. Search codebase for relevant patterns                   │
│  6. Implement required changes                              │
│  7. Run local validation (compile, lint)                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: SELF-REVIEW                                       │
├─────────────────────────────────────────────────────────────┤
│  8. Run /review checklist                                   │
│  9. Fix any issues found                                    │
│  10. Re-validate until clean                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 4: COMMIT & PR                                       │
├─────────────────────────────────────────────────────────────┤
│  11. Commit changes with proper message                     │
│  12. Push to origin                                         │
│  13. Create draft PR with Sixt template                     │
│  14. Add appropriate labels                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 5: DOCUMENTATION                                     │
├─────────────────────────────────────────────────────────────┤
│  15. Generate "How to Test" instructions                    │
│  16. Add test instructions to Jira as comment               │
│  17. Add PR link to Jira                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 6: PR FEEDBACK (On-demand)                           │
├─────────────────────────────────────────────────────────────┤
│  18. Fetch PR review comments                               │
│  19. Apply fixes for each comment                           │
│  20. Reply to reviewers confirming fixes                    │
│  21. Push updated changes                                   │
└─────────────────────────────────────────────────────────────┘
```

## Phase Details

### Phase 1: Gather Context (Enhanced)

See `/gather-context` for full details. Here's what gets collected:

**Step 1: Jira Ticket**

```bash
jira issue view {TICKET_ID} --plain
jira issue view {TICKET_ID} --comments 5
```

**Step 2: Linked Resources**

-   Extract Figma/Confluence URLs from description
-   Fetch design details: `.cursor/scripts/fetch-context.sh figma {URL}`
-   Fetch backend ticket context if linked

**Step 3: Codebase Analysis**

```bash
# Find affected components
grep -r "{KEYWORDS}" --include="*.tsx" apps/ libraries/

# Check ownership
grep "{COMPONENT}" .github/CODEOWNERS

# Find existing patterns
grep -rn "getModifiedLineItems\|TooltipTitle" --include="*.ts*"
```

**Step 4: Recent Activity**

```bash
# Recent PRs in affected files
gh pr list --search "{FILE}" --state merged --limit 5

# Open PRs that might conflict
gh pr list --state open --json files,title
```

**Step 5: Generate Plan & Create Branch**

```bash
git stash && git fetch origin
git checkout origin/master
git checkout -b {TICKET_ID}-{summary}
```

**Output:**

```
════════════════════════════════════════════════════════════════
  CONTEXT GATHERED FOR RBW-3459
════════════════════════════════════════════════════════════════

📋 JIRA TICKET
  Summary: Marketing texts for protection package line items
  Type: Story | Priority: High

✅ ACCEPTANCE CRITERIA
  □ Display name shown when available
  □ Tooltip shows original name as title
  □ Fallback to original name when missing

🎨 FIGMA DESIGN
  - Tooltip Component found (320x auto)
  - Title: copyMediumHeavy, Description: copyMedium23

🔧 BACKEND CONTEXT (CNBE-3008)
  - New field: display_name (optional)

📁 AFFECTED FILES
  - ProtectionPackageCard/LineItems.tsx (@Sixt/web-booking)
  - FrictionlessFunnel/helpers.ts (@Sixt/web-booking)
  - PackagesV2.tsx (@Sixt/web-booking)

🔍 EXISTING PATTERNS
  - getModifiedLineItems() in helpers.ts
  - TooltipTitle styled component pattern
  - LineItemInfoWithOriginalName type

📜 RECENT ACTIVITY
  - #22800: Refactor ProtectionPackageCard (merged 3d ago)
  - No conflicting open PRs

════════════════════════════════════════════════════════════════
  IMPLEMENTATION PLAN
════════════════════════════════════════════════════════════════

1. Update types (add display_name, originalName)
2. Update helpers.ts (prefer display_name)
3. Update LineItems.tsx (use TooltipTitle)
4. Update PackagesV2.tsx (reuse helpers)

🌿 Branch created: RBW-3459-display-name-charges

Proceed with implementation? (y/n)
```

### Phase 2: Implementation

**Before coding, I apply `/code-standards` rules:**

```bash
# Check component size limits from /code-standards
# < 150 LOC, < 20 imports, < 4 useState, < 3 useEffect, < 8 hooks

# Component-specific rules
cat .cursor/rules/{ComponentName}-rules.mdc

# General structure rules (always applied)
# - Component file organization
# - Styling guidelines
# - Typography rules
# - Form component dependencies

# Coding guidelines
cat CODING_GUIDELINES.md | head -100
```

**During implementation (enforcing `/code-standards`):**

1. **Search for existing patterns** in codebase
2. **Follow component rules** from `.cursor/rules/`
3. **Use design system utilities** (spacing, color, rem, borderRadius)
4. **Match existing code style** in the file
5. **Check component size** before finishing (see `/code-standards`)
6. **Run validation**: `pnpm --filter @sixt-web/{PACKAGE} compile`

**Size Check During Implementation:**
If component exceeds warning limits from `/code-standards`:

-   Split into sub-components immediately
-   Extract hooks for complex logic
-   Use composition over monolithic design

**If stuck or uncertain:**

```
❓ NEED CLARIFICATION

I'm implementing the tooltip title but found two patterns:

1. InfoButton.tsx uses inline Typography with marginBottom
2. FeatureList uses styled component

Which pattern should I follow for consistency?
```

See `/ask-clarification` for when to ask vs. proceed.

### Phase 3: Self-Review

Run `/pr-checklist` for comprehensive review. Key checks:

**From `/pr-checklist` - Size & Complexity:**

-   [ ] No file exceeds 300 lines (warning at 150)
-   [ ] No component has > 6 useState (warning at 4)
-   [ ] No component has > 5 useEffect (warning at 3)
-   [ ] No file has > 35 imports (warning at 20)

**From `/pr-checklist` - Hooks Quality:**

-   [ ] useEffect has cleanup for async ops (AbortController)
-   [ ] Uses useWatch instead of watch()
-   [ ] Yup schemas memoized with useMemo
-   [ ] No components defined inside render functions

**From `/pr-checklist` - Styling:**

-   [ ] Uses design tokens exclusively (spacing, color)
-   [ ] Responsive styles use OXBiggerThan
-   [ ] No font-size in styled components

**From `/code-standards` - Structure:**

-   [ ] Follows feature folder structure
-   [ ] Styled components use namespace import (\* as S)
-   [ ] Single responsibility per hook

**Standard Checks:**

-   [ ] Code does what AC says
-   [ ] Edge cases handled
-   [ ] Error handling with ApiError type
-   [ ] Semantic HTML + ARIA labels
-   [ ] No hardcoded secrets

**Run script for automated check:**

```bash
.cursor/scripts/code-quality-check.sh {AFFECTED_PATH}
```

### Phase 4: Commit & PR

```bash
# Commit
git add -A
git commit -m "feat({TICKET_ID}): {summary}

- {change 1}
- {change 2}"

# Push
git push -u origin HEAD

# Create PR
gh pr create --draft \
  --title "[{TICKET_ID}] {Summary}" \
  --body "{PR_BODY}" \
  --label "needs-code-review"
```

### Phase 5: Documentation

```bash
# Add "How to Test" to Jira
jira issue comment add {TICKET_ID} '**How to Test:**

**Branch:** `{BRANCH}`
**Feature Link:** https://internal-com.sixt.io/?rentcheckout_version={BRANCH}
**PR:** {PR_URL}

---

1. **Access the Feature:**
   - Open the feature link above

2. **Navigate to Feature Area:**
   - {Location in UI}

3. **Verify Expected Behavior:**
   - {Verification steps from AC}

4. **Edge Cases:**
   - {Fallback scenarios}'

# Add PR link
jira issue comment add {TICKET_ID} "PR raised: {PR_URL}"
```

### Phase 6: PR Feedback

```bash
# Fetch comments
gh pr view {PR_NUMBER} --comments
gh api repos/Sixt/com.sixt.web.public/pulls/{PR_NUMBER}/comments

# After fixing, reply to each comment
gh api repos/Sixt/com.sixt.web.public/pulls/{PR_NUMBER}/comments/{ID}/replies \
  -X POST -f body="✅ Fixed! {explanation}"

# Push fixes
git add -A
git commit -m "fix: address review comments"
git push
```

## Quick Commands During Flow

| Situation                  | Command                                   |
| -------------------------- | ----------------------------------------- |
| Need to fetch ticket again | `/jira-fetch RBW-3459`                    |
| Create PR only             | `/jira-pr RBW-3459`                       |
| Add test instructions only | `/jira-test RBW-3459`                     |
| Address PR comments        | `/pr-fix 23043`                           |
| Review another PR          | `/pr-review 22990`                        |
| Check code quality         | `/code-standards`                         |
| Run PR checklist           | `/pr-checklist 23043`                     |
| Check size limits          | `.cursor/scripts/code-quality-check.sh .` |
| See refactor plan          | `/migration-plan`                         |

## AI Execution

When user runs `/full-flow {TICKET_ID}`:

### Step 0: Detect Current State (Always First)

```bash
# Run all state checks
BRANCH=$(git branch -a | grep -i "{TICKET_ID}" | head -1)
CURRENT_BRANCH=$(git branch --show-current)
COMMITS_AHEAD=$(git rev-list --count origin/master..HEAD 2>/dev/null || echo "0")
PR_EXISTS=$(gh pr list --head "$CURRENT_BRANCH" --json number --jq '.[0].number' 2>/dev/null)
PR_STATE=$(gh pr view --json state,isDraft,reviewDecision 2>/dev/null)
HOW_TO_TEST=$(jira issue view {TICKET_ID} --comments 10 2>/dev/null | grep -i "how to test")
```

### State-Based Flow

```
IF no branch exists for ticket:
  → Start from Phase 1 (full flow)

ELSE IF on ticket branch but no commits:
  → Skip Phase 1, start Phase 2 (implementation)

ELSE IF has commits but no PR:
  → Skip Phase 1-2, start Phase 4 (create PR)

ELSE IF PR exists and is draft:
  → Check if "How to Test" exists
  → If missing, add it (Phase 5)
  → Show status, ask what to do next

ELSE IF PR has "changes requested":
  → Fetch review comments
  → Start Phase 6 (fix comments)

ELSE IF PR is approved:
  → Show "Ready to merge!" status
  → Offer to add any missing docs

ELSE IF PR is merged:
  → Show completion summary
  → Offer to create Confluence docs
```

### Example Output (Re-run Detection)

```
📋 Running /full-flow RBW-3459...

════════════════════════════════════════════════════════════════
  STATE DETECTION
════════════════════════════════════════════════════════════════

Checking existing progress...

  Branch:        ✅ RBW-3459-display-name-charges (current)
  Commits:       ✅ 3 commits ahead of master
  PR:            ✅ #23043 (draft)
  PR Status:     ⚠️ Changes requested (2 comments)
  How to Test:   ❌ Not found in Jira comments
  Confluence:    ❌ No documentation created

════════════════════════════════════════════════════════════════
  RECOMMENDED ACTIONS
════════════════════════════════════════════════════════════════

Based on current state, I will:

  1. ⏭️ Skip: Branch creation (already exists)
  2. ⏭️ Skip: Implementation (commits exist)
  3. ⏭️ Skip: PR creation (PR #23043 exists)
  4. 🔧 Do: Address 2 review comments
  5. 📝 Do: Add "How to Test" to Jira

Proceed? (y/n)
```

### Automatic Steps (No Confirmation Needed)

1. State detection
2. Fetch Jira ticket (for context)
3. Determine what's already done

### Confirmation Required

4. **Before skipping phases**: Show what will be skipped and why
5. **Before implementation**: Show plan, ask to proceed
6. **Before addressing comments**: Show comments, ask to proceed

### On-Demand (User Requests)

7. "create docs" → Create Confluence documentation
8. "force restart" → Ignore state, start from Phase 1
9. "just add tests" → Only add "How to Test" comment

## Status Indicators

```
📋 Phase 1: Gather Context
   ✅ Fetched Jira ticket: RBW-3459
   ✅ Found Figma design: Tooltip Component
   ✅ Analyzed codebase: 3 affected files
   ✅ Checked recent PRs: No conflicts
   ✅ Generated implementation plan
   ✅ Created branch: RBW-3459-display-name-charges

🛠️ Phase 2: Implementation
   ✅ Found patterns in: ProtectionPackageCard
   ✅ Modified: 3 files
   ✅ Compiled successfully

🔍 Phase 3: Review
   ✅ Functionality: Pass
   ✅ Code Quality: Pass
   ✅ Accessibility: Pass
   ⚠️ Security: 1 warning (addressed)
   ✅ Performance: Pass

📤 Phase 4: Commit & PR
   ✅ Committed: feat(RBW-3459): add display name support
   ✅ Pushed to origin
   ✅ PR created: #23043

📝 Phase 5: Documentation
   ✅ Test instructions added to Jira
   ✅ PR link added to Jira

🎉 Ready for review!
   PR: https://github.com/Sixt/com.sixt.web.public/pull/23043
   Jira: https://sixt-cloud.atlassian.net/browse/RBW-3459
```

## Resuming Flow

### Automatic Resume (Default)

Just run the command again - state is auto-detected:

```
/full-flow RBW-3459
```

I'll automatically detect what's done and resume from the right phase.

### Force Options

```
/full-flow RBW-3459 --force-restart    # Ignore state, start fresh
/full-flow RBW-3459 --skip-to=4        # Jump to Phase 4 (PR creation)
/full-flow RBW-3459 --only=5           # Only run Phase 5 (documentation)
```

### Individual Commands (Manual Control)

| Command                    | When to Use                  |
| -------------------------- | ---------------------------- |
| `/jira-fetch RBW-3459`     | Just view ticket details     |
| `/gather-context RBW-3459` | Re-analyze requirements      |
| `/jira-branch RBW-3459`    | Create branch only           |
| `/jira-pr RBW-3459`        | Create/update PR only        |
| `/jira-test RBW-3459`      | Add "How to Test" only       |
| `/pr-fix 23043`            | Address review comments only |
| `/pr-review 22990`         | Review someone else's PR     |

### State Persistence

I detect state from:

-   **Git**: Branch existence, commits, current branch
-   **GitHub**: PR existence, status, review comments
-   **Jira**: Comments (How to Test), linked issues

No local state files needed - everything is derived from actual state!
