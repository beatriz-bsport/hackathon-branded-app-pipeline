import React, { useEffect, useId, useMemo, useState } from "react";

import { toDate, toDateTime } from "@bsport/datetime-manipulation";
import { useFormContext } from "@bsport/form";
import {
  Body,
  Button,
  Card,
  DatePicker,
  Divider,
  Icon,
  Select,
  type SelectedDate,
  Title,
  Tooltip,
  useEmptyState,
} from "@bsport/kaizen-primitive-core";

import { FootnoteModal } from "#src/components/billing/BillingFlowModal/FootnoteModal";
import { useEstablishmentBillingGroups } from "#src/components/billing/BillingFlowModal/hooks/use-establishment-billing-groups";
import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { SummaryItemRow } from "./SummaryItemRow";
import { SummaryTotals } from "./SummaryTotals";
import { calculateTotals } from "./utils";

// Pass/appointment_pass start_date_method: start from billing date (valid from the billing date).
const START_ON_PURCHASE = 2;

export const SummarySection: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const { watch, setValue } = useFormContext<BillingFlowFormState>();
  const passesDatePickerId = useId();
  const billingGroupSelectId = useId();
  // TODO: Business components should have the wrapper to get the companyId.
  const companyId = 2;

  const {
    data: establishmentBillingGroups = [],
    isLoading: isBillingGroupsLoading,
  } = useEstablishmentBillingGroups(companyId);

  const showBillingGroup =
    isBillingGroupsLoading || (establishmentBillingGroups?.length ?? 0) > 0;

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

  const passActivationDate = watch("passActivationDate");
  const establishmentBillingGroupId = watch("establishmentBillingGroupId");
  const member = watch("member");

  useEffect(() => {
    if (establishmentBillingGroupId != null) return;

    const defaultBillingGroupId =
      member?.default_establishment_billing_group ??
      (establishmentBillingGroups.length > 0
        ? establishmentBillingGroups[0].id
        : null);

    if (defaultBillingGroupId != null) {
      setValue("establishmentBillingGroupId", defaultBillingGroupId);
    }
  }, [
    member?.default_establishment_billing_group,
    establishmentBillingGroupId,
    establishmentBillingGroups,
  ]);

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
        {itemCount > 0 && (showPassesRow || showBillingGroup) && (
          <Card className="flex gap-lg bg-surface-default-weaker">
            {showPassesRow && (
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
                    setValue(
                      "passActivationDate",
                      dt ? toDate(dt) : new Date(),
                      { shouldDirty: true },
                    );
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
            )}
            {showPassesRow && showBillingGroup && <Divider weight="thin" />}
            {showBillingGroup && (
              <div className="flex gap-xs items-end">
                <Select
                  id={`billing-group-${billingGroupSelectId}`}
                  fullWidth
                  label={t("billingFlowModal.billingGroup")}
                  placeholder={t("billingFlowModal.billingGroup")}
                  items={establishmentBillingGroups.map((bg) => ({
                    id: String(bg.id),
                    label: bg.name,
                  }))}
                  value={
                    establishmentBillingGroupId
                      ? String(establishmentBillingGroupId)
                      : undefined
                  }
                  onChange={(optionId) => {
                    setValue(
                      "establishmentBillingGroupId",
                      optionId ? Number(optionId) : null,
                      { shouldDirty: true },
                    );
                  }}
                  required
                  loadingProps={{
                    isLoading: isBillingGroupsLoading,
                    message: t("billingFlowModal.loadingBillingGroups"),
                  }}
                />
                <Tooltip
                  placement="top-right"
                  label={t("billingFlowModal.billingGroupTooltip")}
                >
                  <Icon icon="info-circle" size="sm" className="my-xs" />
                </Tooltip>
              </div>
            )}
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
