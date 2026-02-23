import React from "react";

import { useFormContext } from "@bsport/form";
import { Button } from "@bsport/kaizen-primitive-core";

import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

type SummaryFootnoteButtonProps = {
  onAddFootnoteClick: () => void;
};

/**
 * "Add footnote" button for the summary header. Use in Accordion headerActions on mobile, or rendered by SummaryTitle on desktop.
 */
export const SummaryFootnoteButton: React.FC<SummaryFootnoteButtonProps> = ({
  onAddFootnoteClick,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const { watch } = useFormContext<BillingFlowFormState>();

  const items = watch("items") ?? [];
  const itemCount = items.length;
  const footnote = watch("footnote");
  const hasFootnote = footnote != null && footnote.trim() !== "";
  const showAddFootnote = itemCount > 0 && !hasFootnote;

  if (!showAddFootnote) return null;

  return (
    <Button
      intent="flat"
      color="main"
      size="sm"
      label={t("billingFlowModal.addFootnote")}
      onClick={onAddFootnoteClick}
    />
  );
};
