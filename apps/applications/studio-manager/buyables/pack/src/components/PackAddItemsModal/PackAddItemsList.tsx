import React from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { List, type ListItemProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { PackAddItemsListItemInfo } from "./PackAddItemsListItemInfo";
import {
  type Category,
  FIXTURES_CATEGORIES,
  FIXTURES_ITEMS,
  type ItemVariant,
} from "./constants";
import { type FormattedData, formatData } from "./utils";

export type PackAddItemsListProps = {
  fieldIdPrefix: string;
  variant: ItemVariant;
};

/** @todo Replace by selector once implemented */
function getCategoriesById(variant: ItemVariant) {
  const categories = FIXTURES_CATEGORIES[variant];
  const categoriesBydId = new Map<number, Category>();
  for (const category of categories) {
    categoriesBydId.set(category.id, category);
  }
  return categoriesBydId;
}

export const PackAddItemsList: React.FC<PackAddItemsListProps> = ({
  fieldIdPrefix,
  variant,
}) => {
  const { t } = useTranslation("details");

  /** @todo Retrieve from the adequate store based on the variant */
  const items = FIXTURES_ITEMS[variant];
  const categoriesById = getCategoriesById(variant);

  // @ts-expect-error Typing will be fixed when retrieving from adequate store
  const FormattedData = formatData({ variant, data: items });

  const messages = {
    credits: t("addItemsModal.items.tooltips.credits"),
    price: t("addItemsModal.items.tooltips.price"),
    category: t("addItemsModal.items.tooltips.category"),
    unavailable: t("addItemsModal.items.tooltips.unavailableForMember"),
    invisible: t("addItemsModal.items.tooltips.invisibleToStaff"),
  };

  const getItem = (data: FormattedData): ListItemProps => {
    const formattedPrice = getCurrencyDisplayWithPrice(
      typeof data.price === "string"
        ? parseFloat(data.price)
        : data.price.parsedValue,
    );

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
      rightTitle: formattedPrice,
      ...columnStart,
      customNode: (
        <PackAddItemsListItemInfo
          price={formattedPrice}
          credits={data.credits}
          category={
            data.category ? categoriesById.get(data.category)?.name : undefined
          }
          invisible={data.invisible}
          unavailable={data.unavailable}
          messages={messages}
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
      items={FormattedData.map(getItem)}
      isSelectable
    />
  );
};
