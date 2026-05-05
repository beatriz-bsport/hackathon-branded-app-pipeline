import type { ItemsSearchFilterOption } from "./types";

/**
 * Converts text to a normalized value for case-insensitive comparisons.
 */
export const normalizeText = (value: string): string =>
  value.trim().toLowerCase();

/**
 * Filters options by matching query against option name only.
 */
export const filterOptionsByName = (
  options: ItemsSearchFilterOption[],
  query: string,
): ItemsSearchFilterOption[] => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return options;
  }

  return options.filter((option) =>
    normalizeText(option.name).includes(normalizedQuery),
  );
};

/**
 * Removes stale selected ids that are no longer present in options.
 */
export const sanitizeSelectedIds = (
  selectedIds: number[],
  validIds: Set<number>,
): number[] => selectedIds.filter((selectedId) => validIds.has(selectedId));

/**
 * Keeps current selected ids ordered by initial selection chronology.
 */
export const updateSelectionOrder = (
  previousOrder: number[],
  selectedIds: number[],
): number[] => {
  const selectedSet = new Set(selectedIds);
  const nextOrder = previousOrder.filter((selectedId) =>
    selectedSet.has(selectedId),
  );

  for (const selectedId of selectedIds) {
    if (!nextOrder.includes(selectedId)) {
      nextOrder.push(selectedId);
    }
  }

  return nextOrder;
};
