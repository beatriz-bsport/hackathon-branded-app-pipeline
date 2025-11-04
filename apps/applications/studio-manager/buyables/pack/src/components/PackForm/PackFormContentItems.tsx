import React, { memo } from "react";

import { Body, Illustration, List } from "@bsport/kaizen-primitive-core";

import { useGetListItemConfig } from "#src/hooks/useGetListItemConfig";
import { ITEM_VARIANTS, type ItemVariant } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import {
  type VariantAndData,
  formatData,
  useItemsById,
} from "#src/utils/stores-interface";

type PackFormContentItemsProps = {
  appointmentPasses: number[];
  passes: number[];
  webshopItems: number[];
  removeVariantItem: ({
    variant,
    id,
  }: {
    variant: ItemVariant;
    id: number;
  }) => void;
};

const VariantList = ({
  variant,
  ids,
  title,
  removeVariantItem,
  itemsById,
}: {
  variant: ItemVariant;
  ids: number[];
  title: string;
  removeVariantItem: ({
    variant,
    id,
  }: {
    variant: ItemVariant;
    id: number;
  }) => void;
  itemsById: ReturnType<typeof useItemsById>[ItemVariant];
}) => {
  const { t } = useTranslation("details");

  const getItem = useGetListItemConfig({
    variant,
    getExtraConfig: (data) => {
      return {
        // Add a button to remove an item from the selected list
        buttons: [
          {
            color: "default",
            id: `${data.variant}-${data.id}-remove`,
            intent: "flat",
            size: "sm",
            kind: "icon-button",
            icon: "minus",
            label: t("formFields.packContent.buttons.removeItem"),
            onClick: () => {
              removeVariantItem({ variant, id: parseInt(data.id) });
            },
          },
        ],
      };
    },
  });

  if (ids.length === 0) return null;

  // Retrieve raw items from the store and transform them into readable objects
  const items = ids
    .map((id) => {
      return itemsById[id];
    })
    .filter((item) => !!item);

  const params = { variant, data: items } as VariantAndData;
  const formatedData = formatData(params);

  return (
    <List id="pass" header={{ title }} items={formatedData.map(getItem)} />
  );
};

const EmptyCardList = memo(() => {
  const { t } = useTranslation("details");

  return (
    <div className="my-xl flex flex-col items-center gap-xs">
      <Illustration name="no-search" />
      <Body color="weak" size="lg">
        {t("formFields.packContent.card.placeholder")}
      </Body>
    </div>
  );
});

export const PackFormContentItems: React.FC<PackFormContentItemsProps> = ({
  appointmentPasses,
  passes,
  removeVariantItem,
  webshopItems,
}) => {
  const { t } = useTranslation("details");

  const hasSelectedItems =
    passes.length + appointmentPasses.length + webshopItems.length > 0;

  const itemsById = useItemsById();

  if (!hasSelectedItems) {
    return <EmptyCardList />;
  }

  return (
    <div className="flex flex-col">
      <VariantList
        ids={passes}
        title={t("formFields.packContent.itemVariants.passes")}
        variant={ITEM_VARIANTS.pass}
        removeVariantItem={removeVariantItem}
        itemsById={itemsById[ITEM_VARIANTS.pass]}
      />

      <VariantList
        ids={appointmentPasses}
        title={t("formFields.packContent.itemVariants.appointmentPasses")}
        variant={ITEM_VARIANTS.appointmentPass}
        removeVariantItem={removeVariantItem}
        itemsById={itemsById[ITEM_VARIANTS.appointmentPass]}
      />

      <VariantList
        ids={webshopItems}
        title={t("formFields.packContent.itemVariants.webshopItems")}
        variant={ITEM_VARIANTS.webshopItem}
        removeVariantItem={removeVariantItem}
        itemsById={itemsById[ITEM_VARIANTS.webshopItem]}
      />
    </div>
  );
};
