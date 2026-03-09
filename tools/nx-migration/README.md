# @bsport/nx-migration

Nx generator plugin to migrate Studio Manager apps from Module Federation mode to workspace library mode.

## Generator

- Name: `@bsport/nx-migration:migrate-to-library`
- Input: `appName`

Accepted `appName` formats:

- `sm-giftcard`
- `@bsport/sm-giftcard`
- `giftcard`

All formats normalize to `sm-<name>`.

## Usage

Always start with a dry-run:

```bash
pnpm exec nx g @bsport/nx-migration:migrate-to-library sm-giftcard --dry-run
```

Interactive prompt mode:

```bash
pnpm exec nx g @bsport/nx-migration:migrate-to-library
```

## What It Changes

For target app (`apps/applications/studio-manager/.../<app>`):

1. `package.json`
   - adds `exports`, `main`, `module`, `types`
   - updates build script to use `vite build --mode production`
   - swaps `@bsport/config-federation` to `@bsport/config-library` in `devDependencies`
   - updates `nx.tags`: adds `postinstall`, removes `application:revamp`
2. `vite.config.ts`
   - swaps `getConfig`/`@bsport/config-federation`
   - to `getLibConfig`/`@bsport/config-library`
3. i18n files
   - creates `src/i18n/index.ts`
   - rewrites `src/utils/i18n.ts` to use `i18nNamespacePrefix`, `i18nNamespaces`, `inMemoryTranslationsLoader`
   - deletes `src/i18n/namespaces.json`

For host app (`apps/applications/studio-manager/host`):

4. `package.json`
   - adds workspace dependency on migrated app package
   - removes app from `federation.remotes`
5. `src/Root.tsx`
   - replaces `import("sm-foo/App")` with `import("@bsport/sm-foo")`
6. `src/modules.d.ts`
   - removes `declare module "sm-foo/App"` block

After applying file transforms, the generator runs formatting on changed files (target app + host).

## What It Does Not Change

- does not move entries between `dependencies` and `peerDependencies`
- does not modify `src/App.tsx`, `src/index.tsx`, `vite-env.d.ts`
- does not modify host `scripts/apps.txt`, `vite.config.ts`, or `tailwind.config.js`

## Safety

- Idempotency guard: fails fast if app already looks migrated (`exports` exists or `@bsport/config-library` already in `devDependencies`)
- Emits warning to manually review:
  - dependency/peerDependency placement
  - `src/index.tsx`
  - `vite-env.d.ts`

## Post-Migration Checklist

After dry-run output looks correct:

1. run without `--dry-run`
2. run `pnpm install`
3. run target app and host checks
4. verify peer dependency decisions manually

## Development

Run tests for this plugin:

```bash
cd tools/nx-migration
pnpm exec vitest run
```

Run typecheck:

```bash
cd tools/nx-migration
pnpm exec tsc --noEmit
```
