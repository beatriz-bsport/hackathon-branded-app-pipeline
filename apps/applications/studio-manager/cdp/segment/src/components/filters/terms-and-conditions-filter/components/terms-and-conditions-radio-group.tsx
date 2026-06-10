import { FormRadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  TERMS_AND_CONDITIONS_OPTIONS,
  booleanToTermsAndConditionsOptionMap,
  isTermsAndConditionsOption,
  termsAndConditionsOptionToBooleanMap,
} from "../constants";

type TermsAndConditionsRadioGroupProps = {
  id: string;
  value: boolean;
  onChange: (nextValue: boolean) => void;
  disabled?: boolean;
};

/**
 * Accepted / Not accepted selector backed by Kaizen `FormRadioGroup`.
 */
export const TermsAndConditionsRadioGroup = ({
  id,
  value,
  onChange,
  disabled = false,
}: TermsAndConditionsRadioGroupProps) => {
  const { t } = useTranslation("filters");

  const acceptanceOptions = [
    {
      value: TERMS_AND_CONDITIONS_OPTIONS.accepted,
      label: t("filters.107.fields.accepted"),
    },
    {
      value: TERMS_AND_CONDITIONS_OPTIONS.notAccepted,
      label: t("filters.107.fields.notAccepted"),
    },
  ];

  return (
    <FormRadioGroup
      id={id}
      label={t("filters.107.fields.radioLabel")}
      options={acceptanceOptions}
      value={booleanToTermsAndConditionsOptionMap(value)}
      disabled={disabled}
      onChange={(event) => {
        const nextValue = event.target.value;
        if (isTermsAndConditionsOption(nextValue)) {
          onChange(termsAndConditionsOptionToBooleanMap[nextValue]);
        }
      }}
    />
  );
};
