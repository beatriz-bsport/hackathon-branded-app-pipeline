# AGENTS.md — API packages

## Scope

Server-data packages for Studio Manager and related frontends. Default home for new API client modules.

> The architecture these rules implement is recorded in
> [`docs/adr/0001-tanstack-query-api-package-conventions.md`](../../docs/adr/0001-tanstack-query-api-package-conventions.md).

## Standard package shape

- `constants.ts` — package API base path and query-key prefix (`QUERY_KEY_MAIN`)
- `<resource>/types.ts` — domain and API types
- `<resource>/api.ts` — query-key factory and `fetch*API` helpers
- `<resource>/query-options.ts` — `queryOptions` / `infiniteQueryOptions` builders
- `<resource>/mutation-options.ts` — `mutationOptions` builders (when the resource has writes)
- `<resource>/keys.ts` — optional; move the key factory here once a resource exceeds ~12 keys
- `<resource>/index.ts` — explicit named re-exports for the resource (no `export *`)

There is **no root `"."` barrel**. Consumers import from resource subpaths
(`@bsport/api-cdp/member`), exposed via the `"./*"` export map. Declare
`sideEffects: false` in `package.json`.

## Conventions

- Prefer extending an existing `packages/api/<domain>` package before creating a new one.
- API packages are **vanilla** — no React, no hooks. Hooks (`useQuery`, `useSuspenseQuery`, `useInfiniteQuery`, `useMutation`), `select`, and multi-call aggregation live in the consuming app.
- Export query-key factories, `fetch*API` helpers, and `queryOptions` / `infiniteQueryOptions` / `mutationOptions` builders. Builders take `fetch` as a parameter — never a `QueryClient`.
- A package builder carries **only** the query key, the `queryFn`, and wiring intrinsic to the endpoint (for infinite queries: `getNextPageParam` / `initialPageParam`). App-preference options — `staleTime`, `gcTime`, `enabled`, `select`, `retry` — are set app-side, not in the package.
- Key factory shape: root at `[QUERY_KEY_MAIN, "<resource>"]`; expose the two-tier collection + parameterized pairs (`lists()`/`list(params)`, `details()`/`detail(id)`); infinite keys are **children of `lists()`** (`infiniteLists()`/`infiniteList(params)`).
- **Never spread params into a key** — pass the whole params object as one segment; TanStack hashes it deterministically.
- `useQuery` and `useInfiniteQuery` MUST NOT share a key — they store different shapes and would collide in the cache.
- For writes, export `mutationOptions` builders and document which query keys consumers should invalidate.
- Reuse shared helper types/utilities already used in the repo, including `Fetch`, `ApiConfig`, and URL-param builders from `@bsport/store-base`.
- Keep public exports explicit from resource entrypoints.

## Verification

- Run package `lint` and `ci:compile` when touching API packages.
- Check consumers if you change exported query keys, option builders, or API function signatures.

## Related docs

- `README.md`
- `../../CONVENTIONS.md`
