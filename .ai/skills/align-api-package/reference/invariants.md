# ADR-0001 invariants cheat-sheet

The full decision is in
[`docs/adr/0001-tanstack-query-api-package-conventions.md`](../../../../docs/adr/0001-tanstack-query-api-package-conventions.md).
This file is the operational checklist the audit and fixers enforce.

## Rule 1 — vanilla builders

A package builder (`queryOptions` / `infiniteQueryOptions` / `mutationOptions`)
may contain **only**:

- `queryKey` (or `mutationKey`)
- `queryFn` / `mutationFn` calling a `fetch*API` helper, with `fetch` passed in
- endpoint-intrinsic wiring: `getNextPageParam`, `initialPageParam`

**Violations** (move to the app, verbatim):

| Found in builder                                | Where it belongs                                  |
| ----------------------------------------------- | ------------------------------------------------- |
| `staleTime`, `gcTime`                           | call site (`useQuery`/`useSuspenseQuery` options) |
| `enabled`, `retry`, `refetchOn*`                | call site                                         |
| `select`                                        | call site                                         |
| any hook import (`useQuery`, …) or React import | the app, not the package                          |

A relocated constant (e.g. `MEMBER_STALE_TIME`) **stays exported** from the
package as a vanilla value and is re-applied at every call site. **Never drop
it** — dropping `staleTime` silently changes a cached query into refetch-on-mount.

## Rule 3 — no root barrel

- `package.json` declares `"sideEffects": false`. _(auto: `delete-barrel`)_
- No root `.` barrel; consumers import from `@bsport/<pkg>/<resource>`.
  _(auto: `migrate-barrel-imports` then `delete-barrel`)_
- The `"./*"` export map already exposes the subpaths.
- Resource `index.ts` uses **explicit named re-exports**, never `export *`.
  _(audit flags it; not auto-fixed — needs per-symbol type/value distinction, so
  convert by hand or extend the generator.)_

Migration is per resource: split mixed barrel imports, keep the barrel present
as explicit re-exports until the last consumer is migrated, then delete it
(`delete-barrel`, gated on remaining count == 0).

## Rule 4 — canonical key invariants

These are **invariants**, not a closed set of allowed keys.

1. **Root**: every key starts `[QUERY_KEY_MAIN, "<resource>"]` via `all`.
2. **No param spreading**: pass the whole params object as one segment.
   TanStack hashes it deterministically.
3. **Collection tier**: a parameterized key sits under a collection node so
   invalidation can target the collection.
4. **Canonical names** for the standard trio + infinite-as-child-of-lists.
5. **Domain keys allowed** (`search`, `latest`, `categories`) if they obey 1–3.
6. `useQuery` and `useInfiniteQuery` **must not share a key** (different cached
   shapes collide).

### Canonical shape

```typescript
export const memberKeys = {
  all: [QUERY_KEY_MAIN, "member"] as const,
  lists: () => [...memberKeys.all, "lists"] as const,
  list: (params) => [...memberKeys.lists(), params] as const,
  details: () => [...memberKeys.all, "details"] as const,
  detail: (id) => [...memberKeys.details(), id] as const,
  infiniteLists: () => [...memberKeys.lists(), "infinite"] as const,
  infiniteList: (params) => [...memberKeys.infiniteLists(), params] as const,
  // domain keys are fine when they obey the invariants:
  search: () => [...memberKeys.all, "search"] as const, // collection
  searchQuery: (params) => [...memberKeys.search(), params] as const, // one segment
} as const;
```

### Worked examples (from cdp)

**`member` — rename + missing tier**

```diff
- listScope: () => [...memberKeys.all, "list"] as const,
- list:      (params) => [...memberKeys.listScope(), params] as const,
+ lists:     () => [...memberKeys.all, "lists"] as const,
+ list:      (params) => [...memberKeys.lists(), params] as const,

- detail: (id) => [...memberKeys.all, "detail", id] as const,
+ details: () => [...memberKeys.all, "details"] as const,
+ detail:  (id) => [...memberKeys.details(), id] as const,
```

Every consumer `memberKeys.listScope()` invalidation is rewritten to
`memberKeys.lists()`.

**`email-template` — param spreading (the worst offender)**

```diff
- emailTemplateSearchQueries: (query, id__in?, page?, page_size?) =>
-   [...emailTemplateKeys.emailTemplateSearch(), query, id__in ?? "", page ?? 1, page_size ?? 20] as const,
+ search:      () => [...emailTemplateKeys.all, "search"] as const,
+ searchQuery: (params) => [...emailTemplateKeys.search(), params] as const,
```

Non-canonical names (`emailTemplate()` → `all`, `emailTemplateDetail` →
`details()`/`detail(id)`) are normalized at the same time.

## Rule 2 — advisory only (never auto-fixed)

Report, do not rewrite:

- a `useQuery` with neither `throwOnError: true` nor an enclosing
  `QueryBoundary`;
- a region that could use `useSuspenseQuery` but uses `useQuery`;
- missing `QueryBoundary` around a query-driven region.

Converting these changes loading/error UX, which is a design decision and is not
behavior-preserving — out of scope for automatic migration.
</content>
