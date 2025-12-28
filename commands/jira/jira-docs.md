---
description: Create Confluence documentation page from Jira ticket and PR changes
category: Jira Integration
aliases: [docs, confluence, create-docs]
---

# Jira Docs - Create Confluence Documentation

Create feature documentation on Confluence from a Jira ticket and PR.

## Usage

```
/jira-docs {TICKET_ID} {PR_NUMBER}
/jira-docs {TICKET_ID} {PR_NUMBER} "Custom title"
```

## Examples

```
/jira-docs RBW-3459 23043
/jira-docs RBW-3459 23043 "Protection Package Display Names"
```

## What This Does

1. **Fetches ticket** - Description, AC
2. **Fetches PR** - Changes, files
3. **Generates documentation** - Using template
4. **Creates Confluence page** - Under RBW folder

## Documentation Template

```html
<h2>Overview</h2>
<p><strong>Jira:</strong> <a href="{JIRA_URL}">{TICKET_ID}</a></p>
<p><strong>PR:</strong> <a href="{PR_URL}">#{PR_NUMBER}</a></p>

<h2>Feature Summary</h2>
<p>{Description from ticket}</p>

<h2>Acceptance Criteria</h2>
<ul>
    <li>{AC items}</li>
</ul>

<h2>Technical Overview</h2>
<p>{High-level implementation notes}</p>

<h2>Testing</h2>
<p>{Testing instructions}</p>

<h2>Related Links</h2>
<ul>
    <li><a href="{FIGMA_URL}">Figma Design</a></li>
    <li><a href="{CONFLUENCE_URL}">Related Docs</a></li>
</ul>
```

## Commands Used

```bash
# Create page
.cursor/scripts/fetch-context.sh create-page \
  "{SPACE_KEY}" \
  "{PARENT_ID}" \
  "{TITLE}" \
  "{CONTENT}"

# Update page
.cursor/scripts/fetch-context.sh update-page \
  "{PAGE_ID}" \
  "{NEW_CONTENT}"
```

## Target Folder

Default: `https://sixt-cloud.atlassian.net/wiki/spaces/RBW/folder/875134978`

-   Space Key: `RBW`
-   Parent ID: `875134978`

## AI Execution

When user runs `/jira-docs {TICKET_ID} {PR_NUMBER}`:

1. **Fetch ticket**: Use `jira issue view {TICKET_ID} --plain`
2. **Fetch PR**: Use `gh pr view {PR_NUMBER} --json title,body,files`
3. **Generate content**: Create documentation from template
4. **Create page**: Use fetch-context.sh script
5. **Confirm**: Show page URL

## Example Output

```
📋 Creating documentation for RBW-3459...

Fetching ticket details...
✅ Summary: Marketing texts for protection package line items

Fetching PR #23043...
✅ Files changed: 6

Generating documentation...
✅ Content generated

Creating Confluence page...
✅ Page created: https://sixt-cloud.atlassian.net/wiki/spaces/RBW/pages/875167748

Documentation includes:
- Overview with links
- Feature summary
- Acceptance criteria
- Technical overview
- Testing instructions
```
