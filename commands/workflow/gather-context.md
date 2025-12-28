---
description: Analyze Jira ticket, Figma designs, codebase patterns before implementation
category: Context & Analysis
aliases: [context, analyze, requirements]
uses: [figma-read, project-docs, code-standards]
usedBy: [full-flow]
---

# Gather Context - Comprehensive Requirements Gathering

Collect all relevant information before implementation from multiple sources.

**Uses:** `/figma-read`, `/project-docs`, `/code-standards`
**Used by:** `/full-flow` (Phase 1)

## Usage

```
/gather-context {TICKET_ID}
/gather-context {TICKET_ID} "Focus on tooltip changes"
/gather-context {TICKET_ID} --diff    # Show only what's different from similar tickets
/gather-context {TICKET_ID} --minimal # Essentials only, skip boilerplate
```

## Diff-Aware Mode

Use `--diff` to reduce information overload on repetitive tasks:

```
/gather-context RBW-3459 --diff
```

### How Diff-Awareness Works

```
════════════════════════════════════════════════════════════════
  DIFF-AWARE CONTEXT: RBW-3459
════════════════════════════════════════════════════════════════

🔍 Found 3 similar tickets (same component, last 30 days):
   - RBW-3400: Display name for extras
   - RBW-3380: Tooltip behavior update
   - RBW-3355: Line item formatting

📊 CONTEXT COMPARISON

✅ SAME AS PREVIOUS (skipping details):
   - Affected component: ProtectionPackageCard
   - Owner: @Sixt/web-booking
   - Patterns: getModifiedLineItems, OXTypography
   - Test structure: Same as RBW-3400

🆕 NEW/DIFFERENT (highlighted):
   - AC Item #3: "Tooltip title uses originalName" ← NEW
   - Backend dependency: CNBE-3008 (not in previous tickets)
   - Figma: Updated tooltip design (differs from RBW-3380)

⚠️ CHANGED SINCE LAST SIMILAR TICKET:
   - helpers.ts: Modified in PR #22800 (may affect your work)
   - PackagesV2.tsx: Refactored since RBW-3400

════════════════════════════════════════════════════════════════
  FOCUSED CONTEXT (Only What's New)
════════════════════════════════════════════════════════════════

🆕 New Backend Field:
   display_name: string | null (from CNBE-3008)

🆕 New Figma Updates:
   Tooltip title: copyMediumHeavy (was copyMedium)

🆕 New AC Items:
   □ Tooltip shows original name as title (NEW)

Full context available with: /gather-context RBW-3459 --full
```

### Diff Detection Logic

| Category  | How Similarity is Detected  |
| --------- | --------------------------- |
| Component | Same files/folders affected |
| Pattern   | Same helper functions used  |
| AC        | Text similarity > 70%       |
| Design    | Same Figma components       |
| Timeline  | Within 30 days              |

## Parallel Context Gathering

This command internally uses `/parallel-tasks` methodology for comprehensive context:

```
┌─────────────────────────────────────────────────────────────┐
│  PARALLEL WORKERS                                           │
├─────────────────────────────────────────────────────────────┤
│  Worker A: Jira Analysis (ticket, AC, comments, links)      │
│  Worker B: Design Resources (Figma, Confluence)             │
│  Worker C: Codebase Analysis (patterns, types, tests)       │
│  Worker D: Recent Activity (PRs, git history, conflicts)    │
└─────────────────────────────────────────────────────────────┘
```

For complex tickets with many dependencies, run:
`/parallel-tasks "Gather all context for {TICKET}" --scope "related systems"`

## Documentation Referenced

Before implementation, I check these project docs:

| Doc                    | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| `.cursor/rules/*.mdc`  | Component-specific rules, props, patterns |
| `CODING_GUIDELINES.md` | Project conventions                       |
| `testing/patterns/`    | Test structure and patterns               |
| `.github/CODEOWNERS`   | File ownership                            |

See `/project-docs` for full reference.

## What This Gathers

```
┌─────────────────────────────────────────────────────────────┐
│  SOURCE 1: JIRA TICKET                                      │
├─────────────────────────────────────────────────────────────┤
│  • Summary and description                                  │
│  • Acceptance criteria (parsed as checklist)                │
│  • Labels and components                                    │
│  • Linked issues (blocks, blocked by, relates to)           │
│  • Comments (latest 5)                                      │
│  • Attachments (images, documents)                          │
│  • Sprint and priority                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  SOURCE 2: LINKED RESOURCES                                 │
├─────────────────────────────────────────────────────────────┤
│  • Figma links (extract from description/comments)          │
│  • Confluence links (design docs, specs)                    │
│  • Backend PRs/tickets (CNBE-*, CATS-*)                     │
│  • Related frontend tickets                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  SOURCE 3: CODEBASE ANALYSIS                                │
├─────────────────────────────────────────────────────────────┤
│  • CODEOWNERS for affected areas                            │
│  • Existing patterns in related components                  │
│  • Type definitions that might be affected                  │
│  • Test files to update                                     │
│  • Related stories/Storybook files                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  SOURCE 4: RECENT CONTEXT                                   │
├─────────────────────────────────────────────────────────────┤
│  • Recent PRs in affected files                             │
│  • Git history for related components                       │
│  • Open PRs that might conflict                             │
└─────────────────────────────────────────────────────────────┘
```

## Commands Used

### Jira Ticket

```bash
# Full ticket details
jira issue view {TICKET_ID} --plain

# Get comments
jira issue view {TICKET_ID} --comments 5

# Get linked issues
jira issue link {TICKET_ID}
```

### Linked Resources

```bash
# Fetch Figma (if URL found in ticket)
.cursor/scripts/fetch-context.sh figma {FIGMA_URL}

# Fetch Confluence (if URL found)
.cursor/scripts/fetch-context.sh confluence {CONFLUENCE_URL}

# View related backend ticket
jira issue view {BACKEND_TICKET} --plain
```

### Codebase Analysis

```bash
# Find affected code owners
grep -r "{COMPONENT}" .github/CODEOWNERS

# Search for related patterns
grep -r "{KEYWORD}" --include="*.tsx" apps/ libraries/

# Find related types
grep -r "interface.*{KEYWORD}" --include="*.ts"

# Find related tests
find . -name "*.test.tsx" -exec grep -l "{COMPONENT}" {} \;
```

### Recent Context

```bash
# Recent PRs touching affected files
gh pr list --search "{FILE_PATH}" --state all --limit 5

# Git history
git log --oneline -10 -- {FILE_PATH}

# Open PRs that might conflict
gh pr list --state open --json files,title | jq '.[] | select(.files[].path | contains("{COMPONENT}"))'
```

## Output Format

```
📋 Gathering context for RBW-3459...

════════════════════════════════════════════════════════════════
  JIRA TICKET
════════════════════════════════════════════════════════════════

📌 Summary: Marketing texts for protection package line items
📊 Type: Story | Priority: High | Sprint: Sprint 42

📝 Description:
Use backend display_name field for protection line item charges.
When display_name is provided by backend, show it as the line item
name. The original name should still appear in tooltip titles.

✅ Acceptance Criteria:
  □ Display name shown in line items when available
  □ Tooltip shows original name as title
  □ Fallback to original name when display_name missing
  □ Works in both frictionless and non-frictionless flows

🔗 Linked Issues:
  - Blocks: RBW-3460 (Frontend cleanup)
  - Related: CNBE-3008 (Backend: Add display_name field)

💬 Recent Comments:
  @backend-dev: "display_name field deployed to staging"
  @designer: "Figma updated with tooltip behavior"

════════════════════════════════════════════════════════════════
  LINKED RESOURCES
════════════════════════════════════════════════════════════════

🎨 Figma Designs Found:
  - Protection Packages: figma.com/file/ABC/Design?node-id=123
    └── Tooltip Component (320x auto)
    └── Title: copyMediumHeavy, Description: copyMedium23

📄 Confluence Docs Found:
  - API Spec: sixt-cloud.atlassian.net/wiki/spaces/CNBE/pages/456

🔧 Backend Context (CNBE-3008):
  - New field: display_name in ChargeCode response
  - Optional field, fallback to name if missing

════════════════════════════════════════════════════════════════
  CODEBASE ANALYSIS
════════════════════════════════════════════════════════════════

📁 Affected Components:
  - ProtectionPackageCard (libraries/sixt/business-modules)
    └── Owner: @Sixt/web-booking
  - PackagesV2 (apps/rent-checkout)
    └── Owner: @Sixt/web-booking
  - helpers.ts (FrictionlessFunnel)
    └── Owner: @Sixt/web-booking

🔍 Existing Patterns Found:
  - getModifiedLineItems() already handles Statsig overrides
  - LineItemInfoWithOriginalName type exists
  - TooltipTitle styled component pattern in InfoButton

📝 Types to Update:
  - ILineItemInfo (add display_name?: string)
  - IChargeCode (add originalName?: string)

🧪 Tests to Update:
  - LineItems.test.tsx
  - helpers.test.ts (if exists)

════════════════════════════════════════════════════════════════
  RECENT CONTEXT
════════════════════════════════════════════════════════════════

📜 Recent PRs in Affected Files:
  - #22800: Refactor ProtectionPackageCard (merged 3 days ago)
  - #22750: Add Statsig content overrides (merged 1 week ago)

⚠️ Open PRs That Might Conflict:
  - #22900: Update tooltip styling (@other-dev) - REVIEW

📊 Git Activity:
  - Last modified: 3 days ago by @teammate
  - 5 commits in past month

════════════════════════════════════════════════════════════════
  IMPLEMENTATION PLAN
════════════════════════════════════════════════════════════════

Based on gathered context, here's the recommended approach:

1. **Update Types** (ProtectionPackageCard.types.ts)
   - Add display_name to ILineItemInfo
   - Export LineItemInfoWithOriginalName

2. **Update Helpers** (helpers.ts)
   - Modify getModifiedLineItems to check display_name first
   - Preserve originalName for tooltip

3. **Update Components** (LineItems.tsx)
   - Use TooltipTitle pattern for originalName
   - Pass originalName to getInfoButtonContent

4. **Update PackagesV2** (PackagesV2.tsx)
   - Reuse getModifiedLineItems (avoid duplication)

Proceed with implementation? (y/n)
```

## Clarification Checkpoint

After gathering context, I run a sufficiency check:

```
════════════════════════════════════════════════════════════════
  INFORMATION CHECK
════════════════════════════════════════════════════════════════

Requirements:
  ✅ Acceptance criteria: Clear (3 items)
  ⚠️ Edge cases: Assuming empty string = missing
  ✅ Design: Found Figma link
  ✅ Backend: CNBE-3008 defines display_name field

Technical:
  ✅ Files to modify: 4 identified
  ✅ Patterns found: getModifiedLineItems, TooltipTitle
  ✅ Dependencies: None blocking

Docs Referenced:
  ✅ Component rules: ProtectionPackageCard follows standard structure
  ✅ Styling: Using spacing(), color() utilities
  ✅ Typography: Using OXTypography for TooltipTitle

════════════════════════════════════════════════════════════════
```

### If Information is Insufficient:

```
❓ CLARIFICATION NEEDED

Before proceeding, I need some information:

### 1. Edge Case Handling
**Question:** What should happen when display_name is empty string?
**Options:**
- A) Treat as missing, use original name
- B) Show empty string
**My recommendation:** Option A

### 2. Test Coverage
**Question:** Should I add unit tests for helpers.ts?
**Options:**
- A) Yes, add comprehensive tests
- B) Skip (matches current state)
**My recommendation:** Option A if time permits

---
Please provide answers, or say "proceed with recommendations".
```

See `/ask-clarification` for full guidelines on when to ask.

## AI Execution

When user runs `/gather-context {TICKET_ID}`:

### Step 1: Fetch Jira

```bash
jira issue view {TICKET_ID} --plain
jira issue view {TICKET_ID} --comments 5
```

### Step 2: Parse Content

-   Extract URLs (Figma, Confluence, related tickets)
-   Parse acceptance criteria into checklist
-   Identify keywords for codebase search

### Step 3: Fetch Linked Resources

```bash
# For each Figma URL found
.cursor/scripts/fetch-context.sh figma {URL}

# For each Confluence URL found
.cursor/scripts/fetch-context.sh confluence {URL}

# For each linked ticket
jira issue view {LINKED_TICKET} --plain | head -20
```

### Step 4: Analyze Codebase

```bash
# Search for component mentions
grep -r "{KEYWORDS}" --include="*.tsx" apps/ libraries/

# Check CODEOWNERS
grep "{COMPONENT_PATH}" .github/CODEOWNERS

# Find related types
grep -rn "interface.*{KEYWORD}" --include="*.ts" | head -10
```

### Step 5: Check Recent Activity

```bash
# Recent PRs
gh pr list --search "{FILE}" --state merged --limit 5

# Open PRs in same area
gh pr list --state open --json files,title,number
```

### Step 6: Generate Implementation Plan

-   Based on patterns found
-   Respecting existing conventions
-   Identifying files to modify

### Step 7: Present Summary

-   Formatted output with all gathered info
-   Clear implementation plan
-   Ask for confirmation to proceed
