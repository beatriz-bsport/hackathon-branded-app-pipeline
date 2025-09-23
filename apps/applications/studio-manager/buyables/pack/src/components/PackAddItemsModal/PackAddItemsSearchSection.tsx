import React, { type Dispatch, type SetStateAction } from "react";

import { TextField } from "@bsport/kaizen-primitive-core";

import type { ItemVariant } from "#src/utils/constants";

import { PackAddItemsList } from "./PackAddItemsList";

type PackAddItemsSearchSectionProps = {
  fieldIdPrefix: string;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  variant: ItemVariant | null;
};

export const PackAddItemsSearchSection: React.FC<
  PackAddItemsSearchSectionProps
> = ({ fieldIdPrefix, searchQuery, setSearchQuery, variant }) => {
  if (!variant) {
    return null;
  }

  return (
    <>
      <TextField
        id={`${fieldIdPrefix}-search`}
        type="search"
        iconLeft="search-refraction"
        autoFocus
        fullWidth
        value={searchQuery}
        onChange={(event) => {
          /** @todo Implement search logic when stores & API are ready */
          setSearchQuery(event.target.value);
        }}
        onClear={() => {
          /** @todo Implement search logic when stores & API are ready */
          setSearchQuery("");
        }}
        containerProps={{
          className: "flex-1",
        }}
      />
      {searchQuery && (
        <PackAddItemsList fieldIdPrefix={fieldIdPrefix} variant={variant} />
      )}
    </>
  );
};
