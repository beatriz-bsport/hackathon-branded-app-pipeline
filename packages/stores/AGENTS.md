# AGENTS.md — Stores

## Scope

Zustand-based state packages for Studio Manager and shared frontends. These are no longer the default place for new server-data integrations.

## Standard package shape

- `types.ts` — domain and API types
- `store.ts` — vanilla Zustand store + hook binding
- `actions/store.ts` — store mutations/helpers
- `actions/index.ts` — actions exported to consumers
- `api.ts` — request builders / API calls
- `selectors.ts` — selectors and derived reads

## Conventions

- Prefer `packages/api` for new API client modules and server-data fetching.
- Create or extend stores for existing consumers, shared client/UI state, or migration steps.
- Prefer one store package per entity/domain when a store is still needed.
- Inject `fetch` into actions instead of reaching for globals.
- Export hooks, actions, and selectors from package entrypoints.
- Use `@bsport/store-base` for typed actions, error context, store binding, and utility types.

## Error handling

- Preserve typed failures through `HTTPException<T>` patterns.
- Use `createErrorWithContext<T>` when wrapping backend failures.
- Include meaningful action/resource context.

## Verification

- Run package `lint`, `test`, and `ci:compile` when touching store APIs.
- Check consumers if you change exported selectors or action signatures.

## Related docs

- `base/README.md`
- `../../CONVENTIONS.md`
