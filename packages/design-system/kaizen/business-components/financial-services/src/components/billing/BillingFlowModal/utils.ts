import type { ItemAutocompleteItemKind } from "#src/components/billing/ItemAutocomplete";

import type { ItemType } from "./types";

/**
 * Some item types can't be handled by the add-item form.
 * - null: nothing selected yet
 * - subscription: handled via redirect to legacy backoffice
 */
export const isAddItemFormAllowedType = (
  itemType: ItemType | null,
): itemType is Exclude<ItemType, "subscription"> =>
  itemType !== null && itemType !== "subscription";

/**
 * `useSearchItems` requires a searchable item kind.
 * When the selected type isn't searchable (null/subscription), we fall back to "pass".
 */
export const getSearchItemType = (
  itemType: ItemType | null,
): ItemAutocompleteItemKind =>
  itemType === null || itemType === "subscription" ? "pass" : itemType;
