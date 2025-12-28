---
description: Create phased migration/refactor plan for high-churn components
category: Refactoring
aliases: [migrate, refactor-plan, roadmap]
uses: [code-standards, pr-checklist]
---

# Migration Plan: High-Priority Refactors

Phased timeline for refactoring the two highest-churn components.

---

## 🔴 Priority #1: BookingDetails.tsx

**Current State:**

-   1,148 lines
-   64 imports
-   24 custom hooks
-   280 commits in 6 months (highest churn)

**Target State:**

-   Orchestrator < 100 lines
-   8 focused sub-components (each < 150 lines)
-   6 domain-specific hooks

### Phase 1: Analysis & Planning (Day 1)

**Tasks:**

-   [ ] Map all responsibilities in BookingDetails
-   [ ] Identify natural domain boundaries
-   [ ] Create dependency graph
-   [ ] Define new folder structure

**Deliverable:** Architecture document

```
BookingDetails/
├── BookingDetails.tsx           # Orchestrator (< 100 lines)
├── BookingDetails.context.tsx   # Shared state
├── BookingDetails.types.ts      # All public types
│
├── sections/
│   ├── BookingHeader/
│   │   ├── BookingHeader.tsx
│   │   ├── BookingHeader.styled.ts
│   │   └── BookingHeader.types.ts
│   │
│   ├── BookingDates/
│   ├── BookingVehicle/
│   ├── BookingExtras/
│   ├── BookingPricing/
│   └── BookingActions/
│
├── hooks/
│   ├── useBookingState.ts       # State management
│   ├── useBookingData.ts        # Data fetching
│   ├── useBookingTracking.ts    # Analytics
│   ├── useBookingModals.ts      # Modal state
│   └── useBookingActions.ts     # User actions
│
└── modals/
    ├── CancellationModal/
    └── ModificationModal/
```

### Phase 2: Extract Context & Hooks (Day 2)

**Tasks:**

-   [ ] Create `BookingDetails.context.tsx`
-   [ ] Move shared state to context
-   [ ] Extract `useBookingState.ts`
-   [ ] Extract `useBookingData.ts`
-   [ ] Write tests for hooks

**PR Scope:** Hooks extraction only (non-breaking)

### Phase 3: Extract Sections (Days 3-4)

**Tasks:**

-   [ ] Create `sections/BookingHeader/`
-   [ ] Create `sections/BookingDates/`
-   [ ] Create `sections/BookingVehicle/`
-   [ ] Create `sections/BookingExtras/`
-   [ ] Create `sections/BookingPricing/`
-   [ ] Create `sections/BookingActions/`
-   [ ] Update main orchestrator

**PR Scope:** One section per PR (6 small PRs)

### Phase 4: Extract Modals (Day 5)

**Tasks:**

-   [ ] Create `modals/CancellationModal/`
-   [ ] Create `modals/ModificationModal/`
-   [ ] Extract modal-specific hooks
-   [ ] Clean up main file

**PR Scope:** Modals extraction

### Phase 5: Verification & Cleanup (Day 5)

**Tasks:**

-   [ ] Verify all tests pass
-   [ ] Check bundle size impact
-   [ ] Remove dead code
-   [ ] Update documentation
-   [ ] Measure churn reduction baseline

**Success Metrics (from `/code-standards`):**

-   Main file < 100 lines (orchestrator only)
-   Each section < 150 lines (warning limit)
-   Each hook < 100 lines
-   < 20 imports per file
-   < 8 custom hooks per component
-   All tests passing
-   Bundle size neutral or improved
-   `code-quality-check.sh` passes with 0 critical issues

---

## 🟠 Priority #2: MainWithBooking.tsx

**Current State:**

-   770 lines
-   56 imports
-   30 custom hooks
-   10 useEffect calls
-   145 commits in 6 months

**Target State:**

-   Router/layout only (< 80 lines)
-   Step components isolated
-   Orchestration in hooks

### Phase 1: Analysis & Planning (Day 1)

**Tasks:**

-   [ ] Map routing logic
-   [ ] Identify step boundaries
-   [ ] List all side effects
-   [ ] Define provider hierarchy

**Deliverable:** Architecture document

```
Main/
├── MainWithBooking.tsx          # Router + layout only (< 80 lines)
├── MainWithBooking.context.tsx  # App-level state
├── MainWithBooking.types.ts
│
├── orchestration/
│   ├── useStepNavigation.ts     # Step routing logic
│   ├── useBookingLifecycle.ts   # Booking state machine
│   ├── useCheckoutTracking.ts   # Analytics
│   └── usePaymentFlow.ts        # Payment orchestration
│
├── providers/
│   ├── BookingProvider.tsx
│   ├── PaymentProvider.tsx
│   ├── TrackingProvider.tsx
│   └── StepsProvider.tsx
│
└── Steps/
    ├── ReviewStep/
    │   ├── ReviewStep.tsx
    │   ├── ReviewStep.styled.ts
    │   └── hooks/
    │
    ├── CoverageStep/
    └── PaymentStep/
```

### Phase 2: Extract Providers (Day 1)

**Tasks:**

-   [ ] Create `providers/BookingProvider.tsx`
-   [ ] Create `providers/PaymentProvider.tsx`
-   [ ] Create `providers/StepsProvider.tsx`
-   [ ] Move state to providers

**PR Scope:** Provider extraction (non-breaking)

### Phase 3: Extract Orchestration Hooks (Day 2)

**Tasks:**

-   [ ] Create `useStepNavigation.ts`
-   [ ] Create `useBookingLifecycle.ts`
-   [ ] Create `useCheckoutTracking.ts`
-   [ ] Write comprehensive tests

**PR Scope:** Hooks extraction

### Phase 4: Slim Down Main Component (Day 3)

**Tasks:**

-   [ ] Move step rendering to Steps/
-   [ ] Reduce MainWithBooking to router only
-   [ ] Clean up imports
-   [ ] Verify routing works

**PR Scope:** Final slimdown

**Success Metrics:**

-   Main file < 80 lines
-   Each provider < 100 lines
-   Each step < 150 lines
-   All E2E tests passing

---

## 📅 Combined Timeline

| Day | BookingDetails         | MainWithBooking      |
| --- | ---------------------- | -------------------- |
| 1   | Analysis + Context     | Analysis + Providers |
| 2   | Extract hooks          | Extract hooks        |
| 3   | Extract sections (1-3) | Slim main component  |
| 4   | Extract sections (4-6) | Testing & cleanup    |
| 5   | Modals + cleanup       | -                    |

**Total Effort:** ~5 working days for both

---

## 🎯 Risk Mitigation

### Testing Strategy

-   Unit tests for all new hooks
-   Integration tests for providers
-   E2E tests remain unchanged (regression check)

### Rollback Plan

-   Each phase is a separate PR
-   Can revert individual phases
-   Feature flags for major changes

### Merge Strategy

-   Merge to feature branch first
-   Full regression test
-   Merge to master with team sign-off

---

## 📊 Success Metrics

Track these after migration:

| Metric                   | Before   | Target  |
| ------------------------ | -------- | ------- |
| BookingDetails lines     | 1,148    | < 100   |
| MainWithBooking lines    | 770      | < 80    |
| Monthly commits to files | 50+      | < 10    |
| Merge conflicts          | Frequent | Rare    |
| Onboarding time          | Hours    | Minutes |

---

## AI Execution

When running `/migration-plan`:

1. Show current status of both files
2. Generate task list for next phase
3. Track completed phases
4. Report metrics after each phase
