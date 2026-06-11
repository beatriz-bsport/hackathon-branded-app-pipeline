---
status: accepted
date: 2026-06-09
---

# TanStack Query conventions for API packages

## Context

TanStack Query usage grew organically across verticals (`api-book`, `api-cdp`,
`api-core`, `api-buyables`, …) and each team converged on slightly different
conventions for where query keys, option builders, and hooks live, how loading
and error states are handled, and how packages are imported. The divergence is
visible even inside a single package: `api-cdp` defines `memberKeys` with
`listScope()`/`list(params)` in `api.ts`, while `email-template` uses an
unrelated shape (`emailTemplate()`, individual params spread into the key array)
in a separate `keys.ts`. A cross-team [RFC][rfc] collected the proposals and
disagreements; this ADR records the direction we are aligning on. Adoption and
migration are driven separately (a dedicated adoption skill), not by this ADR.

[rfc]: https://app.notion.com/p/TanStack-Query-RFC-359137e4c6408058b533e3e2cfbd2206

## Decision

### 1. Ownership boundary — packages are vanilla, apps own React

API packages expose **vanilla** building blocks only — no React, no hooks:

- **Query-key factories** following the canonical shape (see §4).
- **`fetch*API` functions** — the single source of truth for a request.
- **`queryOptions` / `infiniteQueryOptions` / `mutationOptions` builders** that
  take `fetch` as a parameter (never a `QueryClient`).

A package option builder carries **only the query key, the `queryFn`, and
wiring intrinsic to the endpoint's data contract** — for infinite queries that
means `getNextPageParam` / `initialPageParam`, because pagination is a property
of the endpoint, not of the consuming app.

Everything tied to the React lifecycle or to app preference lives **in the app**:

- All hooks (`useQuery`, `useSuspenseQuery`, `useInfiniteQuery`, `useMutation`).
- App-preference options: `staleTime`, `gcTime`, `enabled`, `select`, `retry`.
- Composition / derivation: multi-call `useQueries`, aggregations, and any
  business-specific query orchestration. Apps may define their own keys and
  option builders for app-only composed use cases.

### 2. Loading is suspense by default; errors always route to a boundary

- **`QueryBoundary` is the universal error-isolation strategy.** It is present
  regardless of which query hook is used.
- **`useSuspenseQuery` is the default loading mechanism** — use it whenever
  suspending the region is acceptable.
- **Where suspending the whole region is poor UX** (canonical case: a
  URL-param–driven paginated table where suspending the entire table on each
  page change is undesirable), use **`useQuery` with `throwOnError: true`**.
  Loading is handled inline (e.g. keep previous data), while errors still
  propagate to the enclosing `QueryBoundary`. The suspend-vs-`useQuery` choice
  is purely a _loading-UX_ decision; the _error_ strategy is constant.

### 3. No root barrel — import from resource subpaths

- API packages **do not** expose a root `"."` barrel that `export *`s every
  resource. Consumers import from **resource subpaths** (`@bsport/api-cdp/member`),
  which packages already expose via the `"./*"` export map.
- Resource `index.ts` files use **explicit named re-exports**, not `export *`.
- Packages declare **`sideEffects: false`** so bundlers can tree-shake.

This is the end state. Sequencing of the migration (~400 existing root-barrel
import sites, `api-book` heaviest at ~297) is out of scope for this ADR.

### 4. Canonical query-key factory shape

Keys are rooted at `[QUERY_KEY_MAIN, "<resource>"]` and expose a two-tier
collection + parameterized shape. **Infinite keys are children of `lists()`**,
and **params are never spread** — the whole params object is one key segment
(TanStack hashes it deterministically).

```typescript
export const memberKeys = {
  all: [QUERY_KEY_MAIN, "member"] as const,
  lists: () => [...memberKeys.all, "lists"] as const,
  list: (params) => [...memberKeys.lists(), params] as const,
  details: () => [...memberKeys.all, "details"] as const,
  detail: (id) => [...memberKeys.details(), id] as const,
  infiniteLists: () => [...memberKeys.lists(), "infinite"] as const,
  infiniteList: (params) => [...memberKeys.infiniteLists(), params] as const,
} as const;
```

Because `infiniteLists` extends `lists`, a single
`invalidateQueries({ queryKey: memberKeys.lists() })` clears both the paginated
and infinite variants — the common case after a create/update/delete.

Granular layout and naming rules (file split, `keys.ts` threshold) are
documented in `packages/api/AGENTS.md`.

## Considered options

- **Mandatory `useSuspenseQuery` everywhere** — rejected. It breaks legitimate
  cases (dependent/cascading queries, paginated tables) where suspending the
  region degrades UX. `throwOnError` + `QueryBoundary` gives the error-handling
  benefits without forcing suspense.
- **Fully flexible, per-developer choice** — rejected. Gives up the uniform
  loading/error handling the convention exists to provide.
- **Keep `export *` root barrels** — rejected. They pull a package's whole
  module graph through one entry point, defeating the "avoid unnecessary
  imports" goal even with `sideEffects: false`.
- **Package builders carry app options (e.g. `staleTime`)** — rejected. Mixing
  app preference into shared builders is what produced today's divergence;
  keeping builders to key + queryFn keeps them reusable across apps.

## Consequences

- Existing code must be brought into line (driven by the adoption skill, not
  this ADR):
  - Move app-preference options out of package builders — e.g. drop
    `staleTime: MEMBER_STALE_TIME` from `api-cdp`'s `memberListQueryOptions`.
  - Normalize divergent key factories — e.g. `api-cdp` `email-template` (param
    spreading, non-canonical names) and `memberKeys.listScope()` → `lists()`.
  - Migrate ~400 root-barrel import sites to resource subpaths and remove root
    barrels; add `sideEffects: false` per package.
- `QueryBoundary` becomes a shared, expected wrapper rather than a per-team
  pattern.
- The `APIConfig` abstraction debate and the cross-team execution/tracking model
  raised in the RFC are explicitly **out of scope** here.
