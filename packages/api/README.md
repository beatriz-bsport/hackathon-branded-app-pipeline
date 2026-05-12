# API packages

Server-data packages for Ichizen. New API client modules and new server-data reads should usually live here.

## Agent Playbook

- Prefer extending an existing domain package in `packages/api/<domain>` before creating a new package.
- There is no dedicated API-package generator today; extend an existing domain package or mirror the current package shape manually.
- Match the current shape: `constants.ts` at package root, then per-resource folders with `types.ts`, `api.ts`, optional `query-options.ts`, and `index.ts` re-exports.
- For reads, export query-key factories, `fetch*API` helpers, and `*QueryOptions` builders using `@tanstack/react-query`.
- Keep `queryKey` inputs stable and include every parameter that changes the response.
- For writes, export API helpers and `mutationOptions` where the package already follows that pattern, then invalidate related query keys from the consuming mutation flow.
- Reuse shared helpers already used in the repo, including `Fetch`, `ApiConfig`, and URL-param utilities from `@bsport/store-base`, instead of inventing parallel fetch abstractions.
- Verify package-scoped `lint` and `ci:compile` after API changes.

## Related docs

- `AGENTS.md`
- `../../CONVENTIONS.md`
- `../utils/sm-backbone/README.md`
