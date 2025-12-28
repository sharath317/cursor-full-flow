---
description: Create implementation plan with file budget before starting large tasks
category: Planning
aliases: [plan, budget, scope, estimate]
---

# Plan and Budget - Scope Control

Force structured planning with file budget before implementing large tasks. Prevents scope creep.

## Usage

```
/plan-and-budget {GOAL}
/plan-and-budget {JIRA_TICKET}
/plan-and-budget {GOAL} --max-files={N}
```

## Why This Matters

Without planning:

-   ❌ Scope creep (touching 30 files for a "small" change)
-   ❌ Unexpected complexity discovered mid-implementation
-   ❌ Incomplete estimates
-   ❌ Reviewers overwhelmed by large PRs

With plan-and-budget:

-   ✅ Clear file budget upfront
-   ✅ Complexity surfaced early
-   ✅ Accurate estimates
-   ✅ Right-sized PRs

## Output Format

```
════════════════════════════════════════════════════════════════
  IMPLEMENTATION PLAN: {GOAL}
════════════════════════════════════════════════════════════════

📋 GOAL UNDERSTANDING
  Primary: {what needs to be done}
  Secondary: {related improvements if any}
  Out of scope: {explicitly excluded}

📊 FILE BUDGET
  Target: {N} files
  Warning threshold: {N+5} files
  Hard limit: {N+10} files (requires justification)

  ┌─────────────────────────────────────────────────────────┐
  │  ESTIMATED FILE CHANGES                                 │
  ├─────────────────────────────────────────────────────────┤
  │  New files:      2                                      │
  │  Modified files: 5                                      │
  │  Test files:     2                                      │
  │  ─────────────────                                      │
  │  Total:          9 files                                │
  └─────────────────────────────────────────────────────────┘

📁 FILE BREAKDOWN

  ✏️ MODIFICATIONS (5 files)

  │ File                           │ Changes              │ LOC  │
  │--------------------------------│----------------------│------|
  │ ProtectionPackageCard.tsx      │ Add tooltip logic    │ +15  │
  │ LineItems.tsx                  │ Conditional render   │ +8   │
  │ helpers.ts                     │ New helper function  │ +20  │
  │ PackagesV2.tsx                 │ Remove duplicate     │ -12  │
  │ types.ts                       │ Add new interface    │ +5   │

  🆕 NEW FILES (2 files)

  │ File                           │ Purpose              │ LOC  │
  │--------------------------------│----------------------│------|
  │ TooltipTitle.tsx               │ New component        │ ~40  │
  │ TooltipTitle.styled.ts         │ Styles               │ ~20  │

  🧪 TEST FILES (2 files)

  │ File                           │ Coverage             │ LOC  │
  │--------------------------------│----------------------│------|
  │ LineItems.test.tsx             │ Update snapshots     │ +10  │
  │ TooltipTitle.test.tsx          │ New component tests  │ +30  │

⚠️ RISK ASSESSMENT

  │ Risk                           │ Level │ Mitigation           │
  │--------------------------------│-------│----------------------│
  │ Breaking existing tooltips     │ LOW   │ Preserve originalName│
  │ Mobile layout impact           │ MED   │ Test breakpoints     │
  │ Performance (re-renders)       │ LOW   │ Use useOXBreakpoint  │

📅 IMPLEMENTATION ORDER

  Phase 1: Foundation (3 files)
    1. types.ts - Add interface
    2. helpers.ts - Add helper
    3. TooltipTitle.* - New component

  Phase 2: Integration (2 files)
    4. LineItems.tsx - Use new component
    5. ProtectionPackageCard.tsx - Wire up

  Phase 3: Cleanup (2 files)
    6. PackagesV2.tsx - Remove duplicate
    7. Tests - Update all

⏱️ ESTIMATE

  │ Phase     │ Complexity │ Time Est    │
  │-----------|------------|-------------|
  │ Phase 1   │ Low        │ 30 min      │
  │ Phase 2   │ Medium     │ 45 min      │
  │ Phase 3   │ Low        │ 20 min      │
  │ ───────── │ ────────── │ ─────────── │
  │ Total     │            │ ~1.5 hours  │

════════════════════════════════════════════════════════════════

Proceed with this plan? (y/n/adjust)
```

## Budget Enforcement

### During Implementation

If file count approaches budget:

```
⚠️ BUDGET WARNING
━━━━━━━━━━━━━━━━━
Budget: 9 files
Current: 8 files
Remaining: 1 file

You're about to modify: config.ts (not in plan)

Options:
1. Skip this change (stay in budget)
2. Add to plan (increase budget to 10)
3. Replace planned file (swap)

Choice?
```

### If Budget Exceeded

```
🔴 BUDGET EXCEEDED
━━━━━━━━━━━━━━━━━━
Budget: 9 files
Actual: 14 files (+5 over)

This suggests:
- Scope creep occurred
- Initial estimate was wrong
- Task should be split

Recommendation: Split into 2 PRs
  PR 1: Core implementation (9 files)
  PR 2: Extended changes (5 files)

Split now? (y/n)
```

## Adjustment Commands

```
/plan-and-budget --adjust        # Revise current plan
/plan-and-budget --status        # Show progress vs plan
/plan-and-budget --split         # Split into multiple PRs
```

## Integration with Other Commands

| Command         | Integration                                  |
| --------------- | -------------------------------------------- |
| `/full-flow`    | Runs plan-and-budget first for complex tasks |
| `/jira-fetch`   | Uses ticket scope for planning               |
| `/pre-pr-check` | Validates against original plan              |
| `/split-pr`     | Uses plan to determine split points          |

## AI Execution

When user runs `/plan-and-budget {GOAL}`:

### Step 1: Understand Goal

```
1. Parse goal description or fetch ticket
2. Identify core requirements
3. Determine scope boundaries
```

### Step 2: Analyze Codebase

```
1. Find related files
2. Map dependencies
3. Identify touch points
```

### Step 3: Generate Budget

```
1. List all files to touch
2. Estimate LOC changes
3. Assess risks
4. Order by dependency
```

### Step 4: Get Approval

```
Present plan and wait for:
- Approval (proceed)
- Adjustment (revise scope)
- Rejection (rethink approach)
```

### Step 5: Track Progress

```
During implementation:
- Mark files complete
- Track budget
- Warn on deviation
```

## Quick Mode

For smaller tasks:

```
/plan-and-budget {GOAL} --quick
```

Outputs simplified:

```
📋 Quick Plan: {GOAL}

Files to modify: 4
  - ComponentA.tsx (+15 lines)
  - ComponentB.tsx (+8 lines)
  - types.ts (+5 lines)
  - tests (+20 lines)

Est: 45 min
Risk: Low

Proceed? (y/n)
```
