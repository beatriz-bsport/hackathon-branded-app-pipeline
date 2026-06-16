import { FormRadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  OWNS_PAYMENT_METHOD,
  type OwnsPaymentMethodOption,
} from "../constants";

type OwnsPaymentMethodRadioGroupProps = {
  id: string;
  value: OwnsPaymentMethodOption;
  onChange: (nextValue: OwnsPaymentMethodOption) => void;
  disabled?: boolean;
};

/**
 * Has / does-not-have saved payment method selector backed by Kaizen `FormRadioGroup`.
 */
export const OwnsPaymentMethodRadioGroup = ({
  id,
  value,
  onChange,
  disabled = false,
}: OwnsPaymentMethodRadioGroupProps) => {
  const { t } = useTranslation("filters");

  const ownsPaymentMethodOptions = [
    {
      value: OWNS_PAYMENT_METHOD.has,
      label: t("filters.600.fields.owns.has"),
    },
    {
      value: OWNS_PAYMENT_METHOD.doesNotHave,
      label: t("filters.600.fields.owns.doesNotHave"),
    },
  ];

  return (
    <FormRadioGroup
      id={id}
      options={ownsPaymentMethodOptions}
      value={value}
      disabled={disabled}
      onChange={(event) => {
        const nextValue = event.target.value;
        if (
          nextValue === OWNS_PAYMENT_METHOD.has ||
          nextValue === OWNS_PAYMENT_METHOD.doesNotHave
        ) {
          onChange(nextValue);
        }
      }}
    />
  );
};
