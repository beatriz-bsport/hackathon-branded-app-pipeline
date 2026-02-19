import type { FC } from "react";

import type { UseFormControllerOutput } from "@bsport/form";
import { PaymentMethodsForm } from "@bsport/kaizen-business-components/buyables/payment-methods-form";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

import type { PackFormSchema } from "../schema";

type PackFormPricingPaymentMethodsProps = {
  fieldIdPrefix: string;
  methods: UseFormControllerOutput<PackFormSchema>;
};

export const PackFormPricingPaymentMethods: FC<
  PackFormPricingPaymentMethodsProps
> = ({ fieldIdPrefix, methods }) => {
  const { t } = useTranslation("details");

  const isHidden = methods.watch("manager_only");

  return (
    <PaymentMethodsForm<PackFormData, "available_payment_method_identifiers">
      id={`${fieldIdPrefix}-pack-payment-methods-checkboxes`}
      fieldName="available_payment_method_identifiers"
      required
      isHidden={isHidden}
      buyableName={t("modelName.plural")}
    />
  );
};
