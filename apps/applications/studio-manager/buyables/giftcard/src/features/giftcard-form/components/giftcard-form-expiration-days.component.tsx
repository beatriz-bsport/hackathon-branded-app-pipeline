import type { FC } from "react";

import { FormNumberField } from "@bsport/kaizen-business-components/form/number-field";
import { FormToggle } from "@bsport/kaizen-business-components/form/toggle";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";
import type { GiftcardFormData, GiftcardFormMethods } from "../types";

type GiftcardFormExpirationDaysProps = {
  formId: string;
  methods: GiftcardFormMethods;
  isSharedGiftcard?: boolean;
};

export const GiftcardFormExpirationDays: FC<
  GiftcardFormExpirationDaysProps
> = ({ formId, methods, isSharedGiftcard }) => {
  const { t } = useTranslation("giftcard-details");

  const hasExpirationDays = methods.watch("hasExpirationDays");

  return (
    <>
      <FormToggle<GiftcardFormData, "hasExpirationDays">
        fieldName="hasExpirationDays"
        id={`${formId}-toggle-expiration-days`}
        label={t("formFields.expirationDays.toggle.label")}
        disabled={isSharedGiftcard}
      />

      {hasExpirationDays && (
        <div className="ml-[40px]">
          <FormNumberField<GiftcardFormData, "expiration_days">
            fieldName="expiration_days"
            id={`${formId}-expiration-days`}
            min={FIELD_CONSTRAINTS.EXPIRATION_DAYS_MIN}
            label={t("formFields.expirationDays.input.label")}
            required={hasExpirationDays}
            suffix={{
              type: "text",
              value: t("formFields.expirationDays.input.suffixDays"),
            }}
            className="w-full"
            disabled={isSharedGiftcard}
          />
        </div>
      )}
    </>
  );
};
