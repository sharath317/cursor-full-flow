---
description: Daily engineering context snapshot with GitHub, Jira, Slack, and calendar integration
category: Buddy OS
aliases: [buddy-snapshot, daily, context]
---

# Buddy - Daily Engineering Context

Get a comprehensive snapshot of your engineering context across all connected systems.

## Usage

```
/buddy
/buddy {specific_context}
```

## Examples

```
/buddy
/buddy pr-context
/buddy jira-context
/buddy team-context
```

## What You Get

### 📋 Jira Context
- Active tickets assigned to you
- Recently updated tickets
- Blocked tickets needing attention
- Sprint progress

### 🐙 GitHub Context
- Open PRs requiring your review
- PRs you authored (status, CI, review comments)
- Recent commits and branches
- Repository activity

### 💬 Slack Context
- @mentions in the last 24 hours
- Important channel messages
- Team announcements
- Direct messages requiring response

### 📅 Calendar Context
- Today's meetings and remaining focus time
- Meeting load analysis
- Recommended coding windows
- Conflicts and overlaps

### 📊 Engineering Metrics
- Code churn in your active files
- High-impact files you're working on
- Technical debt hotspots
- Test coverage gaps

## Smart Prioritization

Buddy automatically prioritizes what needs your attention:

```
🔴 URGENT (0-2 hours)
  - PR with merge conflicts
  - Blocker ticket in current sprint
  - @mention from tech lead

🟡 TODAY (2-8 hours)
  - PR review requested 2 days ago
  - Ticket with unclear acceptance criteria
  - Scheduled 1:1 in 3 hours

🟢 THIS WEEK
  - Stale branch cleanup
  - Documentation updates
  - Refactoring suggestions
```

## Smart Context Detection

Buddy intelligently filters your context to show only relevant work:

### Branch-Jira Cross-Reference
- **Detects merged branches:** Checks if current branch is merged but not deleted locally
- **Matches with Jira:** Correlates branch names (e.g., `RBW-3609-*`) with ticket status
- **Suggests cleanup:** Recommends switching to master/main if on merged branch
- **Filters completed work:** Excludes Done/Closed tickets even if branch exists

### Example Smart Detection
```
Current Branch: RBW-3609-updates-refs-usage
Jira Status: Done ✓
PR Status: Merged ✓
→ Suggestion: Switch to master and delete local branch
```

### Auto-Cleanup Detection
Buddy detects these situations and suggests actions:

| Situation | Detection | Suggestion |
|-----------|-----------|------------|
| On merged branch | Branch exists locally, not on origin | Switch to master, delete branch |
| Ticket closed, branch exists | Jira status = Done, local branch exists | Clean up local branch |
| Branch far behind | 50+ commits behind master | Rebase or delete if inactive |
| Stale branches | No commits in 30+ days | Archive or delete |
| Won't fix tickets | Jira status = Won't fix | Close PRs, delete branches |

## Context Warmup

When you run `/buddy`, it pre-fetches relevant context for your current work:

- Related tickets for current feature
- Similar patterns in codebase
- Recent discussions in relevant channels
- Figma designs linked to tickets

### Smart Context Analysis

Buddy performs intelligent analysis to show only relevant work:

#### 1. Jira Context Analysis
```typescript
// Filters applied:
- status != "Done" AND status != "Closed"
- assignee = currentUser()
- ORDER BY updated DESC

// Cross-reference with Git:
- If current branch matches ticket (e.g., RBW-3609-*)
- Check if ticket is Done but branch still exists
- Suggest cleanup if mismatch detected
```

#### 2. Git Context Analysis
```typescript
// Checks performed:
- Is current branch on origin? (merged detection)
- How many commits behind master?
- Last commit date (stale detection)
- Branch name pattern (ticket reference extraction)

// Smart filtering:
- Extract ticket ID from branch name (e.g., RBW-3609)
- Query Jira for ticket status
- If ticket Done + branch merged → suggest cleanup
- If ticket active + branch exists → show as active work
```

#### 3. Context Correlation
```typescript
// Buddy correlates:
Jira Ticket Status ↔ Git Branch ↔ Modified Files

Example:
RBW-3526 (In Progress) ↔ Local branch exists ↔ Recently modified files
  → Show as active work ✓

RBW-3609 (Done) ↔ Branch deleted ↔ No recent changes
  → Exclude from context ✓

RBW-3609 (Done) ↔ Branch still exists ↔ Recent commits
  → Show cleanup suggestion ⚠️
```

## Filtering Options

```
/buddy pr         # Only GitHub PRs
/buddy jira       # Only Jira tickets
/buddy slack      # Only Slack messages
/buddy calendar   # Only calendar events
/buddy team       # Team-wide context
```

## MCP Requirements

Buddy uses these MCP integrations (gracefully degrades if unavailable):

| MCP | Purpose | Fallback |
|-----|---------|----------|
| 🐙 GitHub | PR status, reviews | Git log only |
| 📋 Jira | Tickets, sprints | Manual fetch |
| 💬 Slack | Team messages | None |
| 📅 Calendar | Meeting load | None |

## Jira API Usage

**IMPORTANT**: This command uses the correct Jira REST API v3 endpoints:

- Use `/rest/api/3/search/jql` for JQL searches (NOT `/rest/api/3/search`)
- Always include proper JQL query parameters
- Set `maxResults` to limit token costs
- Use `jq` parameter to filter response fields

Example API calls:
```typescript
// ✅ CORRECT - Use /search/jql endpoint
mcp_jira_jira_get({
  path: "/rest/api/3/search/jql",
  queryParams: {
    jql: "assignee=currentUser() AND status != Done ORDER BY updated DESC",
    maxResults: "5",
    fields: "summary,status,priority,updated"
  },
  jq: "issues[*].{key: key, summary: fields.summary, status: fields.status.name}"
})

// ❌ WRONG - Don't use deprecated /search endpoint
mcp_jira_jira_get({
  path: "/rest/api/3/search",  // This endpoint is removed!
  queryParams: { jql: "..." }
})
```

## Role-Based Output

Output adapts to your role:

**SDE1/SDE2:**
- Focus on assigned tasks
- Code review checklist
- Learning opportunities

**SDE3/Senior:**
- + Cross-team dependencies
- + Architectural decisions
- + Mentoring opportunities

**Staff/Principal:**
- + Org-wide initiatives
- + Technical strategy
- + Team health signals

## Privacy & Security

- All data stays local (MCP connections are direct)
- No cloud storage or third-party services
- Audit trail in `.cursor/buddy/audit.log`
- Configurable data retention
- API tokens stored securely in environment variables

## Configuration

Located in `.cursor/buddy/state.json`:

```json
{
  "role": "Staff_Engineer",
  "autonomy": "L3-L4",
  "mcps": ["github", "jira", "slack", "calendar"],
  "jira": {
    "host": "https://sixt-cloud.atlassian.net",
    "useJqlEndpoint": true,
    "maxResults": 10,
    "fields": ["summary", "status", "priority", "updated", "assignee"]
  },
  "filters": {
    "maxPRs": 10,
    "maxTickets": 5,
    "slackHoursBack": 24
  }
}
```

## Troubleshooting

### MCP Connection Issues
```bash
# Verify correct package is installed
npx -y @aashari/mcp-server-atlassian-jira --version

# Reinstall if needed
npm cache clean --force
npx -y @aashari/mcp-server-atlassian-jira
```

### API Endpoint Errors (410 Gone)
This means you're using the deprecated `/rest/api/3/search` endpoint.
**Fix**: Always use `/rest/api/3/search/jql` for JQL searches.

### 401 Unauthorized Errors
```bash
# Check your Jira API token
echo $JIRA_API_TOKEN

# Generate new token at:
# https://id.atlassian.com/manage-profile/security/api-tokens

# Update in your MCP config
```

### 404 Not Found Errors
- Ticket may not exist (check ticket number)
- You may lack permissions to view the ticket
- Ticket may be in a different Jira project

### Missing Context
```bash
# Check MCP configuration
cat ~/.cursor/mcp.json

# Verify environment variables
env | grep JIRA

# Test Jira connection
curl -u "your-email@sixt.com:$JIRA_API_TOKEN" \
  "https://sixt-cloud.atlassian.net/rest/api/3/myself"
```

### Slow Response
```bash
# Reduce scope
/buddy pr              # Only PRs
/buddy jira            # Only Jira

# Reduce maxResults in queries
# Add jq filters to minimize response size
```

### Showing Completed Work?

**Issue:** Buddy shows a ticket that's already Done/Merged (like RBW-3609)

**Why this happens:**
- ✅ **Jira correctly filters out Done tickets** - Not shown in Jira context
- ⚠️ **Git still shows the branch** - You're checked out on it locally
- ⚠️ **Recent commits appear** - Branch wasn't cleaned up after merge

**The root cause:** Your local Git doesn't know the PR was merged and the ticket is done.

**Solution:**
```bash
# 1. Switch to master and pull latest
git checkout master
git pull origin master

# 2. Delete the merged branch
git branch -d BRANCH-NAME
# Example: git branch -d RBW-3609-updates-refs-usage-rbw-v2

# 3. Run /buddy again - now you'll see only active work!
```

**Prevention:** After merging a PR, always:
1. ✅ Switch back to master: `git checkout master`
2. ✅ Pull latest changes: `git pull origin master`
3. ✅ Delete local branch: `git branch -d BRANCH-NAME`
4. ✅ Update Jira ticket to Done

**Auto-cleanup script:**
```bash
# Add to ~/.zshrc for automatic cleanup of merged branches
alias cleanup-merged='git checkout master && git pull && git branch --merged | grep -v "\*" | grep -v "master" | grep -v "main" | xargs -n 1 git branch -d'

# Usage after merging PRs:
cleanup-merged
```

**Verification:**
```bash
# Check current branch
git branch --show-current  # Should show: master

# List local branches
git branch -vv | head -10

# Verify Jira status
curl -s -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "$JIRA_HOST/rest/api/3/issue/RBW-XXXX" | \
  grep -o '"status":{"[^}]*"name":"[^"]*"' | \
  cut -d'"' -f8
# Should show: Done
```

### Stale Branches Showing?

**Issue:** Many old branches (30+ days) appear in context

**Solution:**
```bash
# List branches sorted by last commit date
git for-each-ref --sort=-committerdate refs/heads/ \
  --format='%(refname:short)|%(committerdate:relative)' | \
  head -20 | column -t -s '|'

# Delete specific old branch
git branch -D BRANCH-NAME

# CAREFUL: Delete all branches older than 30 days (review list first!)
git for-each-ref --sort=-committerdate refs/heads/ \
  --format='%(refname:short)|%(committerdate:iso)' | \
  awk -F'|' -v cutoff="$(date -v-30d '+%Y-%m-%d')" \
  '$2 < cutoff {print $1}' | \
  xargs -n 1 echo "git branch -D"  # Remove 'echo' when ready to delete
```

### Won't Fix Tickets Showing?

**Issue:** Tickets marked "Won't fix" still appear

These are filtered from Jira context but may show in Git if branches exist.

**Solution:**
```bash
# Find branches for Won't fix tickets
# (Assuming branch name format: TICKET-NUMBER-*)

# Delete the branch
git branch -D BRANCH-NAME

# Close any open PRs on GitHub
# Update Jira ticket to Won't fix
```

## Setup Instructions

1. **Install Jira MCP Server** (if not already installed):
```bash
npx -y @aashari/mcp-server-atlassian-jira
```

2. **Generate Jira API Token**:
   - Go to https://id.atlassian.com/manage-profile/security/api-tokens
   - Click "Create API token"
   - Save the token securely

3. **Configure Environment**:
```bash
# Add to your shell profile (~/.zshrc or ~/.bashrc)
export JIRA_HOST="https://sixt-cloud.atlassian.net"
export JIRA_EMAIL="your-email@sixt.com"
export JIRA_API_TOKEN="your-token-here"
```

4. **Update Cursor MCP Config**:
Create/update `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "@aashari/mcp-server-atlassian-jira"]
    }
  }
}
```

5. **Restart Cursor** to load the new MCP configuration.

## Related Commands

- `/buddy ideas` - Get improvement suggestions
- `/buddy plan` - Generate task breakdown
- `/buddy review` - Code review current changes
- `/full-flow` - Complete ticket workflow

---

**Tip:** Run `/buddy` at the start of your day to get oriented, then run `/full-flow` to start working on your highest priority ticket!

## Known Issues

- ⚠️ Some tickets may return 404 errors if you don't have access permissions
- ⚠️ The MCP server logs show Chinese error messages from Jira - this is normal for the sixt-cloud instance
- ⚠️ API tokens need periodic renewal (usually every 90 days - set a calendar reminder!)
- ⚠️ Merged branches may still show in context until you clean them up locally (see "Showing Completed Work?" in Troubleshooting)
