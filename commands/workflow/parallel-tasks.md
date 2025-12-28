---
description: '[DEPRECATED] Use Cursor 2.0 multi-agent Composer instead'
category: Workflow Orchestration
aliases: [parallel, multi-task, workers]
deprecated: true
---

# Parallel Tasks - DEPRECATED

> ⚠️ **DEPRECATED**: This command is superseded by Cursor 2.0's native multi-agent Composer.

## Migration Guide

### Old Approach (This Command)

```
/parallel-tasks "Analyze how the codebase evolved"
```

Manual orchestration of sequential "worker" prompts.

### New Approach (Cursor 2.0 Multi-Agent)

1. **Open Composer** (Cmd+I / Ctrl+I)
2. **Enable Multi-Agent Mode** (up to 8 parallel agents)
3. **Describe the goal** naturally
4. **Let Cursor orchestrate** - agents work on git worktrees in parallel

```
Analyze this codebase:
- Agent 1: Architecture and folder structure
- Agent 2: State management patterns
- Agent 3: UI component patterns
- Agent 4: Testing approaches

Synthesize findings when complete.
```

## Benefits of Native Multi-Agent

| Old (This Command)    | New (Multi-Agent)      |
| --------------------- | ---------------------- |
| Sequential execution  | True parallel          |
| Manual orchestration  | Auto-orchestration     |
| Single context window | Isolated contexts      |
| Mental parallelism    | Actual parallelism     |
| Conflict-prone        | Git worktree isolation |

## When to Still Use This

Consider this command pattern when:

-   Cursor multi-agent not available
-   Need explicit control over worker prompts
-   Debugging parallelism issues
-   Teaching the pattern to others

## Original Documentation

For reference, the original parallel-tasks workflow is preserved below:

---

<details>
<summary>Original /parallel-tasks Documentation (Click to Expand)</summary>

### Phase 0: Task Decomposition

Break goal into 4-8 independent subtasks.

### Phase 1: Worker Execution

Run each subtask as focused "worker" prompt.

### Phase 2: Time-Slice Analysis

Optional temporal analysis for large repos.

### Phase 3: Synthesis

Combine worker findings into actionable insights.

### Phase 4: Action Mapping

Convert insights to guidelines and checklists.

</details>

---

## Recommendation

**Use Cursor's native multi-agent Composer for all parallel work.**

If you need the structured worker pattern, consider:

```
/plan-and-budget {GOAL}
```

Then let Cursor's multi-agent handle execution.
