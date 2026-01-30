import React from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { Body, Button, Icon, Title } from "@bsport/kaizen-primitive-core";

import type { AddedItem } from "#src/components/billing/BillingFlowModal/use-add-item-form";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { useItemDescriptions } from "./use-item-descriptions";
import { itemTypeIcon } from "./utils";

export type SummaryItemRowProps = {
  item: AddedItem;
  onDelete?: () => void;
};

export const SummaryItemRow: React.FC<SummaryItemRowProps> = ({
  item,
  onDelete,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const isPass = item.type === "pass" || item.type === "appointment_pass";
  const { validityDescription, creditsDescription } = useItemDescriptions(item);

  return (
    <div className="flex flex-start self-stretch p-2xs">
      <div className="flex flex-start flex-1 gap-md">
        <div className="py-2xs">
          <Icon icon={itemTypeIcon[item.type]} size="sm" />
        </div>
        <div className="flex flex-col flex-1 items-start">
          <Title htmlVariant="h5">{item.itemName}</Title>

          {isPass && creditsDescription && (
            <Body htmlVariant="span" size="md" color="weak">
              {creditsDescription}
            </Body>
          )}
          {isPass && validityDescription && (
            <Body htmlVariant="span" size="md" color="weak">
              {validityDescription}
            </Body>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-xs">
        <div className="flex items-center gap-2xs">
          <Button
            className="p-xs"
            kind="icon-button"
            intent="flat"
            color="critical"
            size="sm"
            icon="trash-01"
            label={t("billingFlowModal.deleteItem")}
            onClick={onDelete}
          />
          <Button
            className="p-xs"
            kind="icon-button"
            intent="flat"
            color="default"
            size="sm"
            icon="edit-02"
            label={t("billingFlowModal.editItem")}
            onClick={() => {
              /* TODO: Implement edit functionality */
            }}
          />
        </div>
        <Body
          className="bg-surface-default-weak px-xs py-2xs rounded-md"
          htmlVariant="span"
          size="md"
        >
          {getCurrencyDisplayWithPrice((item.quantity * item.priceCts) / 100)}
        </Body>
      </div>
    </div>
  );
};
