---
description: Split large PR into smaller focused PRs based on CODEOWNERS ownership
category: PR Management
aliases: [split, break-pr]
---

# Split PR - Break Large PRs by CODEOWNERS

Split a large PR into smaller, focused PRs based on code ownership.

## Usage

```
/split-pr {PR_NUMBER}
/split-pr {PR_NUMBER} --by=codeowners
/split-pr {PR_NUMBER} --by=feature
/split-pr {PR_NUMBER} --max-lines=200
```

## Parallel Analysis for Split Planning

For complex PRs, this command uses `/parallel-tasks` methodology:

```
┌─────────────────────────────────────────────────────────────┐
│  ANALYSIS WORKERS                                           │
├─────────────────────────────────────────────────────────────┤
│  Worker A: CODEOWNERS Analysis (file → team mapping)        │
│  Worker B: Dependency Graph (what imports what)             │
│  Worker C: Feature Grouping (logical feature boundaries)    │
│  Worker D: Merge Order (what needs to go first)             │
└─────────────────────────────────────────────────────────────┘
```

For very large PRs (>500 lines), run:
`/parallel-tasks "Analyze PR #{NUMBER} for optimal split strategy"`

## When to Split

I'll suggest splitting when:

| Condition           | Threshold               |
| ------------------- | ----------------------- |
| Lines changed       | > 300 lines             |
| Files changed       | > 10 files              |
| Multiple CODEOWNERS | > 2 teams affected      |
| Multiple features   | Unrelated changes mixed |
| Review time         | Estimated > 30 min      |

## How It Works

### Step 1: Analyze PR

```bash
# Get files and changes
gh pr view {PR} --json files,additions,deletions

# Map files to CODEOWNERS
for file in $(gh pr view {PR} --json files --jq '.files[].path'); do
  owner=$(grep "$file" .github/CODEOWNERS | awk '{print $NF}')
  echo "$file → $owner"
done
```

### Step 2: Group by Owner

```
════════════════════════════════════════════════════════════════
  PR #23043 ANALYSIS
════════════════════════════════════════════════════════════════

Total: 450 lines across 12 files

📁 @Sixt/web-booking (3 files, 180 lines)
  - apps/rent-checkout/src/components/PackagesV2.tsx (+80/-20)
  - apps/rent-checkout/src/components/helpers.ts (+60/-10)
  - apps/rent-checkout/src/components/LineItems.tsx (+10/-0)

📁 @Sixt/business-modules (4 files, 150 lines)
  - libraries/sixt/business-modules/src/ProtectionPackageCard.tsx (+50/-20)
  - libraries/sixt/business-modules/src/ProtectionPackageCard.styled.ts (+30/-0)
  - libraries/sixt/business-modules/src/ProtectionPackageCard.types.ts (+20/-0)
  - libraries/sixt/business-modules/src/FeatureList.tsx (+30/-0)

📁 @Sixt/core-oxide (2 files, 60 lines)
  - libraries/core/core-oxide/src/components/Typography.tsx (+40/-10)
  - libraries/core/core-oxide/src/components/Tooltip.tsx (+10/-0)

📁 Shared/Config (3 files, 60 lines)
  - types/index.ts (+20/-0)
  - config/feature-flags.ts (+30/-10)
  - README.md (+10/-0)

════════════════════════════════════════════════════════════════
  RECOMMENDED SPLIT
════════════════════════════════════════════════════════════════

Based on CODEOWNERS, I suggest 3 PRs:

1. PR-A: Core changes (@Sixt/core-oxide)
   - 2 files, 60 lines
   - Should merge first (dependency)

2. PR-B: Business modules (@Sixt/business-modules)
   - 4 files, 150 lines
   - Depends on PR-A

3. PR-C: App integration (@Sixt/web-booking)
   - 3 files, 180 lines
   - Depends on PR-B

4. PR-D: Config & docs (shared)
   - 3 files, 60 lines
   - Can merge independently

Create these PRs? (y/n)
```

### Step 3: Create Split PRs

```bash
# For each group:
1. Create new branch from current
2. Cherry-pick or split commits
3. Create PR with dependency note
4. Link all PRs to original ticket
```

## Split Strategies

### By CODEOWNERS (Default)

```
/split-pr 23043 --by=codeowners
```

Groups files by team ownership.

### By Feature/Component

```
/split-pr 23043 --by=feature
```

Groups by logical feature (e.g., tooltip changes vs. type updates).

### By Max Lines

```
/split-pr 23043 --max-lines=200
```

Splits to keep each PR under 200 lines.

### By Dependency

```
/split-pr 23043 --by=dependency
```

Groups by what needs to merge first (core → library → app).

## Dependency Handling

```
════════════════════════════════════════════════════════════════
  DEPENDENCY CHAIN
════════════════════════════════════════════════════════════════

PR-A (core-oxide) ──────┐
                        ├──→ PR-C (rent-checkout)
PR-B (business-modules)─┘

PR-D (config) ──→ Independent

Merge order: PR-A → PR-B → PR-C (PR-D anytime)
```

## Commands Used

```bash
# Analyze PR
gh pr view {PR} --json files,additions,deletions,commits

# Get CODEOWNERS mapping
cat .github/CODEOWNERS

# Create branch for split
git checkout -b {TICKET}-part-1

# Cherry-pick specific commits
git cherry-pick {COMMIT_SHA}

# Create split PR
gh pr create --draft \
  --title "[{TICKET}] Part 1: Core changes" \
  --body "Part of #{ORIGINAL_PR}..."
```

## AI Execution

When user runs `/split-pr {PR}`:

1. **Analyze**: Get all files and changes
2. **Map**: Match files to CODEOWNERS
3. **Group**: Create logical groupings
4. **Check dependencies**: Determine merge order
5. **Propose**: Show split plan
6. **Confirm**: Get user approval
7. **Execute**: Create branches and PRs
8. **Link**: Connect all PRs to ticket

## Example Output

```
📋 Splitting PR #23043...

Analyzing 12 files, 450 lines...

✅ Split plan created:

| PR | Owner | Files | Lines | Depends On |
|----|-------|-------|-------|------------|
| PR-A | @Sixt/core-oxide | 2 | 60 | - |
| PR-B | @Sixt/business-modules | 4 | 150 | PR-A |
| PR-C | @Sixt/web-booking | 3 | 180 | PR-B |
| PR-D | shared | 3 | 60 | - |

Creating PRs...

✅ Created:
  - #23044: [RBW-3459] Part 1: Core Typography updates
  - #23045: [RBW-3459] Part 2: Business module changes
  - #23046: [RBW-3459] Part 3: App integration
  - #23047: [RBW-3459] Part 4: Config and docs

All PRs linked to RBW-3459
Original PR #23043 converted to tracking issue
```
