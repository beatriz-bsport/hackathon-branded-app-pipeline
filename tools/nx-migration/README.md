# @bsport/nx-migration

Nx generator plugin for Studio Manager migrations.

## `@bsport/nx-migration:migrate-to-library`

Migrate a Studio Manager app from Module Federation mode to workspace library mode.

### Input

- `appName`

Accepted `appName` formats:

- `sm-giftcard`
- `@bsport/sm-giftcard`
- `giftcard`

All formats normalize to `sm-<name>`.

### Usage

Start with a dry-run:

```bash
pnpm exec nx g @bsport/nx-migration:migrate-to-library sm-giftcard --dry-run
```

Interactive prompt mode:

```bash
pnpm exec nx g @bsport/nx-migration:migrate-to-library
```

### What It Changes

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

### What It Does Not Change

- does not move entries between `dependencies` and `peerDependencies`
- does not modify `src/App.tsx`, `src/index.tsx`, `vite-env.d.ts`
- does not modify host `scripts/apps.txt`, `vite.config.ts`, or `tailwind.config.js`

### Safety

- Idempotency guard: fails fast if app already looks migrated (`exports` exists or `@bsport/config-library` already in `devDependencies`)
- Emits warning to manually review:
  - dependency/peerDependency placement
  - `src/index.tsx`
  - `vite-env.d.ts`

### Post-Migration Checklist

After dry-run output looks correct:

1. run without `--dry-run`
2. run `pnpm install`
3. run target app and host checks
4. verify peer dependency decisions manually

## `@bsport/nx-migration:migrate-filenames-to-kebab-case`

Rename target package `src/` files and folders to kebab-case and update local references.

### Input

- `appName`

Accepted `appName` formats:

- `sm-smartlists`
- `@bsport/sm-smartlists`
- `smartlists`

All formats normalize to `sm-<name>`.

### Usage

Start with a dry-run:

```bash
pnpm exec nx g @bsport/nx-migration:migrate-filenames-to-kebab-case sm-smartlists --dry-run
```

Interactive prompt mode:

```bash
pnpm exec nx g @bsport/nx-migration:migrate-filenames-to-kebab-case
```

### What It Changes

For target app `src/` only:

1. renames files to kebab-case
   - example: `src/App.tsx` → `src/app.tsx`
2. renames folders to kebab-case
   - example: `src/components/FileInput/FileInput.tsx` → `src/components/file-input/file-input.tsx`
3. rewrites package-local references that point to renamed paths
   - relative imports/exports
   - `#src/...` aliases
   - side-effect imports

The generator is scoped to the selected package `src/` tree. It does not touch files outside that package.

### What It Does Not Change

- does not touch files outside target package `src/`

### Safety

- fails fast on rename collisions

### Post-Migration Checklist

After dry-run output looks correct:

1. run without `--dry-run`
2. review renamed paths in the diff
3. run package checks

## `@bsport/nx-migration:upgrade-pnpm`

Update the repo's pinned pnpm version with guardrails for stable, non-breaking upgrades.

### Input

- `version`
- `allowMajor` (optional, default `false`)

### Usage

Start with a dry-run:

```bash
pnpm exec nx g @bsport/nx-migration:upgrade-pnpm 10.33.0 --dry-run
```

Interactive prompt mode:

```bash
pnpm exec nx g @bsport/nx-migration:upgrade-pnpm
```

### What It Changes

1. `/.npmrc`
   - updates `pnpm_version=...`
2. `/.mise.toml`
   - updates the pinned `pnpm = "..."` entry under `[tools]`
3. `/package.json`
   - updates `engines.pnpm`
   - updates `packageManager` if that field already exists

### Safety

- accepts only stable `x.y.z` versions
- rejects major version changes by default
- requires `--allowMajor` for major upgrades so they stay explicit and reviewed

### What It Does Not Change

- does not rewrite `pnpm-lock.yaml`
- does not run `pnpm install` or `pnpm dedupe` for you

### Post-Migration Checklist

After dry-run output looks correct:

1. run without `--dry-run`
2. refresh your local toolchain:

```bash
mise install
pnpm --version
```

3. run:

```bash
pnpm install --frozen-lockfile --prefer-offline
pnpm dedupe --check
```

4. if dedupe check fails, run:

```bash
pnpm dedupe
```

5. review any resulting `pnpm-lock.yaml` changes

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
