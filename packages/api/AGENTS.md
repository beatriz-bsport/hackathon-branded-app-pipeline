# AGENTS.md — API packages

## Scope

Server-data packages for Studio Manager and related frontends. Default home for new API client modules.

## Standard package shape

- `constants.ts` — package API base path and query-key prefix
- `<resource>/types.ts` — domain and API types
- `<resource>/api.ts` — query-key factories and `fetch*API` helpers
- `<resource>/query-options.ts` — optional extracted `queryOptions` / `mutationOptions` builders when it helps readability
- `<resource>/index.ts` — public re-exports for the resource
- `index.ts` — package entrypoint re-exports

## Conventions

- Prefer extending an existing `packages/api/<domain>` package before creating a new one.
- For reads, export query-key factories, `fetch*API` helpers, and `*QueryOptions` builders with `@tanstack/react-query`.
- Keep query keys stable and include all params that shape the response.
- For writes, export API helpers and `mutationOptions` where the package already uses them, and document which query keys consumers should invalidate.
- Reuse shared helper types/utilities already used in the repo, including `Fetch`, `ApiConfig`, and URL-param builders from `@bsport/store-base`.
- Keep public exports explicit from package and resource entrypoints.

## Verification

- Run package `lint` and `ci:compile` when touching API packages.
- Check consumers if you change exported query keys, option builders, or API function signatures.

## Related docs

- `README.md`
- `../../CONVENTIONS.md`
