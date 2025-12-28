---
description: Create feature branch from Jira ticket with proper naming convention
category: Jira Integration
aliases: [branch, create-branch]
---

# Jira Branch - Create Feature Branch

Create a feature branch from a Jira ticket.

## Usage

```
/jira-branch {TICKET_ID}
/jira-branch {TICKET_ID} "custom-suffix"
```

## Examples

```
/jira-branch RBW-3459
/jira-branch RBW-3459 "tooltip-fix"
```

## What This Does

1. **Fetches ticket summary** - Gets title for branch name
2. **Sanitizes name** - Creates valid git branch name
3. **Creates branch** - From latest master

## Commands Used

```bash
# Stash any local changes
git stash

# Fetch latest
git fetch origin

# Checkout from master
git checkout origin/master

# Create branch
git checkout -b {TICKET_ID}-{sanitized-summary}
```

## Branch Naming

```
{TICKET_ID}-{short-description}

Examples:
- RBW-3459-display-name-charges
- RBW-3564-eslint-rule-useref
- CATS-3173-connector-profile-login
```

## Output Format

```
📋 Fetching RBW-3459...

Summary: Marketing texts for protection package line items

🌿 Creating branch...
✅ Branch created: RBW-3459-display-name-charges

Current status:
- On branch: RBW-3459-display-name-charges
- Tracking: origin/master
- Clean working tree

Ready to implement!
```

## AI Execution

When user runs `/jira-branch {TICKET_ID}`:

1. **Fetch ticket**: Use `jira issue view {TICKET_ID} --plain | head -5`
2. **Parse summary**: Extract title
3. **Sanitize**: Convert to kebab-case, remove special chars
4. **Stash changes**: Run `git stash` if needed
5. **Create branch**: Run git commands
6. **Confirm**: Show branch name and status
