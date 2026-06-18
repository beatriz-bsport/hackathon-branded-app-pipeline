import { Toggle } from "@bsport/kaizen-primitive-core";

import { ItemsSearchFilter } from "#src/components/primitive-filters/items-search-filter";

import type { PassSelectorWithToggleProps } from "./types";

/**
 * A controlled generic component that pairs a Toggle with an `ItemsSearchFilter` picker.
 *
 * - When the toggle is **disabled**, the selection and `selectAll` are cleared.
 * - When `selectAll` is `true` (set via the picker's "Select all" option), the
 *   picker reflects a full selection and clearing it reverts to an empty state.
 * - An empty `selectedIds` with `selectAll = false` while `enabled = true` is
 *   considered invalid — the parent schema should surface this as an error.
 */
export const PassSelectorWithToggle = ({
  id,
  label,
  helperText,
  options,
  value,
  onChange,
  disabled = false,
  errorText,
  searchPlaceholder,
  emptySelectionLabel,
}: PassSelectorWithToggleProps) => {
  const handleToggleChange = (nextEnabled: boolean) => {
    onChange({
      enabled: nextEnabled,
      selectAll: false,
      selectedIds: [],
    });
  };

  const handleSelectionChange = (nextSelectedIds: number[]) => {
    const areAllOptionsSelected =
      options.length > 0 && nextSelectedIds.length === options.length;

    onChange({
      ...value,
      selectAll: areAllOptionsSelected,
      selectedIds: nextSelectedIds,
    });
  };

  /**
   * When `selectAll` is true, pass all option ids to the picker so every
   * item appears selected. This mirrors how `select_all_* = true` from the
   * API (or explicit "Select all" clicks) is displayed without having to
   * store every id in the form state.
   */
  const pickerSelectedIds = value.selectAll
    ? options.map((option) => option.id)
    : value.selectedIds;

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-start justify-between gap-sm">
        <Toggle
          fullWidth
          id={`${id}-toggle`}
          direction="end"
          label={label}
          helperText={helperText}
          checked={value.enabled}
          disabled={disabled}
          onToggleChange={handleToggleChange}
        />
      </div>

      {value.enabled ? (
        <ItemsSearchFilter
          id={`${id}-search`}
          options={options}
          value={pickerSelectedIds}
          onChange={handleSelectionChange}
          disabled={disabled}
          searchPlaceholder={searchPlaceholder}
          emptySelectionLabel={emptySelectionLabel}
          errorText={errorText}
        />
      ) : null}
    </div>
  );
};
