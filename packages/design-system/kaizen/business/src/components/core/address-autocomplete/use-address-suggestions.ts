import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  type AddressSuggestion,
  fetchAddressSuggestionsQueryOptions,
} from "@bsport/api-core";
import type { AutocompleteItems } from "@bsport/kaizen-primitive-core";

export const useAddressSuggestions = (params: {
  searchText: string;
  apiKey: string;
}): {
  items: AutocompleteItems;
  isLoading: boolean;
  getSuggestion: (placeId: string) => AddressSuggestion | undefined;
} => {
  const { data = [], isFetching } = useQuery(
    fetchAddressSuggestionsQueryOptions(params),
  );

  const { items, suggestionMap } = useMemo(() => {
    const map = new Map<string, AddressSuggestion>();
    const autocompleteItems: AutocompleteItems = data.map((suggestion) => {
      map.set(suggestion.place_id, suggestion);
      return { id: suggestion.place_id, label: suggestion.generated_address };
    });
    return { items: autocompleteItems, suggestionMap: map };
  }, [data]);

  return {
    items,
    isLoading: isFetching,
    getSuggestion: (placeId) => suggestionMap.get(placeId),
  };
};
