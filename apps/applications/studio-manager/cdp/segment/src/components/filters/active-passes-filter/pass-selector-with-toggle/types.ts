import type { ItemsSearchFilterOption } from "#src/components/primitive-filters/items-search-filter";

/**
 * The current state of the pass selector with toggle.
 *
 * - `enabled` — whether this pass type is included in the filter at all.
 * - `selectAll` — when `true`, all company passes of this type are in scope
 *   (`select_all_* = true` on the API). This must be set explicitly by the
 *   user; an empty `selectedIds` without `selectAll` is a validation error.
 * - `selectedIds` — specific pass ids, used when `selectAll = false`.
 */
export type PassSelectorWithToggleValue = {
  enabled: boolean;
  selectAll: boolean;
  selectedIds: number[];
};

/**
 * Props for the controlled `PassSelectorWithToggle` component.
 */
export type PassSelectorWithToggleProps = {
  /** Unique HTML id prefix for field accessibility. */
  id: string;
  /** Toggle label (e.g. "Specify Passes"). */
  label: string;
  /** Toggle helper text (e.g. "Members with any of these Passes"). */
  helperText?: string;
  /** Searchable options rendered in the picker. */
  options: ItemsSearchFilterOption[];
  /** Current controlled value. */
  value: PassSelectorWithToggleValue;
  /** Called whenever toggle or selection changes. */
  onChange: (nextValue: PassSelectorWithToggleValue) => void;
  /** Whether the entire field is disabled. */
  disabled?: boolean;
  /** Error text shown below the picker when the selection is invalid. */
  errorText?: string;
  /** Placeholder shown inside the search input. */
  searchPlaceholder?: string;
  /** Label shown when no items have been selected yet. */
  emptySelectionLabel?: string;
};
