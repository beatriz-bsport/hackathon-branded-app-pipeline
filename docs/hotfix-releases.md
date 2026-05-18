# Hotfix releases

Use this process when production needs a fix based on a specific released
version instead of the current `dev` branch.

The release system uses Nx Release, Conventional Commits, Git tags, and GitLab
Releases. Normal releases run from `dev` and resolve the latest semver tag from
all branches. Hotfix releases run from a dedicated hotfix branch and resolve the
latest semver tag from that branch only, so a branch created from `v1.20.0`
produces `v1.20.1` instead of jumping to the latest `dev` version.

## Branch from the released tag

Fetch tags and create the hotfix branch from the exact version to patch:

```bash
git fetch origin --tags
git switch -c hotfix/v1.20.x v1.20.0
git push origin hotfix/v1.20.x
```

Branch naming must match:

```text
hotfix/v<major>.<minor>.x
```

Examples:

```text
hotfix/v1.20.x
hotfix/v2.4.x
```

## Implement the fix

Create a working branch from the hotfix branch:

```bash
git switch -c fix/payment-timeout hotfix/v1.20.x
```

Commit with Conventional Commits. A production hotfix should normally use a
`fix` commit so Nx resolves a patch version:

```text
fix(payments): prevent retry timeout
```

Open the merge request into the hotfix branch, for example
`hotfix/v1.20.x`, not into `dev`.

## Preview the release tag

Merge request pipelines expose `Release:Tag` as a manual dry run. For merge
requests targeting a hotfix branch, the job runs with hotfix tag resolution.

You can also preview locally:

```bash
pnpm exec nx run @bsport/nx:release-tag --hotfix --dryRun
```

For a branch created from `v1.20.0` with a `fix` commit, the expected next tag
is `v1.20.1`.

## Create the hotfix release

After the merge request is merged into the hotfix branch, the push pipeline on
that branch automatically runs `Release:Tag` in hotfix mode.

The job:

- resolves the next fixed monorepo semver tag using commits since the hotfix
  branch's release tag
- creates an annotated Git tag such as `v1.20.1`
- pushes only `refs/tags/v1.20.1`
- creates or updates the matching GitLab Release with the Nx-generated
  changelog
- emits `RELEASE_TAG`, `RELEASE_TAG_AVAILABLE`, and
  `RELEASE_TAG_COMMIT_SHA` for downstream jobs

The `Release:Build Artifact` job then automatically builds and uploads the
release artifact using the created tag, for example:

```text
s3://bsport-frontends-artifacts-euw3/backoffice/v1.20.1
```

## Bring the fix back to dev

After the hotfix release is created, merge or cherry-pick the hotfix commit back
into `dev`.

This keeps the normal release line from losing the production fix.

## Notes

- Do not create hotfix branches from `dev`; create them from the release tag
  being patched.
- Keep hotfix branches narrow. They should contain only the fix and any required
  verification changes.
- If `Release:Tag` reports that no release tag was created, check that the
  merged commits include a Conventional Commit type that triggers a release,
  such as `fix`.
- The automatic hotfix pipeline only creates the Git tag, GitLab Release, and
  S3 artifact. It does not deploy the artifact automatically.
- Normal `dev` releases still use all-branch tag resolution. Only hotfix runs
  pass `--hotfix` to branch-local tag resolution.
