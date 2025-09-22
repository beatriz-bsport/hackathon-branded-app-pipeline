import React from "react";

import { List } from "@bsport/kaizen-primitive-core";

import { useSelectedItemsContext } from "#src/contexts/selectedItemsContext";
import { useGetListItemConfig } from "#src/hooks/useGetListItemConfig";
import type { ItemVariant } from "#src/utils/constants";
import { useItems } from "#src/utils/stores-interface";
import { type VariantAndData, formatData } from "#src/utils/stores-interface";

export type PackAddItemsListProps = {
  fieldIdPrefix: string;
  variant: ItemVariant;
};

export const PackAddItemsList: React.FC<PackAddItemsListProps> = ({
  fieldIdPrefix,
  variant,
}) => {
  const { preselectedItems, setPreselectedItems } = useSelectedItemsContext();

  const getItem = useGetListItemConfig({
    variant,
    getExtraConfig: (data) => {
      return {
        rightTitle: data.price,
      };
    },
  });

  const itemsByVariant = useItems();

  const params = { variant, data: itemsByVariant[variant] } as VariantAndData;
  const formattedData = formatData(params);

  return (
    <List
      id={`${fieldIdPrefix}-items`}
      items={formattedData.map(getItem)}
      isSelectable
      checkedIds={preselectedItems.map((id) => String(id))}
      setCheckedIds={setPreselectedItems}
    />
  );
};
