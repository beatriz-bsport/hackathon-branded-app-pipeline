import type { FC } from "react";

import { PaymentMethodsForm } from "@bsport/kaizen-business-components/buyables/payment-methods-form";

import { useTranslation } from "#src/utils/i18n";

import type { GiftcardFormData, GiftcardFormMethods } from "../types";

type GiftcardFormExpirationDaysProps = {
  formId: string;
  methods: GiftcardFormMethods;
};

export const GiftcardFormPaymentMethods: FC<
  GiftcardFormExpirationDaysProps
> = ({ formId, methods }) => {
  const isHidden = methods.watch("manager_only");
  const { t } = useTranslation("giftcard-details");

  return (
    <PaymentMethodsForm<
      GiftcardFormData,
      "available_payment_method_identifiers"
    >
      id={`${formId}-payment-methods`}
      fieldName="available_payment_method_identifiers"
      required
      isHidden={isHidden}
      buyableName={t("modelName.plural")}
    />
  );
};
