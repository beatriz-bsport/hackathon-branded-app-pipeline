import React from "react";

import { useFormContext } from "@bsport/form";
import { Body, Card, Divider, Title } from "@bsport/kaizen-primitive-core";

import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { SummaryEmptyState } from "./SummaryEmptyState";
import { SummaryItemRow } from "./SummaryItemRow";
import { SummaryTotals } from "./SummaryTotals";
import { calculateTotals } from "./utils";

export const SummarySection: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const { watch, setValue } = useFormContext<BillingFlowFormState>();

  const items = watch("items") ?? [];
  const promoCodes = watch("promoCodes");
  const promoCodeDiscountCts = watch("promoCodeDiscountCts");
  const itemCount = items.length;
  const itemCountText = t("billingFlowModal.itemCount", { count: itemCount });

  const handleItemDelete = (itemIndex: number) => {
    const newItems = items.filter((_, index) => index !== itemIndex);
    setValue("items", newItems, { shouldDirty: true });
    if (newItems.length === 0 && promoCodes.length > 0) {
      setValue("promoCodes", [], { shouldDirty: true });
      setValue("promoCodeDiscountCts", 0, { shouldDirty: true });
    }
  };

  const { totalBeforeTaxCts, totalAfterDiscountCts } = calculateTotals(
    items,
    promoCodeDiscountCts,
  );

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
        <Card className="flex flex-col h-full bg-surface-default-weaker">
          {itemCount === 0 ? (
            <SummaryEmptyState />
          ) : (
            <div className="flex flex-col gap-sm h-full">
              <div className="flex-1 min-h-[306px] overflow-y-auto">
                <div className="flex flex-col gap-md">
                  {items.map((item, index) => (
                    <React.Fragment key={`${item.buyableItemId}-${index}`}>
                      <SummaryItemRow
                        item={item}
                        onDelete={() => handleItemDelete(index)}
                      />
                      {index < items.length - 1 && <Divider weight="thin" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <SummaryTotals
                totalBeforeTaxCts={totalBeforeTaxCts}
                totalAfterDiscountCts={totalAfterDiscountCts}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
