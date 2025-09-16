import React from "react";

import { List, type ListItemProps } from "@bsport/kaizen-primitive-core";

import { PackItemPopoverInfo } from "#src/components/PackItemPopoverInfo";
import type { ItemVariant } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import { useCategoriesById, useItems } from "#src/utils/stores-interface";
import {
  type FormattedData,
  type VariantAndData,
  formatData,
} from "#src/utils/stores-interface";

export type PackAddItemsListProps = {
  fieldIdPrefix: string;
  variant: ItemVariant;
};

export const PackAddItemsList: React.FC<PackAddItemsListProps> = ({
  fieldIdPrefix,
  variant,
}) => {
  const { t } = useTranslation("details");

  const items = useItems();
  const categoriesById = useCategoriesById()[variant];

  const params = { variant, data: items[variant] } as VariantAndData;
  const formattedData = formatData(params);

  const getItem = (data: FormattedData): ListItemProps => {
    const columnStart =
      data.variant === "webshopItem"
        ? ({
            avatar: {
              shape: "squared",
              size: "md",
              src: data.cover ?? undefined,
            },
            description: data.size
              ? t("addItemsModal.items.webshopItem.size", {
                  size: data.size,
                })
              : "",
          } as const)
        : {};

    return {
      id: data.id,
      title: data.name,
      rightTitle: data.price,
      ...columnStart,
      customNode: (
        <PackItemPopoverInfo
          price={data.price}
          credits={data.credits}
          category={
            data.category ? categoriesById.get(data.category)?.name : undefined
          }
          invisible={data.invisible}
          unavailable={data.unavailable}
        />
      ),
      onCheckboxChange: (value) => {
        /** @todo Use this method to manage 'selected items' on the page  */
        console.log("Update state of ", data.name, "with", value);
      },
    };
  };

  return (
    <List
      id={`${fieldIdPrefix}-items`}
      items={formattedData.map(getItem)}
      isSelectable
    />
  );
};
