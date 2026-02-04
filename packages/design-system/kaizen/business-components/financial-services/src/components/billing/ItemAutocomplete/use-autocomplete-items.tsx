import { useMemo } from "react";

import {
  type AutocompleteItems,
  Body,
  Button,
  Media,
} from "@bsport/kaizen-primitive-core";

import { INVOICE_ITEMS_KINDS } from "#src/components/billing/ItemTypeSelector";

import type { ItemAutocompleteItemKind } from "./ItemAutocomplete";
import { useSearchItems } from "./use-search-items";

// Exclude subscription type from ItemAutocomplete - TODO in a next iteration
const { subscription: _, ...ITEM_AUTOCOMPLETE_ITEM_KINDS } =
  INVOICE_ITEMS_KINDS;

const typesWithImages: ItemAutocompleteItemKind[] = [
  ITEM_AUTOCOMPLETE_ITEM_KINDS.giftcard,
  ITEM_AUTOCOMPLETE_ITEM_KINDS.product,
];

export const useAutocompleteItems = ({
  itemType,
  searchInput,
}: {
  itemType: ItemAutocompleteItemKind;
  searchInput: string;
}) => {
  const query = useSearchItems({
    itemType,
    searchInput,
  });

  const autocompleteItems = useMemo<AutocompleteItems>(
    () =>
      (query.data ?? []).map((item) => ({
        id: item.id,
        label: item.title,
        description: item.description,
        leftSlot:
          typesWithImages.includes(itemType) || item.imageUrl ? (
            <Media
              src={item.imageUrl || ""}
              alt={item.title}
              size="sm"
              ratio="1:1"
            />
          ) : undefined,
        rightSlot: (
          <div className="flex items-center gap-xs">
            {item.priceLabel ? (
              <Body htmlVariant="span" size="md" color="weak">
                {item.priceLabel}
              </Body>
            ) : null}
            <Button
              kind="icon-button"
              icon="info-circle"
              size="md"
              intent="flat"
              color="default"
              label="Item info"
            />
          </div>
        ),
      })),
    [query.data, itemType],
  );

  return {
    items: autocompleteItems,
    isLoading: query.isLoading || query.isFetching,
  };
};
