# AGENTS.md — Template: Studio Manager app

This file ships with generated Studio Manager apps.

## Keep this package shape

- Use `#src/*` for local imports when available.
- Studio Manager apps are libraries; keep `federation.devPort` accurate in `package.json` for isolated local dev.
- Prefer `dev:watch` for local development.
- Route strings through `src/i18n` and run `pnpm translation:update` after changes.
- Add feature flags in the app-local registry instead of hardcoding names.

## First checks after generation

- Update package metadata and README placeholders.
- Confirm the chosen port does not collide with sibling apps.
- If needed, wire local navigation/sidebar injection in `studio-manager/navigation-sidebar`.
- Run `lint`, `ci:compile`, and local dev before opening a PR.
