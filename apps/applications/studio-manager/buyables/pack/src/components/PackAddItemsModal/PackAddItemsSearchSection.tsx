import React, { type Dispatch, type SetStateAction } from "react";

import { TextField } from "@bsport/kaizen-primitive-core";

import { PackAddItemsList } from "./PackAddItemsList";

type PackAddItemsSearchSectionProps = {
  fieldIdPrefix: string;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
};

export const PackAddItemsSearchSection: React.FC<
  PackAddItemsSearchSectionProps
> = ({ fieldIdPrefix, searchQuery, setSearchQuery }) => {
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
          setSearchQuery(event.target.value);
        }}
        onClear={() => setSearchQuery("")}
        containerProps={{
          className: "flex-1",
        }}
      />
      {searchQuery && <PackAddItemsList fieldIdPrefix={fieldIdPrefix} />}
    </>
  );
};
