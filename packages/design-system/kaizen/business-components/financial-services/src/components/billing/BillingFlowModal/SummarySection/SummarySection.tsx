import React, { useMemo, useState } from "react";

import { useFormContext } from "@bsport/form";
import {
  Body,
  Button,
  Card,
  Divider,
  Title,
  useEmptyState,
} from "@bsport/kaizen-primitive-core";

import { FootnoteModal } from "#src/components/billing/BillingFlowModal/FootnoteModal";
import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

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

  const emptyTitle = t("billingFlowModal.emptyState.title");
  const emptySubtitle = t("billingFlowModal.emptyState.subtitle");
  const emptyConfig = useMemo(
    () => ({ title: emptyTitle, subtitle: emptySubtitle }),
    [emptyTitle, emptySubtitle],
  );

  const { shouldRenderEmptyState, EmptyState } = useEmptyState({
    isEmpty: itemCount === 0,
    emptyConfig,
  });

  const footnote = watch("footnote");
  const [isFootnoteModalOpen, setIsFootnoteModalOpen] = useState(false);
  const hasFootnote = footnote != null && footnote.trim() !== "";

  const handleItemDelete = (itemIndex: number) => {
    const newItems = items.filter((_, index) => index !== itemIndex);
    setValue("items", newItems, { shouldDirty: true });
    if (newItems.length === 0 && promoCodes.length > 0) {
      setValue("promoCodes", [], { shouldDirty: true });
      setValue("promoCodeDiscountCts", 0, { shouldDirty: true });
    }
    if (newItems.length === 0 && footnote?.trim() !== "") {
      setValue("footnote", null, { shouldDirty: true });
    }
  };

  const { totalBeforeTaxCts, totalAfterDiscountCts } = calculateTotals(
    items,
    promoCodeDiscountCts,
  );
  const handleSaveFootnote = (value: string) => {
    const trimmed = value.trim();
    setValue("footnote", trimmed === "" ? null : trimmed, {
      shouldDirty: true,
    });
    setIsFootnoteModalOpen(false);
  };

  const handleDeleteFootnote = () => {
    setValue("footnote", null, { shouldDirty: true });
    setIsFootnoteModalOpen(false);
  };

  return (
    <div className="flex flex-col flex-1 gap-md max-h-[550px]">
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
        {itemCount > 0 && !hasFootnote && (
          <div className="flex items-center">
            <Button
              intent="flat"
              color="main"
              size="md"
              label={t("billingFlowModal.addFootnote")}
              onClick={() => setIsFootnoteModalOpen(true)}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 min-h-0 gap-xs">
        <Card className="flex flex-col flex-1 min-h-0 bg-surface-default-weaker">
          {shouldRenderEmptyState ? (
            <EmptyState />
          ) : (
            <div className="flex flex-1 min-h-0 flex-col gap-xs">
              <div className="flex-1 overflow-y-auto">
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
              <Divider weight="thin" />
              <div className="shrink-0">
                <SummaryTotals
                  totalBeforeTaxCts={totalBeforeTaxCts}
                  totalAfterDiscountCts={totalAfterDiscountCts}
                />
              </div>
            </div>
          )}
        </Card>
        {hasFootnote && (
          <Card className="flex shrink-0 flex-col bg-surface-default-weaker">
            <div className="flex items-center justify-between">
              <Body htmlVariant="span" size="md">
                {t("billingFlowModal.footnote")}
              </Body>
              <div className="flex items-center gap-2xs">
                <Button
                  kind="icon-button"
                  intent="flat"
                  color="critical"
                  size="md"
                  icon="trash-01"
                  label={t("billingFlowModal.deleteItem")}
                  onClick={handleDeleteFootnote}
                />
                <Button
                  kind="icon-button"
                  intent="flat"
                  color="default"
                  size="md"
                  icon="edit-02"
                  label={t("billingFlowModal.editItem")}
                  onClick={() => setIsFootnoteModalOpen(true)}
                />
              </div>
            </div>
            <Body htmlVariant="span" size="md" weight="weak">
              {footnote}
            </Body>
          </Card>
        )}
      </div>

      <FootnoteModal
        isOpen={isFootnoteModalOpen}
        onClose={() => setIsFootnoteModalOpen(false)}
        onSave={handleSaveFootnote}
        initialValue={footnote}
      />
    </div>
  );
};
