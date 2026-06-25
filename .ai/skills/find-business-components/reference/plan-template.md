# Extraction plan template

One file per selected candidate: `docs/business-components/candidates/NNN-<slug>.md`.
Write for the **weakest plausible executor** — a different agent or developer
with zero context from the discovery session. Everything needed must be inlined.
Excerpts come from your own reads of the real files, never from a Pass-1 summary.

---

```markdown
# NNN — Extract <ComponentName> to @bsport/kaizen-business-components

- **Type:** A (qualifies) | B (duplicated across apps)
- **Target:** `@bsport/kaizen-business-components/<vertical>/<component>`
- **Data:** none (frontend/form only) | self-fetching (owns its fetch)
- **Confidence:** high | medium | low
- **Written against commit:** `<git short sha>`

## Why this is a Business Component (ADR-0002 / Masterclass basis)

The three questions, answered with evidence:

1. **Cross-application reuse:** <the ≥2 applications that use or duplicate it —
   list them; this is what justifies extraction>
2. **bsport business logic:** <the unique business need it answers; the
   behaviour / API calls / translations that make it Layer 4, not a generic
   Layer 1–3 component>
3. **Dependency acceptable:** <why the cross-application dependency + shared
   release cycle is worth it here>

## Current state — every existing implementation

For each location (the more, the stronger the case):

- `path/to/unit` — <files in the unit, what it does, key deps, divergences from
  the others>. Include the relevant code excerpt.

## Divergences to reconcile

What differs between the copies (props, behavior, translations, fetch shape) and
the decision for the merged component. Note what the unified API must support.

## Proposed component

- **Public API** — limited props: the injected `fetch` instance, a form field
  name (if a form field), minor customization. As close to native as possible.
- **Data:** the component **owns its own fetching** (endpoint, React Query
  caching, loading/error). Do **not** propose the legacy "UI shell with data
  drilled in as props" — that's the anti-pattern being replaced.
- **Translations** move into the component (`src/i18n/source/<vertical>.json`).
- **Peer/deps**: `@bsport/fetch` + `@tanstack/react-query` (peer, injected by the
  app), plus any `@bsport/api-*` / `@bsport/form` / `@bsport/store-*` actually used.

## Steps (ordered, each verifiable)

1. Scaffold: `pnpm --filter @bsport/kaizen-business-components component:add`
   (vertical `<vertical>`, name `<Component>`).
2. Implement the component, owning its data fetching, mirroring an existing unit
   as the pattern: `<path to a good existing business component>`.
3. Move translations; wire i18n.
4. Add a Storybook story (plug `fetch` to `dev`); add tests mirroring
   `<existing test>`.
5. Replace each in-app implementation with the imported component, one app at a
   time; delete the old local unit only after its call sites compile.

## Out of scope / do not touch

- Files that look related but must not change: <list>.
- Do not alter unrelated app behavior; this is a behavior-preserving extraction.

## Done criteria (machine-checkable)

- `pnpm exec nx run @bsport/kaizen-business-components:lint` / `:ci:compile` pass.
- Each consuming app still type-checks: `pnpm exec nx run @bsport/<app>:ci:compile`.
- No remaining local copies (grep shows only the new import).

## Escape hatches

- If the copies turn out to serve _different business needs_ (same UI, different
  meaning), STOP — they may be different components, or a lower-layer Kaizen
  pattern; report back instead of forcing a merge.
- If reuse is actually single-app on closer reading, STOP — per ADR-0002 this is
  not a business component.

## Maintenance note

What future changes interact with this; what to watch in review (e.g. new
consumers must inject their own `fetch`).
```
