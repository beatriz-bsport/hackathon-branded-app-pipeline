# [TanStack Query] select and combine need a stable reference

Validity status: ✅ Valid
Adoption status: ✖️ Not evaluated yet
Importance: 5
Level: 🔴 Blocking
Scope: API
Checks enforced: 🤖 AI rules
Last edited time: June 11, 2026 3:49 PM
Last edited by: David Bretaud
Created time: May 29, 2026 12:55 PM
Author: David Bretaud
Repository: ichizen

> **Rule:** Define `select` (resp `combine` for `useQueries`) functions at module scope or wrap them in `useCallback`. Never define them inline in a hook body.

# How

Prefer module scope by default — it's the simplest stable reference and has no dependency-array footgun.

<aside>
❌

Bad

```tsx
export const useContractNamesQuery = () =>
  useQuery({
    ...fetchContractsQueryOptions(fetch, {}),
    select: (data) => data.map((c) => c.name), // ← new reference each render
  });
// `select` re-runs every render even when `data` is unchanged.
```

</aside>

<aside>
✅

Good

```tsx
const selectContractNames = (data: Contract[]) => data.map((c) => c.name);

export const useContractNamesQuery = () =>
  useQuery({
    ...fetchContractsQueryOptions(fetch, {}),
    select: selectContractNames,
  });
```

</aside>

# Why

TanStack memoizes `select` by reference identity. A fresh function every render defeats that memoization, causing the derived value to be recomputed (and any downstream `useMemo` / equality checks to fail) on every render.

Same applies to `combine` .

# Links

[React Query Selectors Supercharged (tkdodo)](https://tkdodo.eu/blog/react-query-selectors-supercharged)

[`select` and derived data](https://app.notion.com/p/select-and-derived-data-36f137e4c6408082bd09fa8ce66e5f21?pvs=21)
