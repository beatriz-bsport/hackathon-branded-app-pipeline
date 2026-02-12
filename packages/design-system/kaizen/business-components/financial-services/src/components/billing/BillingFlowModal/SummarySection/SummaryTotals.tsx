import React from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { Body, Divider } from "@bsport/kaizen-primitive-core";

import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { PromoCodeSection } from "./PromoCodeSection";

export type SummaryTotalsProps = {
  totalBeforeTaxCts: number;
  totalAfterDiscountCts: number;
};

export const SummaryTotals: React.FC<SummaryTotalsProps> = ({
  totalBeforeTaxCts,
  totalAfterDiscountCts,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  return (
    <>
      <Divider weight="thin" />
      <PromoCodeSection />

      <div className="flex justify-between items-center px-md">
        <Body htmlVariant="span" size="md" color="weak">
          {t("billingFlowModal.totalBeforeTax")}
        </Body>
        <Body htmlVariant="span" size="md" color="weak">
          {getCurrencyDisplayWithPrice(totalBeforeTaxCts / 100)}
        </Body>
      </div>
      <div className="flex justify-between items-center px-md">
        <Body htmlVariant="span" size="lg" color="default" weight="strong">
          {t("billingFlowModal.total")}
        </Body>
        <Body htmlVariant="span" size="lg" color="default" weight="strong">
          {getCurrencyDisplayWithPrice(totalAfterDiscountCts / 100)}
        </Body>
      </div>
    </>
  );
};
