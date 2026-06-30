---
name: add-global-alert
description: Add a new account-level global alert to the kaizen component and wire it up in studio-manager. Use when asked to add a new global alert kind.
---

## When to use

- The request mentions adding a new type of global alert for studio owners or managers.
- The change involves surfacing a new account-level action that may block or warn a user.

## Step 1 — Collect parameters

Before writing any code, ask the engineer for the following. Do not proceed until every required parameter is answered.

### Required

| #   | Parameter            | Description                                                                                                                                                   | Example                                                                      |
| --- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | **Kind slug**        | Kebab-case string literal for the new kind                                                                                                                    | `"overdue-payment"`                                                          |
| 2   | **Display priority** | Where in the ordered list it should appear (1 = highest). Use the current `globalAlertKinds` order as the source of truth and place the new kind accordingly. | `3` (inserts before stripe)                                                  |
| 3   | **Severities**       | Which severities this alert can have: `blocking`, `warning`, `info`, or any combination                                                                       | `"warning"` or `"blocking + warning"`                                        |
| 4   | **CTA type**         | One of: **internal** (app router path), **external** (opens a URL in a new tab), **intercom** (opens Intercom chat), **custom** (new callback prop needed)    | `internal`                                                                   |
| 5   | **CTA target**       | Depends on CTA type: path for `internal`, full URL for `external`, prop name for `custom` (e.g. `openPaymentPortal`)                                          | `"/billing/overdue"`                                                         |
| 6   | **Title** (EN)       | Short alert title                                                                                                                                             | `"Overdue payment"`                                                          |
| 7   | **Description** (EN) | One or two sentences explaining the issue and the action needed                                                                                               | `"A payment is overdue. Please resolve this to avoid account restrictions."` |
| 8   | **CTA label** (EN)   | Button text                                                                                                                                                   | `"Pay now"`                                                                  |
| 9   | **Backend trigger**  | Which hook/API feeds this alert and which field(s) to check                                                                                                   | `useFetchSubscriptionPaymentStatus` → `data.overdue.length > 0`              |

### Optional

| #   | Parameter          | Description                                                         | Default |
| --- | ------------------ | ------------------------------------------------------------------- | ------- |
| 10  | **Due date field** | API field that provides a deadline ISO string for the `DueDateChip` | none    |

---

## Step 2 — Implementation checklist

Work through these files **in order**. Every file must be updated before rebuilding.

### 1. Add the kind — `packages/design-system/kaizen/business/src/components/financial-services/global-alert/constants.ts`

Insert the new kind at the position matching the chosen **display priority** in the `globalAlertKinds` array. Earlier entries win in the blocking-alert selection and non-blocking ordering.

```ts
export const globalAlertKinds = [
  "unpaid-invoice",
  "disputed-invoice",
  // ← insert here for priority 3, for example
  "stripe-not-configured",
  ...
] as const;
```

`GlobalAlertKind` is derived from that array in the same file, so the type stays in sync automatically.

### 2. Add the redirect URL — `packages/design-system/kaizen/business/src/components/financial-services/global-alert/constants.ts`

Add an entry to `redirectUrls` for every kind (it must be `Record<GlobalAlertKind, string>`, so all kinds need an entry):

- **internal**: use the app path directly (`"/billing/overdue"`)
- **external / custom**: use a fallback internal path (e.g. `/settings/billing`) — the real action is handled by the callback prop; this is just a type-safety fallback
- **intercom**: use a fallback internal path

### 3. Add translations — `packages/design-system/kaizen/business/src/i18n/source/financial-services.json`

Add a block under `globalAlertModal` using the kind slug as the key:

```json
"<kind-slug>": {
  "title": "<Title (EN)>",
  "description": "<Description (EN)>",
  "ctaLabel": "<CTA label (EN)>"
}
```

### 4. Wire the callback prop (only for `external` or `custom` CTA types)

If the CTA type is **external** or **custom**, add a new optional callback prop that propagates through the entire component tree. Each of the following files needs the prop added to its type and destructuring, and the `handleCta` guard updated:

**a. `packages/design-system/kaizen/business/src/components/financial-services/global-alert/global-alert.tsx`**

Add to `GlobalAlertProps` and the component destructuring:

```ts
/** Called when the user clicks the CTA for `"<kind-slug>"` alerts. */
openXxx?: () => void;
```

Pass it to all three sub-components (`BlockingModal`, `SingleAlertBanner`, `AggregatedAlertsDrawer`).

**b. `packages/design-system/kaizen/business/src/components/financial-services/global-alert/blocking-modal.tsx`**
**c. `packages/design-system/kaizen/business/src/components/financial-services/global-alert/single-alert-banner.tsx`**
**d. `packages/design-system/kaizen/business/src/components/financial-services/global-alert/aggregated-alerts-drawer.tsx`** (both the `AlertDrawerItemProps` inner type and `AggregatedAlertsDrawerProps`, and the render pass-through)

In each, add a guard in `handleCta` following the established pattern:

```ts
const handleCta =
  kind === "apple-developer-program-enrollment" && openIntercom
    ? openIntercom
    : kind === "apple-developer-pending-agreements" && openAppleAgreements
      ? openAppleAgreements
      : kind === "<kind-slug>" && openXxx // ← add here
        ? openXxx
        : () => onNavigate(redirectUrls[kind]);
```

For **intercom** CTA: no new prop needed — just use `openIntercom` in the guard.

### 5. Add backend logic — `packages/design-system/kaizen/business/src/components/financial-services/global-alert/hooks/use-fetch-global-alerts.ts`

Inside the `useMemo` that builds `result`, add the check using the backend trigger fields the engineer specified. Follow the existing blocks as a pattern:

```ts
if (someHookData) {
  const { relevant_field } = someHookData;
  if (relevant_field) {
    result["<kind-slug>"] = {
      severity: "warning",
      dueDate: due_date ?? undefined,
    };
  }
}
```

If the alert uses a new API hook not yet in this file:

- The hook must already exist in `packages/api/` following ADR-0001 conventions
- Import it with `useFetchXxx` from `./use-fetch-xxx`
- Create the hook file in the `hooks/` directory following the pattern of the other `use-fetch-*.ts` files
- Add it to the `isAnyLoading` and `isError` aggregations

If the new callback prop was added in step 4, also add it to `UseFetchGlobalAlertsParams` and the returned `globalAlertProps`.

### 6. Wire the callback in studio-manager — `apps/applications/studio-manager/navigation-sidebar/src/components/global-alert/global-alert.tsx`

Only needed if you added a new callback prop in step 4.

For **external** CTAs:

```ts
openXxx: () => {
  window.open("<external-url>", "_blank", "noopener");
},
```

For **custom** CTAs: implement the appropriate action (navigate to a specific page, open a modal, etc.).

### 7. Add a Storybook story — `packages/design-system/kaizen/business/src/components/financial-services/global-alert/global-alert.stories.tsx`

- Add the new kind to `sharedArgs` if it introduced a new callback prop
- Add a story for at least the `warning` severity (and `blocking` if applicable), following the existing story pattern
- Update the component `description` string in `meta.parameters.docs.description.component` to list the new kind

### 8. Rebuild the kaizen package

After all source changes are saved:

```sh
pnpm exec nx build @bsport/kaizen-business-components
```

This regenerates the `dist/` `.d.ts` files that studio-manager imports at type-check time. Verify the new type landed:

```sh
grep "openXxx\|<kind-slug>" packages/design-system/kaizen/business/dist/components/financial-services/global-alert/hooks/use-fetch-global-alerts.d.ts
grep "<kind-slug>" packages/design-system/kaizen/business/dist/components/financial-services/global-alert/types.d.ts
```

### 9. Type-check both packages

```sh
# kaizen
pnpm exec tsc --noEmit -p packages/design-system/kaizen/business/tsconfig.json

# studio-manager navigation-sidebar
pnpm exec tsc --noEmit -p apps/applications/studio-manager/navigation-sidebar/tsconfig.json
```

Both must return no errors before the work is done.

---

## Architecture notes

- **Display priority order is load-bearing.** The first blocking kind found in `globalAlertKinds` is the one shown as a full-screen modal; non-blocking alerts are displayed in order. Insert the new kind at the position that reflects its relative urgency.
- **`redirectUrls` must be complete.** It is typed as `Record<GlobalAlertKind, string>` — adding a kind without an entry here is a compile error.
- **The shared kind list lives in constants.** Keep `globalAlertKinds` and its derived `GlobalAlertKind` type in [packages/design-system/kaizen/business/src/components/financial-services/global-alert/constants.ts](packages/design-system/kaizen/business/src/components/financial-services/global-alert/constants.ts) rather than the old types module.
- **`use-fetch-global-alerts.ts` is the single integration point.** All backend data is fetched here and mapped to `GlobalAlertKind`. Do not add alert logic to individual components.
- **New API hooks belong in `packages/api/`.** If the alert requires a new backend endpoint, create the query options and fetch function there first, following ADR-0001 (vanilla builders, canonical query keys, no React hooks inside the package).
- **The dist rebuild is mandatory.** Studio-manager resolves kaizen types from `dist/`, not `src/`. Skipping the rebuild causes type errors in studio-manager even if the source is correct.
- **Intercom is already wired.** For alerts whose CTA should open Intercom, reuse the existing `openIntercom` prop — do not add a new prop.
