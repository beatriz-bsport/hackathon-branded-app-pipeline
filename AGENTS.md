# AGENTS.md — Ichizen

## What this repo is

bsport web interfaces monorepo. `pnpm` workspaces + `nx`. Apps live in `apps/`, shared packages in `packages/`, repo tooling in `tools/`.

### ⚠️ CRITICAL: Guidelines First

**Before writing ANY code:**

1. **Pre-flight (mandatory):** Open and scan `.ai/guidelines/_FRONTEND_GUIDELINES.instruction.md` and any relevant files in `.ai/guidelines/` **before the first edit/tool call that changes code**.
2. **Never** assume patterns from existing code - legacy code may violate current standards
3. **Ask** which guideline applies if uncertain

## Modern vs legacy

- Write new product code in `apps/applications/studio-manager/**`, `packages/api/**`, `packages/design-system/kaizen/**`, and `packages/utils/**`.
- Touch `packages/stores/**` for existing consumers, shared client state, or migration steps.
- Legacy zones: `apps/applications/saas-legacy/**`, `apps/widgets/widget-legacy/**`, `packages/common-legacy/**`, `packages/design-system/fabric/**`.
- Do not start new features in legacy unless the task is explicitly legacy-only. Prefer porting to Studio Manager.

## Repo map

- `apps/applications/studio-manager/` — modern backoffice.
- `apps/applications/saas-legacy/` — old backoffice + marketplace.
- `packages/api/` — domain API packages for server data, query keys, and TanStack Query query options.
- `packages/stores/` — Zustand stores kept for existing consumers, shared client state, and migration.
- `packages/design-system/kaizen/` — modern design system, Storybook, Hygen generators.
- `packages/utils/` — modern utility packages.
- `tools/templates/` — canonical scaffolds for SM apps, stores, TS packages.
- `tools/nx/` — custom Nx generators and Studio Manager `dev:watch` workflow.

## Commands you will use most

- Install: `pnpm install`
- List projects: `pnpm project:list`
- Scoped dev: `pnpm exec nx run @bsport/<project>:dev:watch`
- Scoped single-app dev: `pnpm exec nx run @bsport/<project>:dev:single`
- Scoped lint/test/build: `pnpm exec nx lint @bsport/<project>`, `pnpm exec nx test @bsport/<project>`, `pnpm exec nx build @bsport/<project>`
- Changed-only verification: `pnpm verify:affected`
- Translations: `pnpm translation:update`

## Scaffolding commands

- `pnpm project:create --template=sm-application`
- `pnpm project:create --template=store-package`
- `pnpm project:create --template=typescript-package`
- `pnpm new:kaizen-component -- --target primitive|business` → runs existing Kaizen Hygen generator from repo root

## Core conventions

- Intra-package imports: use `#src/*` for any **cross-directory** reference (it replaces `../` parent traversal — that's the brittle pattern `#src/*` exists to remove). **Same-directory** `./foo` siblings are fine and the established style. `#src/*` is defined in each package's `package.json#imports`; packages without it keep using relative paths.
- Studio Manager apps are workspace libraries. Local dev still uses `federation.devPort` and `dev:watch` to inject the navigation sidebar bridge for isolated work.
- New API client modules and server-data integrations should usually live in `packages/api/**` and follow the existing TanStack Query pattern: query-key factories, `fetch*API` helpers, and `queryOptions` / `mutationOptions` builders.
- Stores follow the template shape: `types.ts`, `store.ts`, `actions/store.ts`, `actions/index.ts`, `api.ts`, `selectors.ts`, but prefer them only for existing consumers, shared client state, or migration.
- `@bsport/store-base` still provides shared fetch/types/error helpers used by stores and some API packages.
- User-facing strings go through i18n. Studio Manager namespaces are prefixed per app; run `pnpm translation:update` after string changes.
- New features should be feature-flagged. See `docs/feature_flags.md`.

## Per-type overlays

- Studio Manager apps: `apps/applications/studio-manager/AGENTS.md`
- API packages: `packages/api/AGENTS.md`
- Stores: `packages/stores/AGENTS.md`
- Kaizen: `packages/design-system/kaizen/AGENTS.md`
- Legacy warning: `apps/applications/saas-legacy/AGENTS.md`

## Good defaults for agents

- Prefer `nx affected` or package-scoped commands over whole-repo runs.
- Prefer generators and existing templates over creating files from scratch.
- When touching legacy, document whether the work should instead move to Studio Manager.
- When editing UI in Studio Manager, check Kaizen before creating new primitives/business components.

## Canonical docs

- Repo conventions: `CONVENTIONS.md`
- Root setup and structure: `README.md`
- Feature flags: `docs/feature_flags.md`
- Studio Manager workflow: `apps/applications/studio-manager/README.md`
- API patterns: `packages/api/AGENTS.md`, `packages/api/README.md`
- Store patterns: `packages/stores/AGENTS.md`, `packages/stores/base/README.md`
- Kaizen workflow: `packages/design-system/kaizen/README.md`
