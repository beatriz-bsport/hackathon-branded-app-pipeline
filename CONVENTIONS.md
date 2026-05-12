# Conventions

## Global

- Read `.github/instructions/_FRONTEND_GUIDELINES.instruction.md` before edits.
- Keep code file names kebab-case unless the package already relies on `App.tsx`.
- Prefer package-local or affected-only commands.
- Use generators from `tools/templates/` for new SM apps, stores, and TS packages.

## Modern vs legacy

- Modern work lives in `apps/applications/studio-manager`, `packages/api`, `packages/design-system/kaizen`, and `packages/utils`.
- `packages/stores` stays active for existing consumers, shared client state, and migrations off older server-data flows.
- `saas-legacy` remains supported but is not the default home for new work.
- Legacy docs still describe Flow/Redux/material-ui patterns; do not copy those into Studio Manager.

## Studio Manager applications

- Path shape follows backend business domains: `apps/applications/studio-manager/<domain>/<unit>`.
- Package names use `@bsport/sm-*`.
- Dev workflow prefers `pnpm exec nx run @bsport/<app>:dev:watch`.
- Studio Manager apps are libraries, not separately composed runtime apps.
- `package.json` still owns `federation.devPort`; use it for isolated local dev with sidebar injection and keep ports aligned with existing apps.
- If local navigation needs manual wiring, update `studio-manager/navigation-sidebar/src/urls.ts`.
- Use `#src/*` aliases inside packages.

## API packages

- New API client modules for backend-backed resources should live in `packages/api/<domain>`.
- Prefer extending an existing domain package before adding a new package.
- Match the existing shape: `constants.ts` at package root, then per-resource folders with `types.ts`, `api.ts`, optional `query-options.ts`, and `index.ts` re-exports.
- For reads, export query-key factories, `fetch*API` helpers, and `*QueryOptions` builders with `@tanstack/react-query`.
- Keep query keys stable and include every parameter that changes the response.
- For writes, export API helpers plus `mutationOptions` where the package already uses them, and invalidate related query keys from the consuming mutation flow.

## Stores

- Prefer extending `packages/api` instead of creating a new store package for backend data.
- Keep stores for existing store-based consumers, shared client/UI state, or migration steps that are not done yet.
- One store package per entity/domain when a store is still needed.
- Standard file layout: `types.ts`, `store.ts`, `actions/store.ts`, `actions/index.ts`, `api.ts`, `selectors.ts`.
- Build actions around injected `fetch`, not hardcoded clients.
- Use `@bsport/store-base` for types, helpers, store binding, URL params, and typed error handling.

## Kaizen

- Prefer Kaizen before ad-hoc UI.
- Primitive components live in `packages/design-system/kaizen/primitive/core`.
- Business components live in `packages/design-system/kaizen/business` and must justify shared business logic.
- Every new shared Kaizen component should ship with Storybook coverage.
- Use existing `component:add` Hygen generators instead of creating component folders manually.

## i18n

- New user-facing strings go through i18n.
- Studio Manager apps follow `src/i18n/{source,locales,namespaces.json}`.
- Run `pnpm translation:update` after string changes.
- Studio Manager namespaces are prefixed per application; use `@bsport/i18n` helpers instead of ad-hoc setup.

## Feature flags

- New features should be registered in the app-level flag registry.
- Never hardcode flag names in components.
- Studio Manager uses `makeFeatureFlags`/`useFlag`; legacy uses its legacy registry/hook wrappers.

## Verification

- Default to package-scoped `lint`, `test`, `build`, or `ci:compile`.
- For branch work, prefer `pnpm verify:affected` before broader repo checks.
