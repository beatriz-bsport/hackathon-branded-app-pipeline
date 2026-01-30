import React from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Body,
  Button,
  Card,
  Icon,
  type IconName,
  Illustration,
  Title,
} from "@bsport/kaizen-primitive-core";

import {
  INVOICE_ITEMS_KINDS,
  type InvoiceItemKind,
} from "#src/components/billing/ItemTypeSelector";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import type { AddedItem } from "./use-add-item-form";

export type SummaryItem = AddedItem;

export type SummarySectionProps = {
  items: SummaryItem[];
  onItemDelete?: (itemIndex: number) => void;
};

// Map item types to their icons (same as ItemTypeSelector)
export const itemTypeIcon: Record<InvoiceItemKind, IconName> = {
  [INVOICE_ITEMS_KINDS.pass]: "ticket-01",
  [INVOICE_ITEMS_KINDS.appointment_pass]: "ticket-01",
  [INVOICE_ITEMS_KINDS.product]: "shopping-bag-01",
  [INVOICE_ITEMS_KINDS.pack]: "package",
  [INVOICE_ITEMS_KINDS.giftcard]: "gift-02",
  [INVOICE_ITEMS_KINDS.subscription]: "refresh-cw-04",
};

const SummarySection: React.FC<SummarySectionProps> = ({
  items,
  onItemDelete,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const formatDate = (dateStr: string): string => {
    return formatDateTime(dateStr, DATETIME_FORMATS.MEDIUM_DATE, {
      locale: i18nInstance?.language || "en-US",
    });
  };

  const getValidityDescription = (item: AddedItem): string | null => {
    if (item.validityDateRange?.lower && item.validityDateRange?.upper) {
      return t("billingFlowModal.validityDateRange", {
        lower: formatDate(item.validityDateRange.lower),
        upper: formatDate(item.validityDateRange.upper),
      });
    }
    if (item.durationYears && item.durationYears > 0) {
      return t("billingFlowModal.validityYear", { count: item.durationYears });
    }
    if (item.durationMonths && item.durationMonths > 0) {
      return t("billingFlowModal.validityMonth", {
        count: item.durationMonths,
      });
    }
    if (item.durationDays && item.durationDays > 0) {
      return t("billingFlowModal.validity", { count: item.durationDays });
    }
    return null;
  };

  const getCreditsDescription = (
    credits: number | null | undefined,
  ): string | null => {
    if (credits == null || isNaN(credits) || !Number.isFinite(credits)) {
      return null;
    }
    return t("itemAutocomplete.credits", { count: credits });
  };

  const itemCount = items.length;
  const itemCountText = t("billingFlowModal.itemCount", { count: itemCount });

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-xs">
          <Title htmlVariant="h4" color="default" weight="strong">
            {t("billingFlowModal.summary")}
          </Title>
          {itemCount > 0 && (
            <Body htmlVariant="span" size="md" color="weak">
              · {itemCountText}
            </Body>
          )}
        </div>
      </div>
      <div className="mt-md flex-1">
        <Card className="h-full bg-surface-default-weaker">
          {items.length === 0 ? (
            // To discuss: EmptyState used in Figma but the component is private in kaizen primitive
            <div className="h-full py-xl flex flex-col gap-xs items-center justify-center">
              <Illustration name="empty" />
              <Title
                htmlVariant="h3"
                weight="stronger"
                color="weak"
                className="text-center"
              >
                {t("billingFlowModal.emptyState.title")}
              </Title>
              <Body
                htmlVariant="p"
                weight="weak"
                color="weak"
                className="text-center"
                size="lg"
              >
                {t("billingFlowModal.emptyState.subtitle")}
              </Body>
            </div>
          ) : (
            <div className="flex flex-col gap-sm">
              {items.map((item, index) => {
                const isPass =
                  item.type === "pass" || item.type === "appointment_pass";

                const creditsDescription = isPass
                  ? getCreditsDescription(item.credits)
                  : null;
                const validityDescription = isPass
                  ? getValidityDescription(item)
                  : null;

                return (
                  <div
                    key={`${item.buyableItemId}-${index}`}
                    className="flex flex-start self-stretch"
                    data-testid={`billing-flow-summary-item-${index}`}
                  >
                    <div className="flex flex-start flex-1 gap-md">
                      <div className="py-2xs">
                        <Icon icon={itemTypeIcon[item.type]} size="sm" />
                      </div>
                      <div className="flex flex-col flex-1 items-start">
                        <Body htmlVariant="span" size="lg">
                          {item.itemName}
                        </Body>

                        {creditsDescription && (
                          <Body htmlVariant="span" size="md" color="weak">
                            {creditsDescription}
                          </Body>
                        )}
                        {validityDescription && (
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
                          color="default"
                          size="sm"
                          icon="edit-02"
                          label={t("billingFlowModal.editItem")}
                          data-testid={`billing-flow-summary-item-${index}-edit-button`}
                          onClick={() => {
                            /* TODO: Implement edit functionality */
                          }}
                        />
                        <Button
                          className="p-xs"
                          kind="icon-button"
                          intent="flat"
                          color="critical"
                          size="sm"
                          icon="trash-01"
                          label={t("billingFlowModal.deleteItem")}
                          data-testid={`billing-flow-summary-item-${index}-delete-button`}
                          onClick={() => {
                            onItemDelete?.(index);
                          }}
                        />
                      </div>
                      <Body htmlVariant="span" size="md" color="weak">
                        {getCurrencyDisplayWithPrice(
                          (item.quantity * item.priceCts) / 100,
                        )}
                      </Body>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SummarySection;
