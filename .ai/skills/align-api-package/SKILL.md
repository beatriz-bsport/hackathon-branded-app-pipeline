---
name: align-api-package
description: Align a packages/api/* package with the TanStack Query conventions in ADR-0001 — vanilla builders, canonical query keys, no root barrel. Audit-then-fix, one resource at a time, strictly behavior-preserving. Use when asked to align/migrate an API package, fix react-query conventions, remove a root barrel, canonicalize query keys, or move staleTime/select out of a package.
---

# Align an API package with ADR-0001

This skill brings a `packages/api/*` package into line with
[`docs/adr/0001-tanstack-query-api-package-conventions.md`](../../../docs/adr/0001-tanstack-query-api-package-conventions.md).
It is a **migrator**: audit first, then fix. It operates **one resource at a
time** (e.g. `cdp/member`), and every automatic change is **strictly
behavior-preserving** — observable runtime behavior never changes.

The mechanical work is done by a suite of Nx generators in `tools/nx`
(`@bsport/nx:*`). This skill is the orchestrator: it runs the generators,
makes the judgment calls they can't, and gates on verification.

## What "aligned" means (the four rules)

1. **Vanilla packages** — builders carry only `queryKey`, `queryFn`, and
   endpoint-intrinsic wiring (`getNextPageParam`/`initialPageParam`). No React,
   no hooks. App-preference options (`staleTime`, `gcTime`, `enabled`,
   `select`, `retry`) live in the app.
2. **Suspense + `QueryBoundary`** — _advisory only_. This skill never rewrites
   loading/error strategy (it changes UX, which is not behavior-preserving). It
   reports Rule 2 findings for a human to act on.
3. **No root barrel** — `sideEffects: false`, resource `index.ts` use explicit
   named re-exports (no `export *`), consumers import from resource subpaths
   (`@bsport/api-cdp/member`), and the root `.` barrel is deleted.
4. **Canonical key invariants** (not a closed enum):
   - rooted at `[QUERY_KEY_MAIN, "<resource>"]` via `all`;
   - **never spread params** — the whole params object is one key segment;
   - parameterized keys sit under a collection tier (`lists()`/`list(params)`,
     `details()`/`detail(id)`) so invalidation can target the collection;
   - the standard list/detail/infinite trio uses canonical names; infinite keys
     are children of `lists()`;
   - domain-specific keys (`search`, `latest`, `categories`, …) are allowed if
     they obey the invariants above.

See [`reference/invariants.md`](reference/invariants.md) for the full
cheat-sheet and worked before/after examples.

## Scope

- Targets: any package under `packages/api/*` (book, cdp, core, buyables,
  platform, member-experience, financial-services, staff-management,
  business-insights). Never legacy zones.
- Unit of work: **one resource**. Run the loop below per resource.
- This skill **does not touch git** — it leaves a reviewable working tree and a
  summary. The human commits.

## The loop

Run these in order. **Stop at the checkpoint** (step 3) and wait for go/no-go
before any fix.

### 0. Baseline (mandatory)

Before editing anything, record what is _already_ failing so it is not blamed
on the migration:

```bash
pnpm exec nx affected -t ci:compile lint test --base=HEAD
```

Note any pre-existing failures. Only **new** failures after a fix are yours.

### 1. Audit (read-only)

```bash
pnpm exec nx g @bsport/nx:audit-api <pkg>          # whole package
pnpm exec nx g @bsport/nx:audit-api <pkg> --resource=<resource>
```

`<pkg>` accepts `cdp` / `api-cdp` / `@bsport/api-cdp`. The audit reports, per
resource: Rule 1/3/4 violations, the count of root-barrel import sites in
consumers, and Rule 2 advisories. It writes nothing. This is also the
**standalone audit mode** — stop here if you only want a report.

### 2. Classify the keys (judgment — this is your job, not the generator's)

For the target resource, read its key factory and decide the
**rename/restructure map** the generator will apply mechanically:

- Map existing standard keys onto canonical names (`listScope → lists`, add the
  missing `details()` tier, etc.).
- Collapse any param-spreading key to a single params-object segment.
- Keep honestly-named domain keys (`search`, `latest`, …) — only ensure they
  obey the invariants (rooted at `all`, no spread, collection tier when
  parameterized).
- Decide where relocated app-prefs go: the value (e.g. `MEMBER_STALE_TIME`)
  stays exported from the package; it must be re-applied **verbatim** at every
  consumer call site. Never drop it.

Read the endpoint (`fetch*API` URL + return type) to classify honestly — a
search endpoint is a `search` key, not a fake `list`.

### 3. CHECKPOINT — present the plan, get go/no-go

Summarize for the human before editing: the divergences found, the
rename/restructure map you chose, the blast radius (how many consumer
invalidation/import sites change, from the project graph), and which package(s)
become `affected`. **Wait for approval.**

### 4. Fix (after approval) — per resource

Apply the generators relevant to the resource. Each is independently
dry-runnable with `--dry-run`; preview first.

```bash
# Rule 1 — relocate app-prefs to call sites, make builder vanilla
pnpm exec nx g @bsport/nx:vanillaize-builders <pkg> --resource=<resource>

# Rule 4 — apply your rename/restructure map across the package AND every
# consumer invalidation site
pnpm exec nx g @bsport/nx:canonicalize-keys <pkg> --resource=<resource> --map=<json>

# Rule 3 phase 2 — migrate this resource's barrel import sites to the subpath
pnpm exec nx g @bsport/nx:migrate-barrel-imports <pkg> --resource=<resource>

# Rule 3 phase 3 — delete the root barrel (only fires when remaining count == 0)
pnpm exec nx g @bsport/nx:delete-barrel <pkg>
```

`delete-barrel` also sets `sideEffects: false` and removes the `.` export.

**Not auto-fixed yet:** converting a resource `index.ts` from `export *` to
explicit named re-exports. `audit-api` flags it, but a safe codemod needs the
type-vs-value distinction per symbol, so do it by hand for now (or extend the
generator). It is a tree-shaking nicety, not required for barrel removal.

### 5. Verify (mandatory — note the gap)

```bash
pnpm exec nx affected -t format ci:compile lint test
```

⚠️ **`verify:affected` omits `ci:compile`.** You must run `ci:compile`
explicitly — it is the _only_ thing that catches a missed renamed-key call site
in a consumer app. Run `affected` so consumer apps recompile against the changed
package's types.

### 6. Failure handling (class-aware)

- **Mechanical failures** (`format`, `lint --fix`, leftover-rename `tsc`
  errors): auto-resolve in a bounded loop (re-run the generator or fix the
  obvious site), then re-verify.
- **A NEW test failure**: **HARD STOP.** After a strictly behavior-preserving
  migration, a newly-red test means the migration was _not_ actually
  behavior-preserving. Do not auto-patch the test. Surface it to the human with
  the diff and the failing output. This is the tripwire that protects Rule 1's
  "never drop, always relocate" guarantee.

### 7. Summary (always)

Emit: files changed, "invalidate these keys" notes for reviewers, and the Rule 2
advisories. Leave the working tree clean of git operations.

## Idempotency

`audit-api` is the source of truth for "is this resource aligned." Every fixer
is a no-op when its invariant already holds, so re-running is safe and partial
completion recovers from the actual current state — there is no saved
checkpoint to corrupt.

## Notes

- Read `.ai/guidelines/_FRONTEND_GUIDELINES.instruction.md` before editing code
  (repo rule). New/edited files use kebab-case.
- The generators are the source of mechanical truth; this skill never
  hand-edits hundreds of import sites. If a generator is missing a capability,
  extend the generator (and its spec) rather than hand-editing.
  </content>
  </invoke>
