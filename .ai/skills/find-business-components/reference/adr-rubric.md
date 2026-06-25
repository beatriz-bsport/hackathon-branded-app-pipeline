# Business Component rubric — operational cheat-sheet

Full decision:
[`docs/adr/0002-business-components.md`](../../../../docs/adr/0002-business-components.md),
aligned to the **Business Components Masterclass** (canonical). When this sheet
and the ADR disagree, the ADR wins; when the ADR and the Masterclass disagree,
the Masterclass wins. This file is the checklist Pass-1 subagents and the Pass-2
judge apply.

## Definition

> A Business Component **answers a unique business need** and **ensures design
> and behaviour consistency across our different pages and applications.**

It lives in its own package (`@bsport/kaizen-business-components`), imported by
multiple apps — the cross-application dependency is intentional and is what guarantees
consistency.

## The layer test (what is NOT a Business Component)

A Business Component is **Layer 4**. If a unit fits a lower layer, reject it:

| Layer                               | Example                                                      | Verdict                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 1 — Tokens & raw/complex components | Button, Modal, Table, Date Picker                            | Kaizen primitive, **not** a BC                                                                           |
| 2 — UI Patterns                     | Filter, bulk selection                                       | Kaizen, **not** a BC                                                                                     |
| 3 — Product Patterns                | Create/Edit `{object}`, destructive modal for bsport objects | Pattern, **not** a BC (swap "object" for session/member/tag and it still fits ⇒ not yet bsport-specific) |
| 4 — Business Components             | EstablishmentSelector, TagsAfterPurchaseSelector             | ✅ BC                                                                                                    |

## The three questions (a candidate must pass all three)

1. **Cross-application reuse** — used, or duplicated, across **≥2 applications**.
   A single-app unit with no sharing plan ⇒ **auto-reject** ("when in doubt,
   don't refactor"). The strongest, most objective signal.
2. **bsport business logic** — specific behaviour, API calls, and/or
   translations tied to the domain. A generic date-range picker is **not** a BC
   _even if used in 10 apps_ (it's Layer 1).
3. **Dependency is acceptable** — extraction creates a deliberate
   cross-application dependency + shared release cycle. (Usually fine; name it.)

Signals that Q2 logic is present: imports `@bsport/api-*`, uses an injected
`fetch`, ships its own translations, encodes bsport rules/entities.

## Reject bucket (record, don't hide)

| Reject                               | Why                                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **Single-use** (one app, no sharing) | Fails Q1. "Don't refactor early." Reuse is required.                                                    |
| **Generic / lower-layer**            | Fails Q2 / the layer test — belongs in Kaizen, not a BC.                                                |
| **Already extracted**                | Imported from `@bsport/kaizen-business-components` (check Storybook `business-<vertical>-<component>`). |
| **Legacy-only**                      | Under `saas-legacy` — a _source_ of candidates, not itself the home.                                    |

Default posture: **bias to under-report.**

## Ranking (leverage)

`(duplicate copies × apps/domains spanned × business-logic strength) ÷ extraction effort`

1. Cross-domain duplicates (highest).
2. Intra-domain, multi-app duplicates.
3. Strong-but-borderline (only if Q1 reuse genuinely holds).

## Where an extracted component lands

- Package: **`@bsport/kaizen-business-components`**
  (`packages/design-system/kaizen/business`).
- Vertical folder under `src/components/` owning the logic — today: `booking`,
  `cdp`, `core`, `buyables`, `financial-services`, `form`.
- Subpath export, no root barrel:
  `import { X } from "@bsport/kaizen-business-components/<vertical>/x"`.
- Scaffold: `pnpm --filter @bsport/kaizen-business-components component:add`.

## Data & dependency rules

- **A BC owns its own data fetching** (self-fetching): it knows the endpoint,
  caches via React Query, handles loading/error. The legacy "UI shell with data
  drilled in as props" is the **anti-pattern** — do not propose it.
- The consuming app provides only limited props: the **`fetch` instance**
  (injected `@bsport/fetch` peer dep, identifies the calling app), a form field
  name, minor customization.
- Allowed deps: Kaizen primitives, `@bsport/form`, `@tanstack/react-query`
  (peer), `@bsport/store-*`, `@bsport/api-*`. Never bundle `fetch`.
- **Translations live in the component** (per-vertical i18n in `src/i18n/source/`).

## Discovery (negative signals)

Treat a candidate as "already covered" if it appears in:

- **Storybook** — story ids `business-<vertical>-<component>`.
- The **Business Components registry** (Notion table) — may list components only
  at the design stage. Notion access is not universal; never hard-depend on it.
