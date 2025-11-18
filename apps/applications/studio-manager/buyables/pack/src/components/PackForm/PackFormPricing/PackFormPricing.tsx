import React from "react";

import type { UseFormControllerOutput } from "@bsport/form";
import { Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { PackFormSchema } from "../schema";
import { PackFormPricingPaymentMethods } from "./PackFormPricingPaymentMethods";
import { PackFormPricingPrice } from "./PackFormPricingPrice";
import { PackFormPricingPurchaseNumber } from "./PackFormPricingPurchaseNumber";
import { PackFormPricingTax } from "./PackFormPricingTax";

type PackFormPricingProps = {
  fieldIdPrefix: string;
  methods: UseFormControllerOutput<PackFormSchema>;
};

/**
 * Form Section to edit :
 * - the pricing of the Pack
 */
export const PackFormPricing: React.FC<PackFormPricingProps> = ({
  fieldIdPrefix,
  methods,
}) => {
  const { t } = useTranslation("details");

  return (
    <section className="flex flex-col gap-sm">
      <Title htmlVariant="h4" weight="strong">
        {t("formFields.pricingSection.title")}
      </Title>

      <PackFormPricingPrice fieldIdPrefix={fieldIdPrefix} />

      <PackFormPricingTax fieldIdPrefix={fieldIdPrefix} watch={methods.watch} />

      <PackFormPricingPurchaseNumber
        fieldIdPrefix={fieldIdPrefix}
        methods={methods}
      />

      <PackFormPricingPaymentMethods
        fieldIdPrefix={fieldIdPrefix}
        methods={methods}
      />
    </section>
  );
};
