# Store packages

Zustand state packages for Ichizen. Keep using them for existing consumers, shared client state, or migration steps. For new API client modules and new server-data reads, prefer `packages/api` with TanStack Query.

## Agent Playbook

- Prefer `pnpm project:create --template=store-package` over hand-creating a package.
- Before creating a new store, check whether the work should extend `packages/api` instead.
- Keep the standard layout: `types.ts`, `store.ts`, `actions/store.ts`, `actions/index.ts`, `api.ts`, `selectors.ts`.
- Inject `fetch` into actions.
- Use `@bsport/store-base` helpers for typed errors, selectors, store binding, and shared response types.
- Verify package-scoped `lint`, `test`, and `ci:compile` after store changes.

## Related docs

- `AGENTS.md`
- `base/README.md`
- `../../CONVENTIONS.md`
