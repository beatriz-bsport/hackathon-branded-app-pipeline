# @bsport/nx

Unified Nx plugin for Studio Manager workflows.

It groups the repo's custom Nx surface in one package:

- generators for repo and Studio Manager migrations
- executors for Studio Manager local development workflow
- inferred targets for Studio Manager local runtime entrypoints

## `@bsport/nx:migrate-to-library`

Migrate a Studio Manager app from the legacy composed runtime shape to workspace library mode.

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
pnpm exec nx g @bsport/nx:migrate-to-library sm-giftcard --dry-run
```

Interactive prompt mode:

```bash
pnpm exec nx g @bsport/nx:migrate-to-library
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

## `@bsport/nx:migrate-filenames-to-kebab-case`

Rename target package `src/` files and folders to kebab-case and update local references.

### Input

- `appName`

Accepted `appName` formats:

- `sm-segment`
- `@bsport/sm-segment`
- `segment`

All formats normalize to `sm-<name>`.

### Usage

Start with a dry-run:

```bash
pnpm exec nx g @bsport/nx:migrate-filenames-to-kebab-case sm-segment --dry-run
```

Interactive prompt mode:

```bash
pnpm exec nx g @bsport/nx:migrate-filenames-to-kebab-case
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

## `@bsport/nx:upgrade-pnpm`

Update the repo's pinned pnpm version with guardrails for stable, non-breaking upgrades.

### Input

- `version`
- `allowMajor` (optional, default `false`)

### Usage

Start with a dry-run:

```bash
pnpm exec nx g @bsport/nx:upgrade-pnpm 10.33.0 --dry-run
```

Interactive prompt mode:

```bash
pnpm exec nx g @bsport/nx:upgrade-pnpm
```

### What It Changes

1. `/.mise.toml`
   - updates the pinned `pnpm = "..."` entry under `[tools]`
2. `/package.json`
   - updates `engines.pnpm`
   - updates `packageManager`

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

## `@bsport/nx:release-tag`

Create the next unified semver Git tag from Conventional Commits and publish
the generated changelog as a GitLab Release.

This command does not edit package manifests, does not create a release commit,
does not write `CHANGELOG.md`, and does not publish packages.

### Usage

Preview the next tag locally:

```bash
pnpm exec nx run @bsport/nx:release-tag --dryRun
```

Create and push the tag:

```bash
pnpm exec nx run @bsport/nx:release-tag
```

Emit the resolved tag for downstream CI jobs:

```bash
pnpm exec nx run @bsport/nx:release-tag --outputFile=release-tag.env
```

Preview a hotfix release from a branch created from an older release tag:

```bash
pnpm exec nx run @bsport/nx:release-tag --hotfix --dryRun
```

### Behavior

- uses a single fixed monorepo version
- includes every Nx project in the release group, so app/package/tool commits can bump the unified tag
- reads the latest `v{version}` tag as the current version
- derives the next version from Conventional Commits since that tag
- generates the workspace changelog entry through Nx Release without writing a changelog file
- creates an annotated tag like `v1.2.3`
- pushes only `refs/tags/v1.2.3`
- optionally writes a dotenv file with `RELEASE_TAG_AVAILABLE=true`, `RELEASE_TAG`, and `RELEASE_TAG_COMMIT_SHA` when a release tag is available on `HEAD`
- creates or updates the matching GitLab Release with the generated changelog after the tag is available on the remote
- skips cleanly when no semver bump is detected
- treats reruns as successful when the computed tag already points to `HEAD`
- supports `--hotfix` to resolve release tags from the current branch only, which keeps a hotfix branch created from `v1.20.0` on the `v1.20.x` line even if newer tags exist on `dev`

GitLab authentication follows Nx Release defaults: set `GITLAB_TOKEN` or
`GL_TOKEN`, or rely on `CI_JOB_TOKEN` in GitLab CI.

### First release

If no `v*` semver tag exists yet, create the desired starting tag manually on `dev` before enabling the CI flow, for example:

```bash
git tag -a v1.0.0 -m v1.0.0
git push origin refs/tags/v1.0.0
```

After that, CI uses the latest `v*` tag as the baseline.

### CI

`tools/ci/release.yml` runs this command on `dev` push pipelines and exposes a manual web trigger on `dev`. It also runs automatically for `hotfix/v<major>.<minor>.x` push pipelines with `--hotfix`. The job uses `resource_group: release-tag`, so GitLab serializes tag and release creation.

Merge request pipelines expose the same job manually in dry-run mode. For merge requests targeting `hotfix/v<major>.<minor>.x`, the dry run also uses `--hotfix`. Use it before merge to verify what Nx resolves from the MR pipeline git history without creating a tag, pushing a tag, or publishing a GitLab Release.

Hotfix branches named `hotfix/v<major>.<minor>.x` run the same job automatically on push with `--hotfix`. See `docs/hotfix-releases.md` for the full workflow.

The root GitLab workflow skips only semver release tag pipelines (`vX.Y.Z`). Other tag pipelines, such as feature-branch deploy tags, still run.

After `Release:Tag` succeeds on `dev` or a hotfix branch, `Release:Build Artifact` reuses the same aggregate build flow as ephemeral environments and uploads the artifact snapshot to `s3://bsport-frontends-artifacts-euw3/backoffice/<release-tag>`, for example `backoffice/v1.21.1`. This artifact publication is independent from dev deploy; dev still uses the normal `tools/scripts/deploy.sh` path.

If `CI_LINEAR_ACCESS_KEY` is configured in GitLab CI, `Release:Linear Sync`
runs after the release artifact is created and syncs that same semver tag to the
Ichizen Linear release pipeline. The job uses `RELEASE_TAG` as the Linear release
version and `Ichizen <release-tag>` as the release name.

The sync only runs when at least one Linear issue id can be resolved from the
release commits. CI scans the full commit message for `ABC-123`-style ids and
also falls back to the GitLab merge request source branch for each release
commit. Source branches are fetched from the GitLab REST API using the CI
project context and `CI_JOB_TOKEN`; GitLab CI variables provide credentials and
project metadata but do not directly expose MR source branches for every commit
in the release range.

These commit message formats are all accepted:

```text
fix(sm-segment): [ce-3456] bad thing
feat(insights): embed frontend context for bookings AI summary BI-760
Refs BOO-2630
```

CI also extracts ids from merge request source branch names like
`ce-3456-bad-thing`. The branch name must start with the issue id. Resolved ids
are written to synthetic local refs under `refs/heads/linear-release-issues/*`
so the official `linear-release` CLI can see the ids while scanning git history.
The sync command also passes `--base-ref=<previous-release-tag>` so Linear scans
the same `<previous tag>..HEAD` range that the release tag job produced. If no
ids or no previous semver tag can be resolved, the Linear sync job skips instead
of tagging unrelated issues.

See [Hotfix Releases](../../docs/hotfix-releases.md) for the branch workflow.

## Development

## `@bsport/nx:dev`

Run a Studio Manager app in local composed mode:

```bash
pnpm exec nx run @bsport/sm-giftcard:dev:watch
```

This will:

1. read local runtime config from the app's `package.json`
2. start each declared companion app in the background
3. watch workspace dependencies and rebuild them on change
4. start the main app's Vite dev server

Standalone mode:

```bash
pnpm exec nx run @bsport/sm-giftcard:dev:watch --remotes=
```

Debug mode:

```bash
pnpm exec nx run @bsport/sm-giftcard:dev:watch --debug
```

The plugin is registered in `nx.json` and infers a `dev:watch` target for Studio Manager apps with `federation.devPort` in `package.json`. The single-app Vite target remains the existing `dev:single` script target.

## Development

Run tests for this plugin:

```bash
cd tools/nx
pnpm exec vitest run
```

Run typecheck:

```bash
cd tools/nx
pnpm exec tsc --noEmit
```
