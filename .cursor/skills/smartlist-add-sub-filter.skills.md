---
name: smartlist-add-sub-filter-cdp
description: Add a new sub-filter module to an existing Smartlist filter card in studio-manager CDP smartlists. Companion to smartlist.skills.md.
---

# Adding a sub-filter to an existing Smartlist filter (CDP Smartlists)

This skill applies **only** to:

`apps/applications/studio-manager/cdp/smartlists/`

It describes the **architecture** for optional sub-filters on a filter card. Concrete field names, API flags, and validation rules still come from the **filter-specific contract** you append (for payment pack, see `.cursor/smartlist-payment-pack-filter-contract.md`).

Parent overview: **`.cursor/skills/smartlist.skills.md`**

---

## When to use this skill

- The product already has a **filter card** (form + save/delete) for a given Smartlist filter identifier.
- You need to add **one more optional section** (sub-filter) such as a date range, numeric comparator, or custom panel.
- You are **not** introducing a brand-new top-level filter identifier and `get_filters` key from scratch (that is the other skill).

---

## Architectural pattern (generic)

Regardless of filter type, a sub-filter module should bundle:

| Concern            | Responsibility                                                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stable id**      | String id used in the form’s `subFilters` array and aligned with API “active” flags (names differ per filter).                                                                                                |
| **Form slot**      | Dedicated branch on the filter form value (e.g. `purchaseDate`, `creditLeft`) with its own default.                                                                                                           |
| **Section UI**     | A small component that receives `value`, `errors`, `setValue`, `onRemove`, and a stable `id` prefix for inputs.                                                                                               |
| **Schema**         | A Zod fragment for the slot plus a `refine(value, ctx)` that runs **only** when this sub-filter is active in `subFilters`.                                                                                    |
| **Hydration**      | `readFromApi(serverRow)` → `{ isActive, partial }` so the parent can push the id and merge `partial` into form defaults.                                                                                      |
| **Create payload** | `appendCreatePayloadSlice(form)` → partial API body when the sub-filter is off (inactive defaults) or on (active fields).                                                                                     |
| **Dirty PATCH**    | `appendDirtyPatchSlice(dirtyFields, form)` → partial PATCH body; typically emit the full API slice for that concern when either `subFilters` or this slot’s subtree is dirty (match existing card behaviour). |

The **pass** filter names this contract `PassSubFilterModule` and keeps modules under `sub-filters/<name>/`. Another filter might use `FooSubFilterModule` and a different folder layout—the important part is the **same separation** and registry-driven composition.

---

## Reference implementation (pass / filter 19)

Study this tree as a **template** (names will differ for other filters):

- Contract: `.cursor/smartlist-payment-pack-filter-contract.md`
- Module contract type: `components/filters/passes-filter/sub-filters/pass-sub-filter-module-contract.ts`
- Registry: `components/filters/passes-filter/sub-filters/registry.ts`
- Example modules: `sub-filters/purchase-date/`, `sub-filters/expiration-date/`, `sub-filters/credit-left/` each with `*.module.tsx`, `*.component.tsx`, `schema.ts`, and optionally `utils.ts` for API↔form mapping reused across modules.

---

## Checklist: add one sub-filter

Complete these in order; adjust paths to your filter’s folder.

1. **Ids**  
   Extend the filter’s sub-filter id map (e.g. `PASS_SUB_FILTER_IDS`) with a new stable string consistent with API / legacy semantics.

2. **Form type and defaults**  
   Add the new slot to the filter form value type and to the default factory (use the correct default for that slot’s shape).

3. **Root Zod schema**

   - Allow the new id in the `subFilters` array schema (union / enum of literals).
   - Add the new slot to the root `z.object({ ... })` using the slot’s Zod fragment.

4. **Module folder**  
   Create `sub-filters/<kebab-name>/` with:

   - `schema.ts` — value schema + `refineXSubFilter`
   - `<name>.component.tsx` — card section + remove + primitive(s)
   - `<name>.module.tsx` — implements the module contract: `id`, `labelKey`, `Section`, `refine`, `readFromApi`, `appendCreatePayloadSlice`, `appendDirtyPatchSlice`
   - `utils.ts` **only if** mapping logic is shared or non-trivial; otherwise keep helpers in the module file.

5. **Registry**  
   Append the module to the ordered `REGISTERED_*` array. Order should match product expectations and any stable ordering of `subFilters` in API mapping.

6. **Root schema composition**  
   In the filter’s root schema file, ensure a `.superRefine` loop invokes every module’s `refine` (so rules stay next to the feature).

7. **Parent mapper**

   - **Hydration:** parent merges each module’s `readFromApi` `partial` and applies defaults for missing slots.
   - **Create:** parent folds `appendCreatePayloadSlice` across all modules; **do not** leave “inactive” API keys only in the parent if a module now owns that slice—avoid double defaults or omissions.

8. **Sub-filter shell UI**  
   Extend the component that lists active sub-filters and the “Add sub-filter” menu:

   - reset the form slot when the user removes the sub-filter
   - pass a stable `id` prefix into the Section for a11y / labels
   - widen `labelKey` typing for `t()` if TypeScript requires literal unions for new keys

9. **Card `fieldIds`**  
   Add a stable React `useId`-based id for inputs that need it.

10. **i18n**  
    Under `filters.<identifier>.subFilters.<key>` and `filters.<identifier>.validation.*` in `campaign-filters.json`, add labels and validation messages; use `sm-smartlists_campaign-filters` in Zod `i18nInstance.t` calls.

11. **Unit tests**  
    Under `src/__tests__/filters/<filter-name>/`, add or extend tests for: hydration when the API slice is active, schema refine paths, dirty PATCH payload when `subFilters` or the slot is dirty, create payload when the sub-filter is on/off. Keep tests **scoped to that filter’s directory**.

12. **Manual QA**  
    Add sub-filter, save, reload, edit fields, PATCH only dirty parts, remove sub-filter—behaviour must match the appended contract.

---

## Shared utilities across sub-filters

If two sub-filters share the same primitive (e.g. two date sections), it is acceptable to **reuse** one folder’s `utils.ts` from another (as with purchase and expiration dates) to avoid drift. Do not copy-paste large mapping tables without a shared helper—single source of truth reduces contract bugs.

---

## Tech stack reminder

Same as the parent skill: TypeScript, Zod, `@bsport/form` / RHF, React Query, Kaizen, i18n conventions, toasts for mutation failures where the app already does.

---

## Notes

- **One instance per sub-filter type** per card is enforced in product for pass filters; if a new filter allows multiples, your id model and UI need to reflect that explicitly (this skill assumes the common “at most one of each type” pattern unless the contract says otherwise).
- Removing a sub-filter from code later should be **mechanical**: delete folder, remove registry entry, remove id from enums/types, strip i18n keys only if unused elsewhere, update tests.
