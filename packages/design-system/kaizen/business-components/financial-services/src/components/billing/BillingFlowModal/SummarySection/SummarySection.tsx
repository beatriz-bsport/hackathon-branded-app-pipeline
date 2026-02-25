import React, { useId, useMemo } from "react";

import { toDate, toDateTime } from "@bsport/datetime-manipulation";
import { useFormContext } from "@bsport/form";
import {
  Body,
  Button,
  Card,
  DatePicker,
  Divider,
  Icon,
  type SelectedDate,
  Tooltip,
  useEmptyState,
} from "@bsport/kaizen-primitive-core";

import { FootnoteModal } from "#src/components/billing/BillingFlowModal/FootnoteModal";
import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { SummaryItemRow } from "./SummaryItemRow";
import { SummaryTotals } from "./SummaryTotals";
import { calculateTotals } from "./utils";

// Pass/appointment_pass start_date_method: start from billing date (valid from the billing date).
const START_ON_PURCHASE = 2;

type SummarySectionProps = {
  openAddItemSection?: () => void;
  isFootnoteModalOpen: boolean;
  setIsFootnoteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SummarySection: React.FC<SummarySectionProps> = ({
  openAddItemSection,
  isFootnoteModalOpen,
  setIsFootnoteModalOpen,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const { watch, setValue } = useFormContext<BillingFlowFormState>();
  const passesDatePickerId = useId();

  const items = watch("items") ?? [];
  const promoCodeDiscountCts = watch("promoCodeDiscountCts");
  const itemCount = items.length;

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
  const hasFootnote = footnote != null && footnote.trim() !== "";

  const passActivationDate = watch("passActivationDate");

  const { showPassesRow, passesWithBillingDateCount } = useMemo(() => {
    const passTypes = items.filter(
      (item) =>
        (item.type === "pass" || item.type === "appointment_pass") &&
        item.startDateMethod === START_ON_PURCHASE,
    );
    return {
      showPassesRow: passTypes.length > 0,
      passesWithBillingDateCount: passTypes.length,
    };
  }, [items]);

  const handleItemDelete = (itemIndex: number) => {
    const newItems = items.filter((_, index) => index !== itemIndex);
    setValue("items", newItems, { shouldDirty: true });

    if (newItems.length === 0) {
      setValue("promoCodes", [], { shouldDirty: true });
      setValue("promoCodeDiscountCts", 0, { shouldDirty: true });
      setValue("footnote", null, { shouldDirty: true });
      openAddItemSection?.();
    }
  };

  const { totalBeforeTaxCts, totalAfterDiscountCts } = calculateTotals(
    items,
    promoCodeDiscountCts,
  );

  const handleCloseFootnoteModal = () => {
    setIsFootnoteModalOpen(false);
  };

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
    <div
      className="flex flex-col flex-1 gap-md sm:max-h-[calc(90vh-var(--header-footer-size))]"
      style={{ "--header-footer-size": "288px" }}
    >
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
                  {openAddItemSection && itemCount > 0 && (
                    <Button
                      intent="flat"
                      color="main"
                      size="sm"
                      iconLeft="plus"
                      label={t("billingFlowModal.addItemButton")}
                      onClick={openAddItemSection}
                      className="w-fit m-2xs"
                    />
                  )}
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
        {itemCount > 0 && showPassesRow && (
          <Card className="flex flex-col gap-lg sm:flex-row">
            <div className="flex gap-xs items-end">
              <DatePicker
                id={`passes-activation-date-${passesDatePickerId}`}
                label={t("billingFlowModal.passes")}
                mode="single"
                displayAs="popover"
                isInputField
                required
                dateValue={
                  passActivationDate
                    ? (toDateTime(passActivationDate) as SelectedDate)
                    : undefined
                }
                onSelect={(date: SelectedDate) => {
                  const dt = !Array.isArray(date) ? date : null;
                  setValue("passActivationDate", dt ? toDate(dt) : new Date(), {
                    shouldDirty: true,
                  });
                }}
              />
              <Tooltip
                placement="top"
                label={t("billingFlowModal.passesActivationDateTooltip", {
                  count: passesWithBillingDateCount,
                })}
              >
                <Icon icon="info-circle" size="sm" className="my-xs" />
              </Tooltip>
            </div>
          </Card>
        )}
      </div>

      <FootnoteModal
        isOpen={isFootnoteModalOpen}
        onClose={handleCloseFootnoteModal}
        onSave={handleSaveFootnote}
        initialValue={footnote}
      />
    </div>
  );
};
