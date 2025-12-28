---
description: Analyze git history to find high-churn files, hotspots, technical debt interest, and refactor candidates
category: Context & Analysis
aliases: [churn, hotspots, change-analysis, tech-debt]
---

# Churn Map - Analyze File Change Patterns

Analyze file churn to identify hotspots, stable cores, **technical debt interest rate**, and refactor candidates.

**Make refactoring discussions data-driven, not emotional.**

## Usage

```
/churn-map {PATH}
/churn-map {PATH} --last=6mo
/churn-map {PATH} --compare=3mo,6mo,12mo    # Show trends
/churn-map {PATH} --debt-rate               # Technical debt interest analysis
/churn-map --repo                           # Full repo analysis
```

## Examples

```
/churn-map apps/rent-checkout
/churn-map libraries/sixt/business-modules --last=3mo
/churn-map apps/rent-checkout/src/components --compare=3mo,6mo
```

## What This Produces

```
════════════════════════════════════════════════════════════════
  CHURN MAP: apps/rent-checkout (Last 6 Months)
════════════════════════════════════════════════════════════════

📊 SUMMARY
  Total files analyzed: 234
  Total commits: 1,847
  Unique authors: 23
  Average commits/file: 7.9

════════════════════════════════════════════════════════════════
  🔴 HIGH CHURN (Top 10 Hotspots)
════════════════════════════════════════════════════════════════

| Rank | File | Commits | Authors | Churn Score |
|------|------|---------|---------|-------------|
| 1 | MainWithBooking.tsx | 145 | 12 | 🔥 Critical |
| 2 | BookingDetails.tsx | 128 | 8 | 🔥 Critical |
| 3 | PackagesV2.tsx | 89 | 6 | 🔥 Critical |
| 4 | helpers.ts | 67 | 5 | ⚠️ High |
| 5 | useCheckoutState.ts | 54 | 7 | ⚠️ High |
| 6 | PaymentForm.tsx | 48 | 4 | ⚠️ High |
| 7 | ProtectionPackageCard.tsx | 42 | 5 | ⚠️ High |
| 8 | CoverageAndAddOns.tsx | 38 | 4 | ⚠️ High |
| 9 | VehicleSelection.tsx | 35 | 3 | 🟡 Medium |
| 10 | types/index.ts | 32 | 6 | 🟡 Medium |

Recommendation: Files with 🔥 Critical churn are candidates for:
  - /migration-plan (structured decomposition)
  - /refactor-new --churn-aware (prioritized refactoring)

════════════════════════════════════════════════════════════════
  🟢 STABLE CORE (Bottom 10 - Don't Touch)
════════════════════════════════════════════════════════════════

| Rank | File | Commits | Last Changed | Status |
|------|------|---------|--------------|--------|
| 1 | constants.ts | 2 | 5 months ago | 🛡️ Stable |
| 2 | Layout.tsx | 3 | 4 months ago | 🛡️ Stable |
| 3 | theme.ts | 4 | 3 months ago | 🛡️ Stable |
| 4 | ErrorBoundary.tsx | 3 | 6 months ago | 🛡️ Stable |
| 5 | useMediaQuery.ts | 5 | 4 months ago | 🛡️ Stable |

⚠️ Warning: Touching stable files increases risk.
   These files rarely change because they work well.
   Refactoring here requires strong justification.

════════════════════════════════════════════════════════════════
  📈 CHURN TRENDS
════════════════════════════════════════════════════════════════

MainWithBooking.tsx:
  Last 3 months: 45 commits  ████████████████████
  Previous 3mo:  62 commits  ██████████████████████████████
  Trend: ↓ Decreasing (-27%) ✅

BookingDetails.tsx:
  Last 3 months: 58 commits  ██████████████████████████
  Previous 3mo:  42 commits  ██████████████████
  Trend: ↑ Increasing (+38%) ⚠️

PackagesV2.tsx:
  Last 3 months: 52 commits  ████████████████████████
  Previous 3mo:  37 commits  █████████████████
  Trend: ↑ Increasing (+41%) ⚠️

════════════════════════════════════════════════════════════════
  🎯 REFACTOR CANDIDATES
════════════════════════════════════════════════════════════════

Based on churn analysis, prioritize these refactors:

1. 🔴 MainWithBooking.tsx (770 lines, 145 commits)
   Problem: Too many responsibilities
   Suggested: Split into route + providers + steps
   ROI: High (reduces merge conflicts significantly)

2. 🔴 BookingDetails.tsx (1,148 lines, 128 commits)
   Problem: God component, increasing churn
   Suggested: Extract sections into sub-components
   ROI: Very High (biggest pain point)

3. 🟠 PackagesV2.tsx (450 lines, 89 commits)
   Problem: Mixed concerns, growing complexity
   Suggested: Extract package-specific logic to hooks
   ROI: Medium-High

Run: /migration-plan to generate detailed refactor plans

════════════════════════════════════════════════════════════════
  💰 ROI ESTIMATION (Data-Driven Justification)
════════════════════════════════════════════════════════════════

## Refactoring Investment Analysis

| File | Refactor Effort | Maintenance Saved | Payback | ROI |
|------|-----------------|-------------------|---------|-----|
| BookingDetails.tsx | 24h | 8h/month | 3 months | 📈 300% |
| MainWithBooking.tsx | 16h | 5h/month | 3.2 months | 📈 275% |
| PackagesV2.tsx | 8h | 2h/month | 4 months | 📈 200% |

## Calculation Methodology

### Maintenance Cost (Current State)
Based on 6-month churn analysis:

| File | Merge Conflicts | Debug Time | PR Revisions | Monthly Cost |
|------|-----------------|------------|--------------|--------------|
| BookingDetails.tsx | 12/mo | 4h/mo | 3/mo | ~8h |
| MainWithBooking.tsx | 8/mo | 3h/mo | 2/mo | ~5h |
| PackagesV2.tsx | 4/mo | 1h/mo | 1/mo | ~2h |

### Refactoring Investment
| File | Analysis | Implementation | Testing | Review | Total |
|------|----------|----------------|---------|--------|-------|
| BookingDetails.tsx | 4h | 12h | 4h | 4h | 24h |
| MainWithBooking.tsx | 2h | 10h | 2h | 2h | 16h |
| PackagesV2.tsx | 1h | 4h | 2h | 1h | 8h |

### 12-Month Projection

```

BookingDetails.tsx:
Refactor cost: 24 hours
Maintenance saved: 8h × 12 = 96 hours
Net savings: 72 hours ✅

MainWithBooking.tsx:
Refactor cost: 16 hours
Maintenance saved: 5h × 12 = 60 hours
Net savings: 44 hours ✅

PackagesV2.tsx:
Refactor cost: 8 hours
Maintenance saved: 2h × 12 = 24 hours
Net savings: 16 hours ✅

TOTAL ANNUAL SAVINGS: 132 hours (~3.3 weeks developer time)

```

### Business Impact

| Metric | Before Refactor | After (Projected) |
|--------|-----------------|-------------------|
| Avg PR merge time | 2.3 days | 1.1 days |
| Merge conflicts/week | 8 | 2 |
| Regression rate | 12% | 4% |
| Onboarding time | 3 weeks | 1.5 weeks |

### Executive Summary

> **Investment:** 48 engineering hours (1 week)
> **Return:** 132 hours saved annually
> **Payback Period:** ~3 months
> **ROI:** 275%

Recommendation: ✅ Prioritize BookingDetails.tsx refactoring in next sprint

════════════════════════════════════════════════════════════════
  📉 TECHNICAL DEBT INTEREST RATE
════════════════════════════════════════════════════════════════

## What is Technical Debt Interest Rate?

The "interest" you pay on technical debt is the ongoing cost of NOT refactoring:
- Extra time on every PR touching that file
- Merge conflicts
- Debugging time
- Onboarding friction
- Regression fixes

## Debt Interest Calculation

### Per-File Interest Rate

| File | Change Freq | Avg PR Time | Conflict Rate | Interest/Month |
|------|-------------|-------------|---------------|----------------|
| BookingDetails.tsx | 21/mo | +2.1 days | 38% | **8.4 dev-hours** |
| MainWithBooking.tsx | 18/mo | +1.8 days | 32% | **6.2 dev-hours** |
| PackagesV2.tsx | 14/mo | +0.9 days | 18% | **3.1 dev-hours** |
| helpers.ts | 11/mo | +0.5 days | 12% | **1.8 dev-hours** |

### Formula

```

Debt Interest = (Change Frequency × Extra PR Time) + (Conflict Rate × Conflict Resolution Time)

Where:

-   Change Frequency = commits/month
-   Extra PR Time = time above baseline for files of similar size
-   Conflict Rate = % of merges with conflicts
-   Resolution Time = avg time to resolve conflicts

```

### Aggregate Debt Interest

```

════════════════════════════════════════════════════════════════
TOP 10 DEBT INTEREST PAYERS
════════════════════════════════════════════════════════════════

│ Rank │ File │ Interest/Month │ Annual Cost │
│------│-----------------------│----------------|-------------|
│ 1 │ BookingDetails.tsx │ 8.4 hours │ 100.8 hours │
│ 2 │ MainWithBooking.tsx │ 6.2 hours │ 74.4 hours │
│ 3 │ PackagesV2.tsx │ 3.1 hours │ 37.2 hours │
│ 4 │ helpers.ts │ 1.8 hours │ 21.6 hours │
│ 5 │ useCheckoutState.ts │ 1.5 hours │ 18.0 hours │
│------│-----------------------│----------------|-------------|
│ │ TOTAL TOP 5 │ 21.0 hours/mo │ 252 hours │
│ │ (Equivalent) │ (~3 dev-days) │ (~6 weeks) │
════════════════════════════════════════════════════════════════

Annual cost of NOT refactoring top 5 files: ~6 weeks of dev time

```

### Debt Payoff Analysis

```

┌─────────────────────────────────────────────────────────────┐
│ REFACTOR vs CONTINUE PAYING INTEREST │
├─────────────────────────────────────────────────────────────┤
│ │
│ BookingDetails.tsx │
│ ├── Current debt interest: 8.4 hours/month │
│ ├── Refactor investment: 24 hours (one-time) │
│ ├── Post-refactor interest: ~1.2 hours/month │
│ ├── Monthly savings: 7.2 hours │
│ └── Payback period: 3.3 months │
│ │
│ RECOMMENDATION: ✅ Refactor NOW │
│ Every month delayed = 7.2 hours wasted │
│ │
└─────────────────────────────────────────────────────────────┘

```

### Velocity Impact

How debt affects team velocity:

```

│ Metric │ Current │ Post-Refactor │ Improvement │
│---------------------------│---------|---------------|-------------|
│ Avg PR merge time │ 2.3 days│ 1.1 days │ -52% │
│ Merge conflicts/week │ 8 │ 2 │ -75% │
│ Regression rate │ 12% │ 4% │ -67% │
│ New dev onboarding │ 3 weeks │ 1.5 weeks │ -50% │
│ Time to first PR │ 5 days │ 2 days │ -60% │

```

════════════════════════════════════════════════════════════════
  👥 AUTHOR CONCENTRATION
════════════════════════════════════════════════════════════════

Files with single-author concentration (bus factor risk):

| File | Primary Author | % of Commits |
|------|----------------|--------------|
| PaymentFlow.tsx | @dev-1 | 78% ⚠️ |
| usePaymentState.ts | @dev-1 | 85% ⚠️ |
| CheckoutTracking.ts | @dev-2 | 92% ⚠️ |

Recommendation: Schedule knowledge sharing for these files.

════════════════════════════════════════════════════════════════
```

## Churn Scoring

| Score       | Commits/6mo | Authors | Action                       |
| ----------- | ----------- | ------- | ---------------------------- |
| 🔥 Critical | >100        | >5      | Immediate refactor candidate |
| ⚠️ High     | 50-100      | 3-5     | Consider refactoring         |
| 🟡 Medium   | 20-50       | 2-4     | Monitor                      |
| 🟢 Low      | <20         | 1-2     | Stable, protect              |
| 🛡️ Stable   | <5          | any     | Core, don't touch            |

## Commands Used

```bash
# Get commit count per file
git log --since="6 months ago" --name-only --pretty=format: | \
  sort | uniq -c | sort -rn

# Get authors per file
git log --since="6 months ago" --format='%an' -- {FILE} | \
  sort | uniq -c | sort -rn

# Get commit frequency over time
git log --since="6 months ago" --format='%ai' -- {FILE} | \
  cut -d- -f1-2 | sort | uniq -c

# Get merge conflict history
git log --since="6 months ago" --all --oneline --grep="Merge conflict" -- {PATH}

# Get files changed together (coupling)
git log --since="6 months ago" --name-only --pretty=format: | \
  awk 'NF' | sort | uniq -c | sort -rn
```

## Integration with Other Commands

| Use Before                    | Why                                                |
| ----------------------------- | -------------------------------------------------- |
| `/migration-plan`             | Identify which files need structured decomposition |
| `/refactor-new --churn-aware` | Focus effort on high-ROI files                     |
| `/full-flow`                  | Understand if your changes touch hotspots          |
| `/pr-review`                  | Context on file stability                          |
| `/decision-record`            | Document why stable files should stay stable       |

## Compare Mode

See how churn changes over time:

```
/churn-map apps/rent-checkout --compare=3mo,6mo,12mo
```

Output:

```
════════════════════════════════════════════════════════════════
  CHURN COMPARISON: apps/rent-checkout
════════════════════════════════════════════════════════════════

MainWithBooking.tsx:
  Last 3mo:  45 commits  ████████████████
  Last 6mo:  107 commits ████████████████████████████████████
  Last 12mo: 189 commits ████████████████████████████████████████████████████

  Trend: Decreasing ↓ (good! refactoring is working)

BookingDetails.tsx:
  Last 3mo:  58 commits  ██████████████████████
  Last 6mo:  100 commits ██████████████████████████████████████
  Last 12mo: 145 commits ████████████████████████████████████████████████

  Trend: Stable → (needs attention)

PackagesV2.tsx:
  Last 3mo:  52 commits  ████████████████████
  Last 6mo:  89 commits  ██████████████████████████████████
  Last 12mo: 89 commits  ██████████████████████████████████

  Trend: Increasing ↑ (recent growth, monitor closely)
```

## Coupling Analysis

Find files that change together (hidden dependencies):

```
/churn-map apps/rent-checkout --coupling
```

Output:

```
════════════════════════════════════════════════════════════════
  FILE COUPLING ANALYSIS
════════════════════════════════════════════════════════════════

Files frequently changed together:

1. PackagesV2.tsx + helpers.ts
   Co-changed: 34 times (67%)
   → Consider: Merging or explicit interface

2. MainWithBooking.tsx + useCheckoutState.ts
   Co-changed: 28 times (54%)
   → Consider: These are tightly coupled

3. types/index.ts + 15 other files
   Co-changed: 89 times
   → Consider: Type changes have wide impact
```

## AI Execution

When user runs `/churn-map {PATH}`:

1. **Run git analysis** on the specified path
2. **Calculate churn scores** for each file
3. **Identify trends** (increasing/decreasing)
4. **Flag refactor candidates** based on scores
5. **Identify stable core** files to protect
6. **Generate recommendations** with ROI estimates
