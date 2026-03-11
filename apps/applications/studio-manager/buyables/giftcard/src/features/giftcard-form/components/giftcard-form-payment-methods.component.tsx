import type { FC } from "react";

import { PaymentMethodsForm } from "@bsport/kaizen-business-components/buyables/payment-methods-form";

import { useTranslation } from "#src/utils/i18n";

import type { GiftcardFormData, GiftcardFormMethods } from "../types";

type GiftcardFormPaymentMethodsProps = {
  formId: string;
  methods: GiftcardFormMethods;
  isSharedGiftcard?: boolean;
};

export const GiftcardFormPaymentMethods: FC<
  GiftcardFormPaymentMethodsProps
> = ({ formId, methods, isSharedGiftcard }) => {
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
      disabled={isSharedGiftcard}
    />
  );
};
