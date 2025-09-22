import { clsx } from "clsx";
import React from "react";

import {
  Card,
  Collapse,
  Icon,
  List,
  Title,
} from "@bsport/kaizen-primitive-core";

import { useSelectedItemsContext } from "#src/contexts/selectedItemsContext";
import type { ItemVariant } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import { useItemsById } from "#src/utils/stores-interface";

type PackAddItemsSelectionProps = {
  variant: ItemVariant;
};

export const PackAddItemsSelection: React.FC<PackAddItemsSelectionProps> = ({
  variant,
}) => {
  const { t } = useTranslation("details");
  const { removePreselectedItem, preselectedItems } = useSelectedItemsContext();

  const itemsByIdByVariant = useItemsById();
  const itemsById = itemsByIdByVariant[variant];

  if (preselectedItems.length === 0) return null;
  const selectedItems = preselectedItems
    .map((id) => parseInt(id) && itemsById.get(parseInt(id)))
    .filter((item) => !!item);

  const hideItemsMessage = t("addItemsModal.selectedItems.hide");
  const showItemsMessage = t("addItemsModal.selectedItems.show");

  return (
    <Collapse initiallyOpen className="mb-sm">
      <Collapse.Controller>
        {({ collapseProps, setIsCollapseOpen, isCollapseOpen }) => {
          const toggleOpen = () => setIsCollapseOpen((prevState) => !prevState);
          return (
            <button
              type="button"
              className={clsx(
                "w-full items-center flex flex-row gap-md justify-between",
                "transition-mb duration-long ease-in-out",
                {
                  "mb-sm": isCollapseOpen,
                },
              )}
              onClick={toggleOpen}
              {...collapseProps}
            >
              <Title htmlVariant="h5">
                {isCollapseOpen ? hideItemsMessage : showItemsMessage}
              </Title>
              <Icon
                icon="chevron-up"
                size="sm"
                className={clsx(
                  "w-fit transform",
                  "transition-transform duration-long ease-in-out",
                  {
                    "rotate-0": isCollapseOpen,
                    "rotate-180": !isCollapseOpen,
                  },
                )}
              />
            </button>
          );
        }}
      </Collapse.Controller>
      <Collapse.Content>
        <Card padding="none">
          <List
            isCompact
            id={`${variant}-selected-items`}
            items={selectedItems.map((item) => {
              return {
                id: String(item.id),
                title: item.name,
                buttons: [
                  {
                    color: "default",
                    id: `${variant}-${item.id}-selection-remove`,
                    intent: "flat",
                    size: "sm",
                    iconLeft: "minus",
                    onClick: () => {
                      removePreselectedItem({ id: String(item.id) });
                    },
                  },
                ],
              };
            })}
          ></List>
        </Card>
      </Collapse.Content>
    </Collapse>
  );
};
