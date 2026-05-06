# AGENTS.md — Studio Manager

## Scope

Modern backoffice apps. New manager-facing product work belongs here unless explicitly legacy.

## Shape

- Path: `apps/applications/studio-manager/<domain>/<unit>`
- Package name: `@bsport/sm-*`
- Studio Manager apps are libraries; local dev port still lives in `package.json#federation.devPort`
- Local imports should use `#src/*`

## Preferred workflow

- Run app with sidebar injection: `pnpm exec nx run @bsport/<app>:dev:watch`
- Run app only: `pnpm exec nx run @bsport/<app>:dev:single`
- Build translations: `pnpm translation:update`
- Lint/test/build with Nx from repo root when possible

## Non-negotiables

- Do not reintroduce per-app composed-runtime packaging as the default architecture.
- Use Kaizen for UI before inventing new local primitives.
- All user-facing strings go through i18n.
- New features should be feature-flagged.

## Common gotchas

- Navigation Sidebar is the bridge between old and new during local dev and may need URL updates for new apps.
- `dev:watch` is the preferred entrypoint because it starts the app with sidebar injection and watches workspace deps without needing host.
- Do not import legacy patterns from `saas-legacy` into Studio Manager.

## Related docs

- `README.md`
- `../../../../CONVENTIONS.md`
- `../../../../docs/feature_flags.md`
