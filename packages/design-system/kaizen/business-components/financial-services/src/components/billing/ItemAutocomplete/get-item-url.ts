import type { ItemAutocompleteItemKind } from "./ItemAutocomplete";
import { ITEM_AUTOCOMPLETE_ITEM_KINDS } from "./ItemAutocomplete";

/**
 * Get the URL for opening an item in a new tab based on its itemType and ID.
 *
 * @param itemType - The type of the item (pass, appointment_pass, product, pack, giftcard)
 * @param itemId - The ID of the item
 * @returns The URL to open the item in a new tab
 */
export const getItemUrl = (
  itemType: ItemAutocompleteItemKind,
  itemId: string,
): string => {
  const baseUrl = window.location.origin;
  switch (itemType) {
    case ITEM_AUTOCOMPLETE_ITEM_KINDS.pass:
      return `${baseUrl}/payment-pack/${itemId}/`;
    case ITEM_AUTOCOMPLETE_ITEM_KINDS.appointment_pass:
      return `${baseUrl}/private-service/pass/${itemId}/`;
    case ITEM_AUTOCOMPLETE_ITEM_KINDS.product:
      return `${baseUrl}/webshop/products/${itemId}/`;
    case ITEM_AUTOCOMPLETE_ITEM_KINDS.pack:
      return `${baseUrl}/combo/${itemId}/`;
    case ITEM_AUTOCOMPLETE_ITEM_KINDS.giftcard:
      return `${baseUrl}/giftcard/${itemId}/`;
    default:
      return "#";
  }
};
