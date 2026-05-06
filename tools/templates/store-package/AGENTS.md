# AGENTS.md — Template: store package

This file ships with generated store packages. Use this template when an existing consumer still needs store hooks/actions/selectors, when the state is truly client-side/shared UI state, or when you are taking a migration step. For new API client modules, prefer `packages/api`.

## Expected files

- `types.ts`
- `store.ts`
- `actions/store.ts`
- `actions/index.ts`
- `api.ts`
- `selectors.ts`

## Conventions

- Re-check whether `packages/api` is the better fit before expanding store scope.
- Keep actions fetch-injected.
- Use `@bsport/store-base` helpers and types.
- Export the public hook/actions/selectors from the package entrypoint.
- Preserve typed error handling when wrapping backend failures.

## First checks after generation

- Replace README placeholders.
- Confirm package name/path match the domain and entity.
- Run `lint`, `ci:compile`, and tests if added.
