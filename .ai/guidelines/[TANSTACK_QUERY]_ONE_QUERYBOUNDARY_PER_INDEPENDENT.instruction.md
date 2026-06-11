# [TanStack Query] One QueryBoundary per independent data slice — not one per page

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 2
Level: 🟢 Best practice
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:52 PM
Last edited by: David Bretaud
Created time: May 29, 2026 2:07 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** Place a `QueryBoundary` around each independent data region (card, panel, section). Never wrap an entire page in one boundary.

# How

Identify the data slices on a page. Each slice that can succeed or fail independently of the others gets its own `QueryBoundary`. The page's overall layout (header, navigation, shell) is rendered outside any boundary.

<aside>
❌

Bad

```tsx
<QueryBoundary fallback={<PageSkeleton />}>
  <PageHeader />
  <ConsumerCard /> {/* useSuspenseQuery inside */}
  <PassesPanel /> {/* useSuspenseQuery inside */}
  <BookingsTable /> {/* useSuspenseQuery inside */}
</QueryBoundary>

// If BookingsTable errors and refetches, the whole page unmounts.
// PageHeader's transient state (open menus, scroll, …) is lost.
```

</aside>

<aside>
✅

Good

```tsx
<PageHeader />

<QueryBoundary fallback={<ConsumerCardSkeleton />}>
  <ConsumerCard />
</QueryBoundary>

<QueryBoundary fallback={<PassesPanelSkeleton />}>
  <PassesPanel />
</QueryBoundary>

<QueryBoundary fallback={<BookingsTableSkeleton />}>
  <BookingsTable />
</QueryBoundary>
```

</aside>

# Why

Suspense + Error Boundary unmount everything under the boundary when any descendant query errors and refetches. A page-level boundary turns a single widget failure into a full-page reload, losing all transient UI state. Slice-level boundaries contain the blast radius.

# Links

[7. Suspense vs traditional queries](https://app.notion.com/p/7-Suspense-vs-traditional-queries-36f137e4c6408084894cf77d4f25c690?pvs=21)
