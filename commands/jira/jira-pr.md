---
description: Create/update PR with Jira ticket info, proper title, and description template
category: Jira Integration
aliases: [create-pr, pr-create]
usedBy: [full-flow]
---

# Jira PR - Create/Update PR

Create or update a PR from a Jira ticket.

## Usage

```
/jira-pr {TICKET_ID}
/jira-pr {TICKET_ID} --update {PR_NUMBER}
```

## Examples

```
/jira-pr RBW-3459
/jira-pr RBW-3459 --update 23043
```

## What This Does

1. **Fetches ticket** - Summary, description for PR body
2. **Creates draft PR** - With Sixt template format
3. **Adds labels** - Based on files changed
4. **Updates Jira** - Adds PR link comment

## PR Template (Sixt Format)

```markdown
# Ticket

**JIRA:** https://sixt-cloud.atlassian.net/browse/{TICKET_ID}

**Feature link:** https://internal-com.sixt.io/?rentcheckout_version={BRANCH_NAME}

# Type of Change

-   [ ] Bug fix
-   [x] New feature
-   [ ] Other

# Additional Info

## Summary

{Description from Jira}

## Changes

-   {File}: {change description}

## Testing

-   [ ] Manual testing completed
-   [ ] Unit tests added/updated
```

## Commands Used

```bash
# Create draft PR
gh pr create --draft \
  --title "[{TICKET_ID}] {Summary}" \
  --body "{PR_BODY}" \
  --label "needs-code-review"

# Update existing PR
gh pr edit {PR_NUMBER} --body "{NEW_BODY}"
gh pr edit {PR_NUMBER} --title "[{TICKET_ID}] {New Title}"

# Add labels
gh pr edit {PR_NUMBER} --add-label "library,size/m"

# Add Jira comment
jira issue comment add {TICKET_ID} "PR raised: {PR_URL}"
```

## Labels

| Change Type           | Label     |
| --------------------- | --------- |
| Changes to libraries/ | `library` |
| Changes to apps/      | `app`     |
| < 50 lines            | `size/s`  |
| 50-200 lines          | `size/m`  |
| > 200 lines           | `size/l`  |

## AI Execution

When user runs `/jira-pr {TICKET_ID}`:

1. **Fetch ticket**: Use `jira issue view {TICKET_ID} --plain`
2. **Get branch**: Run `git branch --show-current`
3. **Push if needed**: Run `git push -u origin HEAD`
4. **Create PR**: Use `gh pr create --draft ...`
5. **Add labels**: Based on files changed
6. **Update Jira**: Add PR link comment
7. **Confirm**: Show PR URL
