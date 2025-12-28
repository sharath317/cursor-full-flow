---
description: Create recoverable safe-point before risky operations (git stash + state)
category: Context & Analysis
aliases: [save, checkpoint, safeguard]
---

# Snapshot - State Safety Net

Create a recoverable safe-point before risky operations.

**Turns experimentation into reversible exploration.**

## Usage

```
/snapshot
/snapshot "Before refactoring BookingDetails"
/snapshot --restore
/snapshot --list
```

## What This Creates

### 1. Git Snapshot Branch

```bash
# Creates a snapshot branch
git checkout -b snapshot/<timestamp>-<description>
git add -A
git commit -m "SNAPSHOT: <description>"
git checkout -  # Return to original branch
```

### 2. SNAPSHOT.md File

Creates `SNAPSHOT.md` at the project root:

````markdown
# 📸 SNAPSHOT: {timestamp}

## Description

{User-provided description or auto-generated}

## Current State

-   **Branch:** {current_branch}
-   **Commit:** {commit_hash}
-   **Timestamp:** {ISO timestamp}

## Context

-   **Active Goal:** {what user is trying to achieve}
-   **Commands Run:** {recent commands in session}
-   **Files Modified:** {list of uncommitted changes}

## Assumptions

-   {Any assumptions made during the session}
-   {Known limitations or risks}

## Risk Notes

-   {High-churn files being touched}
-   {Stable core files being modified}
-   {Potential breaking changes}

## How to Restore

### Quick Restore

```bash
git stash
git checkout snapshot/{timestamp}
git checkout -b restore-{timestamp}
```
````

### Keep Current + Compare

```bash
git diff snapshot/{timestamp}..HEAD
```

### Full Revert

```bash
git reset --hard snapshot/{timestamp}
```

## What Will Be Lost if Reverted

-   {List of changes since snapshot}
-   {Any new files created}
-   {Modified files}

```

## When to Use

### Auto-Suggested Before:

| Command | Why |
|---------|-----|
| `/refactor-new --churn-aware` | Touching multiple files |
| `/full-flow` on large tickets | Complex multi-step workflow |
| `/migration-plan` execution | Structural changes |
| Modifying high-churn files | History of instability |
| Touching stable core files | Risk of breaking stable code |

### Manually Recommended:

- Before experimental changes
- Before trying alternative approaches
- Before any "let me try something" moments
- When unsure about a direction

## Snapshot Lifecycle

```

┌─────────────────────────────────────────────────────────────┐
│ 1. CREATE SNAPSHOT │
│ - Save current branch state │
│ - Document context and assumptions │
│ - Note risk areas │
└─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ 2. EXPERIMENT FREELY │
│ - Try risky operations │
│ - Make significant changes │
│ - Test alternative approaches │
└─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ 3. EVALUATE OUTCOME │
│ │
│ ✅ Success? ❌ Failed? │
│ - Delete snapshot - Restore snapshot │
│ - Continue with changes - Start fresh │
└─────────────────────────────────────────────────────────────┘

```

## Commands

### Create Snapshot

```

/snapshot "Before refactoring BookingDetails"

```

Output:
```

════════════════════════════════════════════════════════════════
📸 SNAPSHOT CREATED
════════════════════════════════════════════════════════════════

📍 Snapshot ID: snapshot/2024-12-23-1430-before-refactoring
📁 Branch: snapshot/2024-12-23-1430-before-refactoring
📄 File: SNAPSHOT.md

📋 Current State:

-   Branch: RBW-3459-display-name-charges
-   Uncommitted changes: 3 files
-   Last commit: abc1234

⚠️ Risk Areas Captured:

-   BookingDetails.tsx (high churn: 128 commits/6mo)
-   helpers.ts (medium churn: 67 commits/6mo)

🔄 To Restore:
git checkout snapshot/2024-12-23-1430-before-refactoring

You can now experiment safely!

```

### List Snapshots

```

/snapshot --list

```

Output:
```

════════════════════════════════════════════════════════════════
📸 SNAPSHOTS
════════════════════════════════════════════════════════════════

Recent snapshots (last 10):

| ID  | Date             | Description        | Branch   |
| --- | ---------------- | ------------------ | -------- |
| 1   | 2024-12-23 14:30 | Before refactoring | RBW-3459 |
| 2   | 2024-12-22 10:15 | Before migration   | RBW-3400 |
| 3   | 2024-12-20 16:45 | Experimental UI    | RBW-3350 |

To restore: /snapshot --restore 1
To delete: /snapshot --delete 1

```

### Restore Snapshot

```

/snapshot --restore 1

```

Output:
```

════════════════════════════════════════════════════════════════
🔄 RESTORING SNAPSHOT
════════════════════════════════════════════════════════════════

Snapshot: Before refactoring (2024-12-23 14:30)

⚠️ This will:

-   Stash current uncommitted changes
-   Create new branch: restore-2024-12-23-1430
-   Reset to snapshot state

📋 Changes that will be lost:

-   BookingDetails.tsx (+45/-23 lines)
-   helpers.ts (+12/-8 lines)
-   types.ts (+5/-0 lines)

Proceed? (y/n)

```

### Compare with Snapshot

```

/snapshot --diff 1

````

Shows diff between current state and snapshot.

## AI Execution

When user runs `/snapshot`:

### Step 1: Capture Current State

```bash
# Get current branch and commit
BRANCH=$(git branch --show-current)
COMMIT=$(git rev-parse --short HEAD)
TIMESTAMP=$(date +%Y-%m-%d-%H%M)

# Create snapshot branch
git stash --include-untracked
git checkout -b snapshot/${TIMESTAMP}-${DESCRIPTION}
git stash pop
git add -A
git commit -m "SNAPSHOT: ${DESCRIPTION}"
git checkout ${BRANCH}
````

### Step 2: Analyze Risk

```bash
# Check churn of modified files
git diff --name-only | while read file; do
  commits=$(git log --since="6 months ago" --oneline -- "$file" | wc -l)
  echo "$file: $commits commits"
done
```

### Step 3: Generate SNAPSHOT.md

Create comprehensive documentation of current state.

### Step 4: Confirm

Show summary and restoration instructions.

## Integration with Other Commands

| Command           | Integration                                   |
| ----------------- | --------------------------------------------- |
| `/full-flow`      | Auto-suggests snapshot before large tickets   |
| `/refactor-new`   | Auto-suggests snapshot before --churn-aware   |
| `/migration-plan` | Requires snapshot before execution            |
| `/pre-pr-check`   | Warns if no snapshot exists for risky changes |

## Best Practices

1. **Snapshot before, not after** — Create before making changes
2. **Use descriptive names** — "Before X" is better than just timestamp
3. **Clean up old snapshots** — Delete after successful changes
4. **Don't snapshot too often** — One per logical change set

## Cleanup

```bash
# Delete old snapshot branches
git branch -D snapshot/2024-12-20-1645-experimental

# Delete all snapshots older than 7 days
git for-each-ref --format='%(refname:short)' refs/heads/snapshot/ | \
  while read branch; do
    if [[ $(git log -1 --format=%ct $branch) -lt $(date -d '7 days ago' +%s) ]]; then
      git branch -D $branch
    fi
  done
```
