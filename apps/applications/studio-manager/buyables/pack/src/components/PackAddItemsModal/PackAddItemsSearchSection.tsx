import React, { type Dispatch, type SetStateAction, useState } from "react";

import { TextField } from "@bsport/kaizen-primitive-core";
import { DEFAULT_PAGE } from "@bsport/use-pagination-query-params";

import type { ItemVariant } from "#src/utils/constants";
import {
  type VariantAndData,
  useSearchedItems,
} from "#src/utils/stores-interface";

import { PackAddItemsList } from "./PackAddItemsList";

type PackAddItemsSearchSectionProps = {
  fieldIdPrefix: string;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  variant: ItemVariant;
  isSearching: boolean;
};

export const PackAddItemsSearchSection: React.FC<
  PackAddItemsSearchSectionProps
> = ({ fieldIdPrefix, searchQuery, setSearchQuery, variant, isSearching }) => {
  const itemsByVariant = useSearchedItems();
  const params = { data: itemsByVariant[variant], variant } as VariantAndData;
  const [syncQueryString, setSyncQueryString] = useState("");
  return (
    <>
      <TextField
        id={`${fieldIdPrefix}-search`}
        type="search"
        iconLeft="search-refraction"
        autoFocus
        fullWidth
        value={syncQueryString}
        onChange={(event) => {
          const nextText = event.target.value;
          setSyncQueryString(nextText);
          setSearchQuery(nextText);
        }}
        onClear={() => {
          setSyncQueryString("");
          setSearchQuery("");
        }}
        containerProps={{
          className: "flex-1",
        }}
      />
      {searchQuery && (
        <PackAddItemsList
          fieldIdPrefix={fieldIdPrefix}
          listConfig={{
            isLoading: isSearching,
            page: DEFAULT_PAGE,
            pageSize: params.data.length,
            total: params.data.length,
          }}
          {...params}
        />
      )}
    </>
  );
};
