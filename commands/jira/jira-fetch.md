---
description: Fetch Jira ticket details - summary, description, AC, comments, linked issues
category: Jira Integration
aliases: [jira, ticket, fetch-ticket]
---

# Jira Fetch - Fetch and Parse Ticket

Fetch a Jira ticket and display parsed information.

## Usage

```
/jira-fetch {TICKET_ID}
```

## Examples

```
/jira-fetch RBW-3459
/jira-fetch CATS-3173
```

## What This Does

1. **Fetches ticket** - Full details from Jira
2. **Parses content** - Extracts key fields
3. **Displays summary** - Formatted for quick review

## Commands Used

```bash
# Fetch ticket details
jira issue view {TICKET_ID} --plain

# Get comments
jira issue view {TICKET_ID} --comments 5
```

## Output Format

```
📋 Ticket: RBW-3459

## Summary
Marketing texts for protection package line items via Backend endpoint

## Status
In Review

## Type
Story

## Description
Use backend display_name field for protection line item charges...

## Acceptance Criteria
- [ ] Display name shown when available
- [ ] Tooltip shows original name as title
- [ ] Fallback to original name when missing

## Linked Issues
- Blocks: RBW-3460
- Related: CNBE-3008

## Comments (Latest)
- @john.doe: PR raised: https://github.com/...
```

## AI Execution

When user runs `/jira-fetch {TICKET_ID}`:

1. **Fetch ticket**: Run `jira issue view {TICKET_ID} --plain`
2. **Parse fields**: Extract summary, description, AC, links
3. **Fetch comments**: Run `jira issue view {TICKET_ID} --comments 3`
4. **Display**: Show formatted summary
5. **Offer actions**: "Would you like to create a branch, update AC, or add test instructions?"
