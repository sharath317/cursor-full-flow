# 🔄 Cursor Full-Flow

> End-to-End Development Workflow for Cursor IDE - Jira to PR Automation

[![npm version](https://badge.fury.io/js/cursor-full-flow.svg)](https://www.npmjs.com/package/cursor-full-flow)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Install

```bash
npx cursor-full-flow
```

One command installs 22 workflow commands for complete Jira → Code → PR automation.

## What is Full-Flow?

Full-Flow transforms Cursor into a **Ticket-to-PR Automation System**. It provides:

- **State Detection** - Knows what's already done (branch exists? PR created? Tests added?)
- **Parallel Context Gathering** - Fetches Jira, Figma, codebase patterns simultaneously
- **Budget Enforcement** - Prevents scope creep with file budgets
- **Smart PR Management** - Auto-descriptions, review checklists, comment fixing

## 📦 Command Bundles

| Bundle | Commands | Use Case |
|--------|----------|----------|
| **Minimal** | 5 | Core workflow only |
| **Standard** | 11 | + Jira integration |
| **Complete** | 22 | + PR + Analysis tools |

## 🔧 Commands Reference

### 🔄 Workflow (Core)

| Command | Description |
|---------|-------------|
| `/full-flow RBW-1234` | Complete Jira → PR workflow with auto-resume |
| `/gather-context RBW-1234` | Collect all requirements before coding |
| `/plan-and-budget` | Create implementation plan with file budget |
| `/snapshot` | Create safe-point before risky changes |
| `/parallel-tasks` | Run multiple analysis tasks simultaneously |

### 📋 Jira Integration

| Command | Description |
|---------|-------------|
| `/jira-fetch RBW-1234` | Fetch ticket with AC, comments, links |
| `/jira-branch RBW-1234` | Create properly named feature branch |
| `/jira-pr RBW-1234` | Create PR with Jira context |
| `/jira-test RBW-1234` | Add "How to Test" instructions |
| `/jira-docs RBW-1234` | Create Confluence documentation |
| `/jira-breakdown RBW-1234` | Break complex ticket into subtasks |

### 🔍 PR Management

| Command | Description |
|---------|-------------|
| `/pr-review 12345` | AI-powered PR review |
| `/pr-fix 12345` | Address review comments |
| `/pr-checklist 12345` | Comprehensive quality checklist |
| `/pre-pr-check` | Validate before creating PR |
| `/split-pr` | Split large PR into smaller ones |
| `/create-pr-description` | Generate PR description |
| `/learn-from-prs` | Learn patterns from merged PRs |

### 📈 Analysis

| Command | Description |
|---------|-------------|
| `/churn-map` | Find high-churn files needing attention |
| `/migration-plan` | Plan large-scale migrations |
| `/refactor` | Guided refactoring workflow |
| `/refactor-new` | Churn-aware refactoring |

## 🔌 MCP Integration

Full-Flow works best with these MCPs configured:

| MCP | Purpose | Required |
|-----|---------|----------|
| 🐙 **GitHub** | PR management, CI status | ✅ Yes |
| 📋 **Jira** | Ticket context, comments | ✅ Yes |
| 💬 **Slack** | Team notifications | Optional |
| 📅 **Calendar** | Meeting awareness | Optional |

The installer guides you through MCP setup with step-by-step instructions.

## 💡 Example Workflow

```bash
# 1. Start with a ticket
/full-flow RBW-3459

# Full-Flow automatically:
# ✅ Fetches Jira ticket (summary, AC, comments)
# ✅ Extracts Figma links and backend context
# ✅ Analyzes codebase for patterns
# ✅ Creates implementation plan
# ✅ Creates feature branch
# ✅ Implements with quality checks
# ✅ Creates PR with template
# ✅ Adds "How to Test" to Jira

# 2. Resume anytime - state is auto-detected
/full-flow RBW-3459
# → Detects: "PR exists, 2 review comments pending"
# → Offers to address comments
```

## 🔄 State Detection

When you run `/full-flow` multiple times, it auto-detects:

| State | Action |
|-------|--------|
| No branch | Start from Phase 1 |
| Branch exists, no commits | Resume at implementation |
| Has commits, no PR | Create PR |
| PR exists (draft) | Check for missing docs |
| PR has changes requested | Fix review comments |
| PR approved | Ready to merge! |
| PR merged | Show completion summary |

## 📂 Installation Structure

After installation:

```
.cursor/
└── commands/
    ├── full-flow.md
    ├── gather-context.md
    ├── jira-fetch.md
    ├── pr-review.md
    └── ... (22 total)
```

## 🛠️ CLI Commands

```bash
npx cursor-full-flow              # Interactive install
npx cursor-full-flow --bundle complete -y  # Non-interactive
npx cursor-full-flow status       # Check installation
npx cursor-full-flow list         # List all commands
npx cursor-full-flow help         # Show help
```

## 🤝 Works With

- [Buddy OS](https://github.com/sharath317/buddy-os) - Role-aware autonomous agent
- [cursor.directory](https://cursor.directory) - Community rules

## 📄 License

MIT © Sharath Chandra

---

**Made for developers who want their IDE to handle the boring stuff.**

## 🤝 Buddy Integration

Full-Flow now includes the enhanced `/buddy` command with **Smart Detection**:

```bash
# Get daily context snapshot
/buddy

# Smart detection identifies:
- Completed tickets still showing in Git context
- Merged branches needing cleanup
- Stale branches (30+ days)
- Mismatches between Jira status and Git state
```

The `/buddy` command provides cleanup suggestions automatically:
- Switch to master and delete merged branches
- Archive stale branches
- Close old PRs

See `commands/buddy.md` for full documentation.

