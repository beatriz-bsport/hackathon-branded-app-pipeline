import {
  ALL_EXPENSES_COMPLETE_BUYABLE_IDS,
  EXPENSES_COMPLETE_BUYABLE_DISPLAY_ORDER,
  type ExpensesCompleteBuyableId,
} from "./constants";

const ALL_EXPENSES_COMPLETE_BUYABLE_ID_SET = new Set<number>(
  ALL_EXPENSES_COMPLETE_BUYABLE_IDS,
);

const toValidatedBuyableIds = (
  buyableIds: number[],
): ExpensesCompleteBuyableId[] =>
  buyableIds.filter((buyableId): buyableId is ExpensesCompleteBuyableId =>
    ALL_EXPENSES_COMPLETE_BUYABLE_ID_SET.has(buyableId),
  );

/**
 * Maps API `buyable_identifiers` to UI selection (`[]` means all types selected).
 * Preserves {@link EXPENSES_COMPLETE_BUYABLE_DISPLAY_ORDER} for stable picker ordering.
 */
export const buyableIdsFromFetch = (
  apiBuyableIdentifiers: number[],
): ExpensesCompleteBuyableId[] => {
  if (!apiBuyableIdentifiers.length) {
    return [...EXPENSES_COMPLETE_BUYABLE_DISPLAY_ORDER];
  }

  const selectedIds = new Set(apiBuyableIdentifiers);

  return EXPENSES_COMPLETE_BUYABLE_DISPLAY_ORDER.filter((buyableId) =>
    selectedIds.has(buyableId),
  );
};

/**
 * Maps UI selection to API `buyable_identifiers`.
 * When every product type is selected, returns the full identifier set.
 */
export const buyableIdsToApi = (
  uiSelectedBuyableIds: number[],
): ExpensesCompleteBuyableId[] => {
  const sortedSelection = toValidatedBuyableIds(uiSelectedBuyableIds).sort(
    (leftId, rightId) => leftId - rightId,
  );
  const sortedAll = [...ALL_EXPENSES_COMPLETE_BUYABLE_IDS].sort(
    (leftId, rightId) => leftId - rightId,
  );

  if (
    sortedSelection.length === sortedAll.length &&
    sortedSelection.every((id, index) => id === sortedAll[index])
  ) {
    return [...sortedAll];
  }

  return sortedSelection;
};
