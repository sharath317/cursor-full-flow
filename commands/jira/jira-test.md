---
description: Add "How to Test" instructions as Jira comment with feature link and steps
category: Jira Integration
aliases: [test-instructions, how-to-test]
usedBy: [full-flow]
---

# Jira Test - Add/Update "How to Test" Comments

Add or update "How to Test" instructions on a Jira ticket.

## Usage

```
/jira-test {TICKET_ID}
/jira-test {TICKET_ID} {PR_NUMBER}
/jira-test {TICKET_ID} "Custom testing context"
```

## Examples

```
/jira-test RBW-3459
/jira-test RBW-3459 23043
/jira-test RBW-3564 "Focus on ESLint rule detection"
```

## What This Does

1. **Fetches ticket details** - Summary, description, acceptance criteria
2. **Fetches PR details** (if provided) - Files changed, branch name
3. **Generates test steps** - Based on AC and code changes
4. **Posts comment** - Formatted "How to Test" on Jira

## Template

```markdown
**How to Test:**

**Branch:** `{BRANCH_NAME}`
**Feature Link:** https://internal-com.sixt.io/?rentcheckout_version={BRANCH_NAME}
**PR:** https://github.com/Sixt/com.sixt.web.public/pull/{PR_NUMBER}

---

**1. Access the Feature:**

-   Open the feature link above
-   {Additional setup if needed}

**2. Navigate to Feature Area:**

-   {Where to find the feature in the UI}

**3. Verify Expected Behavior:**

-   {Step-by-step verification}
-   {Expected outcomes}

**4. Edge Cases:**

-   {Fallback scenarios}
-   {Error states}

**5. Verification Checklist:**

-   [ ] {Checkbox items from AC}
```

## Commands Used

```bash
# Fetch ticket
jira issue view {TICKET_ID} --plain

# Fetch PR details
gh pr view {PR_NUMBER} --json title,body,headRefName,files

# Add comment
jira issue comment add {TICKET_ID} "{COMMENT_BODY}"
```

## AI Execution

When user runs `/jira-test {TICKET_ID}`:

1. **Fetch ticket**: Use `jira issue view {TICKET_ID} --plain`
2. **Parse AC**: Extract acceptance criteria from description
3. **Find PR** (if not provided): Search for PR with ticket ID in title
4. **Fetch PR details**: Use `gh pr view {PR_NUMBER} --json headRefName,files`
5. **Generate steps**: Create test instructions from AC and changes
6. **Post comment**: Use `jira issue comment add {TICKET_ID} "..."`
7. **Confirm**: Show posted content

## Example Output

```
📋 Generating test instructions for RBW-3564...

Found PR #22949: [RBW-3564] Add ESLint rule for useRef
Branch: RBW-3564-eslint-rule
Files: 5 changed

📝 Posting comment to Jira...

✅ Test instructions added to RBW-3564:

**How to Test:**

**Branch:** `RBW-3564-eslint-rule`
**Feature Link:** https://internal-com.sixt.io/?rentcheckout_version=RBW-3564-eslint-rule
**PR:** https://github.com/Sixt/com.sixt.web.public/pull/22949

---

**1. Setup:**
- Checkout branch: `git checkout RBW-3564-eslint-rule`
- Install dependencies: `pnpm install`

**2. Test Rule Detection:**
- Run: `pnpm eslint apps/rent-checkout/src/**/*.tsx`
- Verify: Rule warns on improper useRef usage

...
```
