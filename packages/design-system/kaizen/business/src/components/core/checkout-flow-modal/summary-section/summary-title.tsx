import React from "react";

import { useFormContext } from "@bsport/form";
import { Body, Title } from "@bsport/kaizen-primitive-core";

import type { CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import { i18nInstance, useTranslation } from "#src/i18n";

import { SummaryFootnoteButton } from "./summary-footnote-button";

type SummaryTitleProps = {
  /** When provided, renders the full row (title + Add footnote button). When omitted, renders only title content (for use as Accordion header). */
  onAddFootnoteClick?: () => void;
};

export const SummaryTitle: React.FC<SummaryTitleProps> = ({
  onAddFootnoteClick,
}) => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const { watch } = useFormContext<CheckoutFlowFormState>();

  const items = watch("items") ?? [];
  const itemCount = items.length;
  const itemCountText = t("checkoutFlowModal.itemCount", { count: itemCount });

  const titleContent = (
    <div className="flex items-center gap-xs">
      <Title htmlVariant="h4" color="default" weight="strong">
        {t("checkoutFlowModal.summary")}
      </Title>
      {itemCount > 0 && (
        <Body htmlVariant="span" size="md" color="weak">
          · {itemCountText}
        </Body>
      )}
    </div>
  );

  if (onAddFootnoteClick != null) {
    return (
      <div className="flex items-center justify-between">
        {titleContent}
        <SummaryFootnoteButton onAddFootnoteClick={onAddFootnoteClick} />
      </div>
    );
  }

  return titleContent;
};
