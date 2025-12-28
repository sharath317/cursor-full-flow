---
description: Break large Jira story into smaller, actionable sub-tasks with estimates
category: Jira Integration
aliases: [breakdown, split-story, subtasks]
---

# Jira Breakdown - Break Story into Sub-tasks

Break down a large story into smaller, actionable sub-tasks.

## Usage

```
/jira-breakdown {STORY_ID}
/jira-breakdown {STORY_ID} "Additional context"
```

## Examples

```
/jira-breakdown RBW-3459
/jira-breakdown RBW-3459 "Focus on frontend changes only"
```

## Parallel Task Methodology

This command uses the same decomposition logic as `/parallel-tasks` Phase 0:

```
Rules for good sub-task breakdown:
- Each sub-task must be self-contained
- No sub-task should block another (minimize dependencies)
- Prefer breakdown by dimension (file, concern, layer)
- Target 4-8 sub-tasks for optimal reviewability
- Avoid overlap between sub-tasks
```

For complex stories, consider running:
`/parallel-tasks "Analyze {STORY} requirements"` first to understand all dimensions.

## What This Does

1. **Fetches story** - Description, AC, scope
2. **Analyzes requirements** - Identifies distinct tasks (using parallel-tasks Phase 0 logic)
3. **Proposes sub-tasks** - With titles and estimates
4. **Creates sub-tasks** - After confirmation

## Sub-task Template

```
Title: {Short action description}
Description: {What needs to be done}
Estimate: XS/S/M/L
```

## Commands Used

```bash
# Fetch story
jira issue view {STORY_ID} --plain

# Create sub-task
jira issue create \
  --project {PROJECT} \
  --type "Sub-task" \
  --parent {STORY_ID} \
  --summary "{TITLE}" \
  --body "{DESCRIPTION}"

# Link sub-tasks (automatic with parent)
```

## Estimation Guide

| Size | Hours | Description                    |
| ---- | ----- | ------------------------------ |
| XS   | < 2h  | Simple change, single file     |
| S    | 2-4h  | Small feature, few files       |
| M    | 4-8h  | Medium feature, multiple files |
| L    | 1-2d  | Large feature, complex logic   |

## AI Execution

When user runs `/jira-breakdown {STORY_ID}`:

1. **Fetch story**: Use `jira issue view {STORY_ID} --plain`
2. **Analyze scope**: Parse description, AC, context
3. **Propose breakdown**: List sub-tasks with estimates
4. **Get confirmation**: Ask user to approve/modify
5. **Create sub-tasks**: Use `jira issue create --parent ...`
6. **Confirm**: Show created sub-task IDs

## Example Output

```
📋 Analyzing story RBW-3459...

Story: Marketing texts for protection package line items
Description: Use backend display_name field...

## Proposed Sub-tasks:

| # | Title | Est. |
|---|-------|------|
| 1 | Update getModifiedLineItems to prefer display_name | S |
| 2 | Update getChargeCodeListFromPackages helper | S |
| 3 | Add tooltip title support with originalName | S |
| 4 | Add styled TooltipTitle component | XS |
| 5 | Update types for LineItemInfoWithOriginalName | XS |

Create these sub-tasks under RBW-3459? (y/n)

User: y

✅ Created 5 sub-tasks:
- RBW-3459-1: Update getModifiedLineItems to prefer display_name
- RBW-3459-2: Update getChargeCodeListFromPackages helper
- RBW-3459-3: Add tooltip title support with originalName
- RBW-3459-4: Add styled TooltipTitle component
- RBW-3459-5: Update types for LineItemInfoWithOriginalName

All linked to parent story RBW-3459
```
