# DatePicker shortcuts

How shortcuts work and how to add a new one.

## Overview

- **Shortcuts** are preset options (e.g. "Today", "Last 7 days") that set the picker’s value when the user selects one.
- Each shortcut is a **`ShortcutItem`**: `{ id: string; label: string; getDate: () => SelectedDate }`. The `label` is the text shown in the UI (translated when using the hook).
- The **`useDatePickerShortcuts`** hook returns all built-in shortcuts with translated labels. You then pass an array of the ones you want to the DatePicker `shortcuts` prop.

## Using the hook

`useDatePickerShortcuts()` uses the Kaizen i18n context (`useTranslation` + `useKaizenI18nInstance`) and returns a **record** of shortcuts keyed by `ShortcutKey`, each with a translated `label`.

Your app must be wrapped in the Kaizen i18n provider. DatePicker expects `shortcuts` to be an **array**, so build an array from the keys you need:

**Single-date picker** (e.g. Today, Next week, Next month, Next quarter, Next year):

```tsx
import { DatePicker, useDatePickerShortcuts } from "@your-package/DatePicker";

function MyForm() {
  const shortcuts = useDatePickerShortcuts();

  const singleDateShortcuts = [
    shortcuts.today,
    shortcuts.nextWeek,
    shortcuts.nextMonth,
    shortcuts.nextQuarter,
    shortcuts.nextYear,
  ];

  return (
    <DatePicker
      id="single"
      mode="single"
      shortcuts={singleDateShortcuts}
      {...otherProps}
    />
  );
}
```

**Range picker** (e.g. Last 4 weeks, Last week, Last quarter, Month to date, Year to date):

```tsx
function RangeExample() {
  const shortcuts = useDatePickerShortcuts();

  const rangeShortcuts = [
    shortcuts.last4weeks,
    shortcuts.lastWeek,
    shortcuts.lastQuarter,
    shortcuts.monthToDate,
    shortcuts.yearToDate,
  ];

  return (
    <DatePicker
      id="range"
      mode="range"
      shortcuts={rangeShortcuts}
      {...otherProps}
    />
  );
}
```

**Returned keys:** `today`, `nextWeek`, `nextMonth`, `nextQuarter`, `nextYear`, `last4weeks`, `lastWeek`, `lastQuarter`, `monthToDate`, `yearToDate` (see `ShortcutKey` type).

---

## Adding a new shortcut

### 1. Add the translation key

Add a new key under `datePicker.shortcuts` in the design system’s default translations:

**File:** `src/i18n/source/default.json`

```json
"datePicker": {
  "shortcuts": {
    "today": "Today",
    "last4weeks": "Last 4 weeks",
    "lastWeek": "Last 7 days",
    "lastQuarter": "Last 3 months",
    "monthToDate": "Month to date",
    "yearToDate": "Year to date",
    "nextWeek": "Next 7 days",
    "nextMonth": "Next month",
    "nextQuarter": "Next 3 months",
    "nextYear": "Next year",
    "next6Months": "Next 6 months"
  }
}
```

Use a stable, camelCase key (e.g. `next6Months`). Add the same key in other locale files if you have them.

### 2. Implement the date logic in `shortcutUtils.ts`

Add a function that returns the correct value:

- **Single-date:** return a single `DateTime`.
- **Range:** return a tuple `[DateTime, DateTime]` (start, end).

Use `getLocalNow({}).startOf("day")` (or equivalent) for calendar-day boundaries.

**Example – range "Next 6 months":**

```ts
/** Range: today → today + 6 months */
export function getNext6MonthsRange(): [DateTime, DateTime] {
  const today = getLocalNow({}).startOf("day");
  return [today, today.plus({ months: 6 })];
}
```

**Example – single date "Tomorrow":**

```ts
export function getTomorrow(): DateTime {
  return getLocalNow({}).startOf("day").plus({ days: 1 });
}
```

### 3. Add the key to `SHORTCUT_KEYS`

In `shortcutUtils.ts`:

```ts
export const SHORTCUT_KEYS = {
  // ...existing keys...
  NEXT_6_MONTHS: "next6Months",
} as const;
```

### 4. Create a shortcut constant in `shortcutUtils.ts`

Define a constant with `id`, `label` (full i18n key via `fullKey(SHORTCUT_KEYS.…)`), and `getDate`:

```ts
export const NEXT_6_MONTHS_RANGE_SHORTCUT: ShortcutItem = {
  id: SHORTCUT_KEYS.NEXT_6_MONTHS,
  label: fullKey(SHORTCUT_KEYS.NEXT_6_MONTHS),
  getDate: () => getNext6MonthsRange(),
};
```

Place it with the other shortcut constants (single-date or range section).

### 5. Include it in the hook’s return value

In `useDatePickerShortcuts()`, add the new shortcut to the returned record using the same pattern as existing entries:

```ts
return {
  // ...existing entries...
  [SHORTCUT_KEYS.NEXT_6_MONTHS]: createShortcutItem(NEXT_6_MONTHS_RANGE_SHORTCUT),
};
```

Consumers can then use `shortcuts.next6Months` (or the key you chose) when building their `shortcuts` array.

## Checklist

| Step | Action                                                                                           |
| ---- | ------------------------------------------------------------------------------------------------ |
| 1    | Add key under `datePicker.shortcuts` in `default.json` (and other locales)                       |
| 2    | Implement `getDate` in `shortcutUtils.ts`: `DateTime` (single) or `[DateTime, DateTime]` (range) |
| 3    | Add key to `SHORTCUT_KEYS` in `shortcutUtils.ts`                                                 |
| 4    | Create shortcut constant with `id`, `label: fullKey(...)`, `getDate` in `shortcutUtils.ts`       |
| 5    | Add the new shortcut to the object returned by `useDatePickerShortcuts()` in `shortcutUtils.ts`  |

## Single vs range

- **Single-date mode:** `getDate()` must return a single `DateTime`. Use shortcuts whose `getDate` returns one date (e.g. today, next week, next month).
- **Range mode:** `getDate()` must return `[DateTime, DateTime]`. Use shortcuts whose `getDate` returns a range (e.g. last 4 weeks, last week, month to date).

The hook returns a single record; you choose which entries to pass as an array to `DatePicker` depending on `mode`.
