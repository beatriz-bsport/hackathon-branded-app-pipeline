---
name: smartlist-filters-cdp
description: Add or extend Smartlist filters in studio-manager CDP smartlists (new filter cards, wiring, tests). Pair with smartlist-add-sub-filter.skills.md for sub-filters.
---

# Smartlist filters (CDP Smartlists)

This skill applies **only** to the revamped Smartlists UI:

`apps/applications/studio-manager/cdp/smartlists/`

Do **not** use it to change legacy Smartlist filter code under `saas-legacy` or under `components/smartlist-filters/` unless you are explicitly asked to migrate or align behaviour.

## How to use this document (generic + appended context)

This file describes **architecture and process** that stay the same across filter types (identifier, API shape, hydration key, etc.).

Before implementing a **concrete** filter, append or attach the filter-specific contract (for example `.cursor/smartlist-payment-pack-filter-contract.md` for filter identifier **19** / payment pack). That appendix holds non‑negotiable API rules, enums, validation matrices, and hydration rules so this skill stays generic.

---

## Tech stack (required)

Implementations in this package must align with existing CDP Smartlists conventions:

- **Language:** TypeScript everywhere.
- **Forms:** `@bsport/form` with `useFormController`, **Zod** as the schema passed into the controller, **React Hook Form** semantics (`dirtyFields`, `setValue`, etc.) as exposed by that layer.
- **Server state:** **TanStack React Query** for fetches and mutations (no new ad‑hoc `useAsync` + manual fetch patterns for this surface).
- **UI:** **Kaizen** (`@bsport/kaizen-primitive-core`) for layout, buttons, menus, popovers, toasts, fields.
- **Validation UX:** surface field errors via component APIs (`status` / `errorText` / `statusText` as documented per component); use **toast** for save/delete/API failures where the app already does, instead of inventing parallel global error state for the same failure.
- **i18n:** no user-facing hardcoded strings for filter UI; use `useTranslation` and keys in the smartlists filters source (see below).

Project-wide preferences from the team (hooks, memoization, etc.) apply as documented in your repo rules; do not introduce a second, conflicting form stack for these filters.

---

## i18n (required)

- **Runtime namespace:** `filters` (consumed via `useTranslation("filters")` where the app does today).
- **i18n instance namespace string** for Zod / non-hook call sites: `sm-smartlists_filters` (must match how other strings in this package resolve).
- **Source file:** `apps/applications/studio-manager/cdp/smartlists/src/i18n/source/filters.json`
- **Key layout:** group keys by filter identifier, e.g. payment pack uses `filters.19.*` (`title`, `actions`, `fields`, `subFilters`, `validation`, `toasts`, …). New filters should use `filters.<filterIdentifier>.*` the same way.

Primitive building blocks (e.g. numeric comparator operator labels) may use their existing namespaces (such as `details`) if that is already how the primitive is written—do not fork duplicate English strings in `filters` unless product asks for it.

---

## Directory and ownership rules

Within `cdp/smartlists`:

- **Filter feature code** lives under `src/components/filters/<filter-name>/` (example: `passes-filter/` for the payment pack / pass filter).
- **Unit tests** for a given filter belong under `src/__tests__/filters/<filter-name>/` and should **only** cover that filter’s mappers, schema, dirty patch builders, and small pure helpers.

Keep each filter’s tests and implementation scoped so another filter cannot silently depend on passes-filter test utilities unless you deliberately share a `__tests__/filters/_shared/` helper (prefer duplication over unclear coupling unless shared helpers already exist).

---

## Architecture: what “a filter” is in this app

At a high level, a Smartlist filter product feature is built as:

1. **Hydration**  
   List/detail data comes from the Smartlist group endpoint and the agreed JSON key per filter identifier (see your appended contract). After mutations, the same source is refetched and the UI is rebuilt from server truth.

2. **List / manager component**  
   Renders zero or many filter **cards**, handles “add filter”, loading and empty states, and passes each row’s DTO into a card.

3. **Card component**  
   Owns one filter instance: default or hydrated values, `useFormController` + Zod schema, save (create vs patch), delete, and delegates field groups to smaller presentational components.

4. **Optional sub-filter system**  
   If the filter supports optional sections (e.g. purchase date, expiration, credits), model them as **registered modules** (registry + per-module folder with UI, schema refine slice, API read, create slice, dirty patch slice). The card and root schema iterate the registry so adding or removing a sub-filter is mostly local to one folder + registry + a few wiring points.

Exact API field names, PATCH rules, and validation matrices live in the **appended contract**, not in this file.

For **payment pack (filter 19)**, the reference implementation is under `components/filters/passes-filter/`. Use it as a pattern, not as a layer every future filter must copy file-for-file—other filters will have different DTOs, keys under `get_filters`, and sub-filter shapes.

---

## Adding a whole new Smartlist filter (checklist)

When introducing a **new** filter identifier to CDP Smartlists (not a new sub-filter on an existing one):

1. **Contract**  
   Add or attach a markdown contract (like the payment pack doc) describing identifier, `get_filters` key, CRUD routes, serializer fields, enums, validation, dirty PATCH rules, and post-mutation refetch.

2. **API types and hooks**  
   Extend or add types and React Query mutations/queries in the same patterns as existing smartlist filter API usage in this package.

3. **Form value type + defaults**  
   Define `*FilterFormValue`, default factory, and Zod root schema with `.superRefine` delegating to sub-modules if any.

4. **Mappers**  
   `api-to-form-value`, `form-value-to-create-payload`, and `build-dirty-patch` (or equivalent names) should be pure and unit-tested; PATCH must send **only** dirty fields per contract.

5. **UI**  
   `filter-manager` (or equivalent), list, card, fields, and sub-filter shell (popover + menu for “Add sub-filter” if applicable) using Kaizen and i18n keys under `filters.<id>.*`.

6. **Page wiring**  
   Mount the new list/manager from the Parameter (or other) page when that filter is in scope for the product.

7. **Tests**  
   Under `src/__tests__/filters/<filter-name>/`, cover schema acceptance/rejection, mapper round-trips or critical branches, and dirty payload shape. Use **Vitest** only unless the repo already mandates additional layers for this package.

8. **Sub-filters**  
   If this filter has optional sub-filters, follow **`smartlist-add-sub-filter.skills.md`** for each one and register them from this filter’s registry.

---

## Relationship to the sub-filter skill

Adding or removing a **sub-filter** on an **existing** filter card (without redesigning the whole filter) is documented in:

**`.cursor/skills/smartlist-add-sub-filter.skills.md`**

The pass filter (`passes-filter`) uses that pattern today (`PassSubFilterModule`, `REGISTERED_PASS_SUB_FILTERS`, etc.). Other filters should define their own module contract type and registry names, but the **separation of concerns** (Section UI, co-located refine, API read, create slice, dirty slice) should stay the same.

---

## Quick reference: payment pack filter (19)

| Concern             | Location (example)                                  |
| ------------------- | --------------------------------------------------- |
| Contract            | `.cursor/smartlist-payment-pack-filter-contract.md` |
| Feature root        | `.../src/components/filters/passes-filter/`         |
| Sub-filter registry | `.../passes-filter/sub-filters/registry.ts`         |
| Unit tests          | `.../src/__tests__/filters/passes-filter/`          |

This table is illustrative; new filters will have different paths and identifiers.

---

## Notes

- Prefer **small, reviewable PRs**: contract + types, then mappers + tests, then UI.
- Keep **one responsibility per file**: primitives render inputs; cards orchestrate form + mutations; mappers stay pure.
- If backend behaviour is ambiguous, **update the contract appendix** first, then implement.
