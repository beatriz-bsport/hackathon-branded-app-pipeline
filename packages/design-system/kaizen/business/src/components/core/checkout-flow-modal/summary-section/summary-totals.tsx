import React from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import type { Fetch } from "@bsport/fetch";
import { Body } from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import { PromoCodeSection } from "./promo-code-section";

export type SummaryTotalsProps = {
  fetch: Fetch;
  totalBeforeTaxCts: number;
  totalAfterDiscountCts: number;
};

export const SummaryTotals: React.FC<SummaryTotalsProps> = ({
  fetch,
  totalBeforeTaxCts,
  totalAfterDiscountCts,
}) => {
  const { t } = useTranslation("core", { i18n: i18nInstance });

  return (
    <div className="flex flex-col gap-md">
      <PromoCodeSection fetch={fetch} />

      <div className="flex flex-col gap-sm">
        <div className="flex justify-between items-center px-md">
          <Body htmlVariant="span" size="md" color="weak">
            {t("checkoutFlowModal.totalBeforeTax")}
          </Body>
          <Body htmlVariant="span" size="md" color="weak">
            {getCurrencyDisplayWithPrice(totalBeforeTaxCts / 100)}
          </Body>
        </div>
        <div className="flex justify-between items-center px-md">
          <Body htmlVariant="span" size="lg" color="default" weight="strong">
            {t("checkoutFlowModal.total")}
          </Body>
          <Body htmlVariant="span" size="lg" color="default" weight="strong">
            {getCurrencyDisplayWithPrice(totalAfterDiscountCts / 100)}
          </Body>
        </div>
      </div>
    </div>
  );
};
