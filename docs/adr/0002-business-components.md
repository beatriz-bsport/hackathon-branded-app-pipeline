---
status: accepted
date: 2026-06-23
---

# Business Components

## Context

The Backoffice revamp is large, and no one reviews every page. The result, seen
repeatedly:

- designers re-design a pattern that already exists, with inconsistent copy;
- different teams build flows that should be unified in their own divergent ways;
- developers implement the same pattern twice — same design, different internal
  logic that can't be seen on Figma.

The cost is **velocity loss**, **code duplication** (hard to maintain), and
**inconsistent UX/UI**. **Business Components** are one answer.

Studio Manager apps range from pure presentational primitives to
components that carry real bsport business logic. Kaizen's primitive layer
(`@bsport/kaizen-primitive-core`) is UI-only by design and is the wrong home for
components that fetch data, encode bsport rules, or ship their own translations.
We need a shared definition of what a **Business Component** is, where it lives,
and — crucially — _when not to create one_.

The polished, canonical reference is the
[Business Components Masterclass][masterclass] (Kaizen Design System); the
original formal decision is the [Business Components ADR][adr]. This file records
the operative decision so it is versioned in the repo and usable by tooling
(notably the `find-business-components` skill) without Notion access. If this
file and the Masterclass disagree, the Masterclass wins.

[masterclass]: https://app.notion.com/p/Business-Components-Masterclass-36b137e4c6408024bf85ff5fcf653ae0
[adr]: https://app.notion.com/p/Business-Components-ADR-2cb137e4c64080df9c0afceb26cec41a

## Decision

### 1. Definition

> **A Business Component answers a unique business need and ensures design and
> behaviour consistency across our different pages and applications.**

Three parts:

- **A unique business need.** Not a generic UI component (Button, Modal) — it
  maps to something _named in the business domain_: "select an establishment",
  "assign a tag after purchase", "pick a company in a franchise". When a PM says
  "let the user pick an establishment here", there should be a component for
  exactly that.
- **Design and behaviour consistency.** The same action, done in different places
  for the same purpose, should look and behave the same. A Business Component
  encodes the canonical version of that interaction **once** — instead of each
  engineer reinventing loading/empty/error/infinite-scroll states.
- **Across pages and applications.** It lives in its **own package** that
  multiple apps import. This creates a dependency _intentionally_ — that
  dependency is what guarantees consistency.

Examples:

- **EstablishmentSelector** — search and select one or more establishments; used
  in the Session, Pass, Benefit (contracts) and Marketing Notification forms.
- **TagsAfterPurchaseSelector** — select tags grouped by category, one per
  category, on a buyable; knows the tag/tag-group lifecycle and fetches it.

### 2. The four UI layers

Inconsistency in a domain usually means something was built at the **wrong
layer**, or a layer in between doesn't exist yet. Each layer builds on the one
below.

| Layer                       | What                                                                                               | Rule of thumb                                                                                                                |
| --------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **1 — Tokens & Components** | Tokens; raw components (Button, Input, Badge, Modal); complex components (Table, Date Picker)      | Could drop into _any_ SaaS product.                                                                                          |
| **2 — UI Patterns**         | Combinations solving a recurring UX problem (Filter, bulk selection)                               | Solves a problem, but still fits _any_ SaaS.                                                                                 |
| **3 — Product Patterns**    | Reusable workflows around objects (Create/Edit `{object}`, a destructive modal for bsport objects) | If you can swap "object" for session/member/invoice/tag and it still fits, it's a product pattern — not yet bsport-specific. |
| **4 — Business Components** | Carry business logic + domain language; often combine product patterns into one standardized piece | **Make sense only in bsport.**                                                                                               |

A Business Component is **Layer 4**. If a thing fits Layers 1–3, it is _not_ a
Business Component (it belongs in Kaizen / the design system).

### 3. The decision framework — when to create one

Ask these three questions **in order**. _"When in doubt, don't refactor —
extracting later isn't complex."_

1. **Is it used (or likely to be) consistently across multiple applications?**
   If it lives in one app with no plan to share, keep it local. Extraction
   creates a cross-application dependency — right when genuinely shared, overhead
   when not.
2. **Does it contain specific bsport business logic** — specific behaviour, API
   calls, translations? A generic date-range picker with no business logic is
   **not** a Business Component _even if used in 10 apps_ — it belongs in Kaizen.
3. **Are you OK introducing a dependency** between your app and the BC package?
   The final gate (usually yes): you opt into a shared release cycle.

**Yes to all three ⇒ create the Business Component.**

### 4. Where they live

One consolidated package, **`@bsport/kaizen-business-components`** (at
`packages/design-system/kaizen/business`), one folder per vertical under
`src/components/` (today: `booking`, `cdp`, `core`, `buyables`,
`financial-services`, `form`). Put a component in the vertical **responsible for
its business logic**. A Hygen generator scaffolds new components:
`pnpm --filter @bsport/kaizen-business-components component:add`.

Public components are exported via **package.json subpath exports** (`./*`), not
a root barrel — so consumers import only what they need and the package is
bundled in isolation:

```ts
import { TagsAfterPurchaseSelector } from "@bsport/kaizen-business-components/buyables/tags-after-purchase-selector";
```

### 5. Data: a Business Component owns its own fetching

This is the key shift from the legacy model. In legacy, data was fetched at the
page level and **drilled into a UI shell as props** — every consuming page
replicated the API call, normalisation, and error handling (copy-pasted; when the
API changed you hunted every copy).

A Business Component that uses backend data **owns its own data fetching**: it
knows the endpoint, caches via React Query, and handles loading/error states. The
consuming app just drops it in and provides a few limited props — the **`fetch`
instance** (to identify which app made the call), a form field name, minor
customization:

```ts
<TagsAfterPurchaseSelector fieldName="tags_on_consumer_item_creation" fetch={fetch} />
```

No API call to write, no loading state to manage, no translation key to declare.

### 6. Dependencies & translations

- **Allowed deps:** all Kaizen primitives by default; `@bsport/form`,
  `@tanstack/react-query`, `@bsport/store-*`, `@bsport/api-*` as needed.
- **`fetch` is never a package dependency.** It is an **injected peer
  dependency** (`@bsport/fetch`) passed by the consuming app, so calls are
  attributable to the originating app and Kaizen stays a UI library. React Query
  is likewise a peer dependency provided by the app.
- **Translations live in the component** — a BC is an abstraction of a specific
  business context. Avoid props that override text content. (Per-vertical i18n
  source in `src/i18n/source/`.)

### 7. Discover before you build

Before implementing something that smells like a Business Component, **check
whether it already exists** — thirty seconds of search saves days and keeps the
codebase consistent:

- **Storybook** — `https://docs.infra.bsport.io/storybook/kaizen/dev/` (story
  ids look like `business-<vertical>-<component>`, e.g.
  `business-core-establishmentselector`). Caveat: only shows _implemented_
  components that have a story.
- **The Business Components registry** (Notion table) — captures components
  including ones only at the design/vision stage: name, what it does, which apps
  use it, the business definition.
- New candidates are added to the registry and tracked in the
  [Linear Business Components project](https://linear.app/bsport/project/business-components-6ce8fd193418/overview).

## Consequences

- Teams get a clear "extract or not" framework and a single home for business
  components, cutting both duplicated business logic and premature coupling.
- Extraction introduces a deliberate cross-app (and possibly cross-team)
  dependency and shared release cycle — accept it only when the logic is
  genuinely shared.
- The payoff: a few lines of usage instead of replicated fetch/state/translation
  code, and consistent UX everywhere.
- Candidate discovery is driven separately — see the `find-business-components`
  skill (`.ai/skills/find-business-components`), which surveys Studio Manager
  apps for extraction candidates and duplicated business logic and produces
  extraction plans for the owning teams to weigh.
