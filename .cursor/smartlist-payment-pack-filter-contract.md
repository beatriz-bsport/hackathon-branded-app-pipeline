# Smartlist Pass Filter Contract (Payment Pack)

Backend and frontend contract for Smartlist filter identifier `19` (`payment_pack`), including lifecycle, payloads, enums, frontend validation, and TypeScript + zod guidance.

## TL;DR for agents

- Implement only filter identifier `19` (`payment_pack`).
- Hydrate only from `GET /api/v1/smartlist/group/{smartlistId}/get_filters/`.
- Parse payment pack filters from key `"19"` (it can be missing).
- Support multiple payment pack filters per smartlist.
- Block save when `select_all_payment_packs = false` and `payment_packs` is empty.
- Use `PATCH` with dirty fields only for updates.
- Support all date filter enum values (`0,1,2,3,4,5,6,7,9`).
- Delete via hard delete (`DELETE /payment_pack/{filterId}/`).
- Use TypeScript + zod + React Hook Form.
- After each mutation, re-fetch `get_filters` and rehydrate.

## Non-negotiable rules

- Frontend MUST use `get_filters` as single source of truth for hydration.
- Frontend MUST support multiple payment pack filters in one smartlist.
- Frontend MUST block submission when:
  - `select_all_payment_packs = false`
  - and `payment_packs.length = 0`
- Frontend MUST send only dirty fields on `PATCH`.
- Frontend MUST support all date filter type values in create/edit flows.
- Frontend MUST perform hard delete for removal.
- Frontend MUST rehydrate from `get_filters` after create/update/delete.
- Frontend MUST NOT invent extra backend fields or endpoints.

## Scope

This document covers one Smartlist filter type:

- Filter identifier: `19`
- Route slug: `payment_pack`
- Backend model: `PaymentPackFilter`
- Smartlists can contain multiple payment pack filters

## API Routes

Base:

- `/api/v1/smartlist/`

Pass filter CRUD:

- `GET /api/v1/smartlist/payment_pack/`
- `POST /api/v1/smartlist/payment_pack/`
- `GET /api/v1/smartlist/payment_pack/{filterId}/`
- `PATCH /api/v1/smartlist/payment_pack/{filterId}/`
- `DELETE /api/v1/smartlist/payment_pack/{filterId}/`

Hydration source of truth:

- `GET /api/v1/smartlist/group/{smartlistId}/get_filters/`

Auth and scope:

- Authenticated manager user required
- Querysets are company-scoped on backend
- Out-of-scope detail access returns `404`

## Source of truth and hydration strategy

Use a single source of truth for hydration:

- Always hydrate from `GET /group/{smartlistId}/get_filters/`
- Read payment pack filters under key `"19"`

Shape example:

```json
{
  "19": {
    "456": {
      "id": 456,
      "smartlist": 123,
      "filter_identifier": 19
    },
    "457": {
      "id": 457,
      "smartlist": 123,
      "filter_identifier": 19
    }
  }
}
```

Notes:

- Key `"19"` can be absent if no pass filter exists.
- Since multiple filters are allowed, value under `"19"` is an object keyed by filter id.

## Implementation algorithm (agent execution plan)

1. Fetch `GET /api/v1/smartlist/group/{smartlistId}/get_filters/`.
2. Read key `"19"`:
   - If missing: render empty state.
   - If present: map each object value to one form instance.
3. Build form with TypeScript DTO and zod validation.
4. On create:
   - validate guardrails
   - `POST /api/v1/smartlist/payment_pack/`
5. On update:
   - compute dirty payload from RHF `dirtyFields`
   - `PATCH /api/v1/smartlist/payment_pack/{filterId}/`
6. On delete:
   - `DELETE /api/v1/smartlist/payment_pack/{filterId}/`
7. After each mutation:
   - refetch `get_filters`
   - remap key `"19"` to UI state

## Backend fields (serializer contract)

`PaymentPackFilterSerializer` fields:

- `id: number`
- `company_id: number`
- `smartlist: number`
- `payment_packs: number[]`
- `select_all_payment_packs: boolean`
- `has_pack: boolean`
- `date_filter_active: boolean`
- `date_filter_type: number`
- `date_bought: YYYY-MM-DD`
- `date_bought_second: YYYY-MM-DD`
- `duration_bought: number`
- `duration_bought_second: number`
- `credit_filter_active: boolean`
- `credit_comparator: number`
- `credit_value: string | number`
- `credit_value_second: string | number`
- `expiration_date_filter_active: boolean`
- `expiration_date_filter_type: number`
- `expiration_date: YYYY-MM-DD`
- `expiration_date_second: YYYY-MM-DD`
- `expiration_duration: number`
- `expiration_duration_second: number`

When retrieved through `get_filters`, each item also includes:

- `filter_identifier: 19`

## Business decisions and behavior

1. Multiple payment pack filters are allowed for the same smartlist.
2. Save must be blocked when:
   - `select_all_payment_packs = false`
   - and `payment_packs` is empty
3. `PATCH` requests must send only dirty fields.
4. `credit_value` and `credit_value_second` accept numeric strings with or without decimals.
5. Frontend must support all date filter enum values.
6. Deleting a payment pack filter is hard delete (`DELETE`).
7. Frontend form stack: TypeScript + zod + React Hook Form.

## Filter semantics

### Base pass selection

- If `select_all_payment_packs = true`, backend uses all company passes.
- Else, backend uses `payment_packs` selection.
- If selection is empty while `select_all_payment_packs = false`, result is effectively empty.

### Include / exclude

- `has_pack = true`: keep matching members
- `has_pack = false`: invert match (members not matching)

### Active sub-filters

Sub-filters are applied when active and combined with AND logic:

- Purchase date:
  - `date_filter_active`
  - `date_filter_type`
  - `date_bought`, `date_bought_second`
  - `duration_bought`, `duration_bought_second`
- Credits:
  - `credit_filter_active`
  - `credit_comparator`
  - `credit_value`, `credit_value_second`
- Expiration:
  - `expiration_date_filter_active`
  - `expiration_date_filter_type`
  - `expiration_date`, `expiration_date_second`
  - `expiration_duration`, `expiration_duration_second`

Credit details:

- Comparator is applied on remaining credits (`payment_pack.credits - used_credits`)
- For unlimited passes (`credits IS NULL`), credit condition path is treated separately and can still match

## Enums

### Date filter type

Used by:

- `date_filter_type`
- `expiration_date_filter_type`

Values:

- `0`: `DATE_AFTER`
- `1`: `DATE_BEFORE`
- `2`: `DATE_BETWEEN`
- `3`: `DATE_EXACT`
- `4`: `DURATION_AFTER`
- `5`: `DURATION_BEFORE`
- `6`: `DURATION_EXACT`
- `7`: `DURATION_BETWEEN`
- `9`: `DURATION_BEFORE_PAST`

### Credit comparator

- `1`: `LTE` (`<=`)
- `2`: `GTE` (`>=`)
- `5`: `EQUAL` (`==`)
- `6`: `BETWEEN`

## Lifecycle contract

### Create

`POST /api/v1/smartlist/payment_pack/`

Minimum practical payload:

```json
{
  "smartlist": 123,
  "select_all_payment_packs": true
}
```

If `select_all_payment_packs = false`, frontend must send non-empty `payment_packs`.

### Read

- Single source for UI hydration: `GET /group/{smartlistId}/get_filters/`
- Optional direct CRUD list/detail endpoints exist for operations and debugging.

### Update

`PATCH /api/v1/smartlist/payment_pack/{filterId}/`

- Send only dirty fields
- Keep frontend validation consistent with toggled sections

Example:

```json
{
  "credit_filter_active": true,
  "credit_comparator": 6,
  "credit_value": "5",
  "credit_value_second": "10"
}
```

### Delete

`DELETE /api/v1/smartlist/payment_pack/{filterId}/`

- Hard delete
- Expected success status: `204 No Content`

### Post-mutation sync

After create/update/delete:

1. Re-fetch `GET /group/{smartlistId}/get_filters/`
2. Rebuild local payment pack filter list from key `"19"`

## Frontend validation rules

- Require `smartlist` on create.
- Reject save if `select_all_payment_packs = false` and `payment_packs.length === 0`.
- If `credit_filter_active = true` and comparator is `BETWEEN (6)`, require both credit values.
- For date-based types (`0/1/2/3`), validate date fields.
- For duration-based types (`4/5/6/7/9`), validate duration fields.
- Accept numeric strings for credit values with or without decimal part.

## Conditional validation matrix

| Condition                                                                             | Required fields                                     | Notes                           |
| ------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------- |
| `select_all_payment_packs = false`                                                    | `payment_packs.length > 0`                          | Save must be blocked otherwise  |
| `date_filter_active = true` and `date_filter_type` in `0,1,3`                         | `date_bought`                                       | `date_bought_second` unused     |
| `date_filter_active = true` and `date_filter_type = 2`                                | `date_bought`, `date_bought_second`                 | Between dates                   |
| `date_filter_active = true` and `date_filter_type` in `4,5,6,9`                       | `duration_bought`                                   | Single duration                 |
| `date_filter_active = true` and `date_filter_type = 7`                                | `duration_bought`, `duration_bought_second`         | Between durations               |
| `expiration_date_filter_active = true` and `expiration_date_filter_type` in `0,1,3`   | `expiration_date`                                   | `expiration_date_second` unused |
| `expiration_date_filter_active = true` and `expiration_date_filter_type = 2`          | `expiration_date`, `expiration_date_second`         | Between dates                   |
| `expiration_date_filter_active = true` and `expiration_date_filter_type` in `4,5,6,9` | `expiration_duration`                               | Single duration                 |
| `expiration_date_filter_active = true` and `expiration_date_filter_type = 7`          | `expiration_duration`, `expiration_duration_second` | Between durations               |
| `credit_filter_active = true` and `credit_comparator` in `1,2,5`                      | `credit_value`                                      | Single value                    |
| `credit_filter_active = true` and `credit_comparator = 6`                             | `credit_value`, `credit_value_second`               | Between comparator              |

## TypeScript contract

```ts
export enum SmartlistDateFilterType {
  DATE_AFTER = 0,
  DATE_BEFORE = 1,
  DATE_BETWEEN = 2,
  DATE_EXACT = 3,
  DURATION_AFTER = 4,
  DURATION_BEFORE = 5,
  DURATION_EXACT = 6,
  DURATION_BETWEEN = 7,
  DURATION_BEFORE_PAST = 9,
}

export enum CreditComparator {
  LTE = 1,
  GTE = 2,
  EQUAL = 5,
  BETWEEN = 6,
}

export interface PaymentPackFilterDto {
  id: number;
  company_id: number;
  smartlist: number;
  payment_packs: number[];
  select_all_payment_packs: boolean;
  has_pack: boolean;

  date_filter_active: boolean;
  date_filter_type: SmartlistDateFilterType;
  date_bought: string;
  date_bought_second: string;
  duration_bought: number;
  duration_bought_second: number;

  credit_filter_active: boolean;
  credit_comparator: CreditComparator;
  credit_value: string | number;
  credit_value_second: string | number;

  expiration_date_filter_active: boolean;
  expiration_date_filter_type: SmartlistDateFilterType;
  expiration_date: string;
  expiration_date_second: string;
  expiration_duration: number;
  expiration_duration_second: number;
}

export type CreatePaymentPackFilterPayload = Omit<
  PaymentPackFilterDto,
  "id" | "company_id"
>;

export type UpdatePaymentPackFilterPayload = Partial<
  Omit<PaymentPackFilterDto, "id" | "company_id" | "smartlist">
>;
```

## zod schema baseline for React Hook Form

```ts
import { z } from "zod";

const numericString = z
  .string()
  .trim()
  .regex(/^\d+(\.\d+)?$/, "Must be a positive number");

export const paymentPackFilterFormSchema = z
  .object({
    smartlist: z.number().int().positive(),
    payment_packs: z.array(z.number().int().positive()).default([]),
    select_all_payment_packs: z.boolean(),
    has_pack: z.boolean(),

    date_filter_active: z.boolean(),
    date_filter_type: z.nativeEnum(SmartlistDateFilterType),
    date_bought: z.string(),
    date_bought_second: z.string(),
    duration_bought: z.number().int(),
    duration_bought_second: z.number().int(),

    credit_filter_active: z.boolean(),
    credit_comparator: z.nativeEnum(CreditComparator),
    credit_value: z.union([numericString, z.number()]),
    credit_value_second: z.union([numericString, z.number()]),

    expiration_date_filter_active: z.boolean(),
    expiration_date_filter_type: z.nativeEnum(SmartlistDateFilterType),
    expiration_date: z.string(),
    expiration_date_second: z.string(),
    expiration_duration: z.number().int(),
    expiration_duration_second: z.number().int(),
  })
  .superRefine((value, context) => {
    if (!value.select_all_payment_packs && value.payment_packs.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["payment_packs"],
        message: "Select at least one pass or enable select all.",
      });
    }

    if (
      value.credit_filter_active &&
      value.credit_comparator === CreditComparator.BETWEEN
    ) {
      const secondValueEmpty =
        value.credit_value_second === "" || value.credit_value_second === null;
      if (secondValueEmpty) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["credit_value_second"],
          message: "Second credit value is required for BETWEEN comparator.",
        });
      }
    }
  });

export type PaymentPackFilterFormValues = z.infer<
  typeof paymentPackFilterFormSchema
>;
```

## Dirty patching contract

When updating an existing filter:

1. Build payload from React Hook Form `dirtyFields`
2. Include only dirty leaf fields
3. Send `PATCH /payment_pack/{id}` with that payload
4. Re-fetch `get_filters` and rehydrate

## API examples for AI execution

Create:

```json
{
  "smartlist": 123,
  "select_all_payment_packs": false,
  "payment_packs": [10, 11],
  "has_pack": true
}
```

Patch (dirty only):

```json
{
  "expiration_date_filter_active": true,
  "expiration_date_filter_type": 2,
  "expiration_date": "2026-05-01",
  "expiration_date_second": "2026-05-31"
}
```

Hydration response (`get_filters`):

```json
{
  "19": {
    "456": {
      "id": 456,
      "smartlist": 123,
      "payment_packs": [10],
      "select_all_payment_packs": false,
      "has_pack": true,
      "filter_identifier": 19
    },
    "457": {
      "id": 457,
      "smartlist": 123,
      "payment_packs": [11, 12],
      "select_all_payment_packs": false,
      "has_pack": false,
      "filter_identifier": 19
    }
  }
}
```

## Edge cases

- Key `"19"` missing in hydration payload: treat as empty filter list.
- `PATCH` with empty body: avoid sending; no-op on frontend.
- Deleting stale filter id: handle `404` by refetching and reconciling UI.
- `credit_value` formats accepted: `"10"`, `"10.5"`, `"10.50"`, `10`, `10.5`.
- Filter order in `"19"` map is not guaranteed; sort client-side if needed.

## Machine-readable contract

```json
{
  "filterIdentifier": 19,
  "routeSlug": "payment_pack",
  "hydrateEndpoint": "/api/v1/smartlist/group/{smartlistId}/get_filters/",
  "crud": {
    "list": "/api/v1/smartlist/payment_pack/",
    "create": "/api/v1/smartlist/payment_pack/",
    "detail": "/api/v1/smartlist/payment_pack/{filterId}/",
    "patch": "/api/v1/smartlist/payment_pack/{filterId}/",
    "delete": "/api/v1/smartlist/payment_pack/{filterId}/"
  },
  "rules": {
    "allowMultiplePerSmartlist": true,
    "hydrateFromGetFiltersOnly": true,
    "requireSelectedPacksWhenSelectAllFalse": true,
    "patchDirtyOnly": true,
    "deleteMode": "hard",
    "supportAllDateFilterTypes": [0, 1, 2, 3, 4, 5, 6, 7, 9]
  }
}
```

## Error handling expectations

- `400`: validation error
- `403`: not authenticated / not manager
- `404`: not found or out of company scope
- `204`: successful hard delete

Frontend should keep form state and display API error details on failure.

## Prompt template for Cursor agent

```md
Implement Payment Pack Smartlist filter UI using `docs/smartlist-payment-pack-filter-contract.md`.

Constraints:

- Use `GET /api/v1/smartlist/group/{smartlistId}/get_filters/` as single hydration source.
- Read only filter key `"19"` for payment pack.
- Support multiple payment pack filters per smartlist.
- Block save if `select_all_payment_packs=false` and `payment_packs` is empty.
- Send dirty fields only for PATCH updates.
- Support all date filter enum values.
- Use hard delete endpoint for removal.
- Use TypeScript + zod + React Hook Form.
- Do not invent backend fields or routes.

Deliverables:

1. DTO/types
2. zod schema and conditional validation
3. React Query hooks
4. API client methods
5. Form UI wiring for create/edit/delete
6. Tests for validation and dirty patch payload builder
```

## Agent acceptance checklist

- [ ] Hydration uses only `get_filters`.
- [ ] Payment pack filters are parsed from key `"19"`.
- [ ] Multiple filters can be created and displayed.
- [ ] Empty pack selection is blocked when `select_all_payment_packs=false`.
- [ ] Update sends dirty fields only.
- [ ] All date filter types are represented in UI and validation.
- [ ] Delete performs hard delete and UI resync.
- [ ] UI refetches and rehydrates after every mutation.

---

## Session Retrospective Addendum

This section captures the implementation refinements requested during the session after the initial contract draft.

### General guidelines / code requirements

- Use `@bsport/form` (`useFormController`) as the form lifecycle layer for pass filter cards (zod-driven validation, draft management, submit handling), instead of manual local state-only form orchestration.
- Keep TypeScript-first contracts and preserve compatibility with existing React Query and API mapper architecture.
- Always write translations into i18n namespaces and never use hardcoded strings
- When dealing with types, always use constants for primitive type and build the type on top of it
- Prefer Kaizen-native error UX:
  - Field components must use `status` + `statusText` / `errorText` according to each component API.
  - Form and mutation errors should be surfaced with Kaizen `toast` instead of storing local card-level error state for display.
- i18n must be structured by filter identifier:
  - For Payment Pack filter, keys are grouped under `campaign-filters` namespace path `filters.19.*`.
  - This structure is the template for future filters (`filters.<identifier>.*`).
- Preserve one-component responsibilities:
  - Primitive filters own input rendering and local interaction.
  - Smartlist pass filter card owns orchestration, form state bindings, and API trigger points.

### Smartlist filters informations

- Smartlist overview/parameter flow now acts as the first real filter lifecycle surface:
  - Hydrate existing filters from `get_filters`.
  - Render preloaded data in cards.
  - Support create, update (dirty PATCH), delete (hard delete), and refetch/rehydrate.
- Error and validation display behavior has been refined:
  - Primitive filter cards (`items-search`, `date`, `numeric`) must display visual error state at card level.
  - Error card border uses Kaizen critical token style (`shadow-border-thin-critical`).
- Primitive filter UI rules introduced:
  - `date-filter` and `numeric-comparator-filter` are always wrapped in Kaizen `Card`.
  - `items-search-filter` supports an explicit `errorText` prop and reflects both field and card error states.
- Sub-filter add UX changed:
  - Replace multiple “Add X” buttons with a single `Add sub-filter` button (icon `plus` left).
  - Clicking opens a Kaizen `Popover` + `Menu` listing currently available sub-filters only.

### Passes filters

- Identifier and scope:
  - Payment Pack / Pass filter remains identifier `19` and supports multiple instances in one smartlist.
- Selection rules:
  - If `select_all_payment_packs=false`, at least one pass must be selected.
  - Validation is enforced by schema and displayed in UI (field/card error states).
- Sub-filter constraints:
  - Supported sub-filters: purchase date, expiration date, credits left.
  - Only one of each sub-filter type can exist per pass filter card.
- Date operator mapping and serialization rules refined:
  - API enum date filter type must map to correct primitive operators on hydration (absolute and relative modes).
  - UI relative durations always display absolute/positive numbers.
  - On payload serialization:
    - Past relative operators send negative duration values.
    - Future relative operators send positive duration values.
- Absolute date payload constraints:
  - API does not accept empty second absolute date.
  - `date_bought_second` / `expiration_date_second` must always be populated (fallback to first date if second date missing).
- Credits filter validation:
  - `creditLeft.firstValue` required when credits sub-filter is active.
  - `creditLeft.secondValue` required when comparator is `between`.
- Error handling refinement:
  - Validation/mutation failures now use toast messaging.
  - Avoid local persistent error-state blocks when toast is sufficient.
