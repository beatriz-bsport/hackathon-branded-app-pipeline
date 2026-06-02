import { FormRadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  CONSENT_OPTIONS,
  type ConsentOption,
  isConsentOption,
} from "../constants";

type ConsentRadioGroupProps = {
  id: string;
  value: ConsentOption;
  onChange: (nextValue: ConsentOption) => void;
  disabled?: boolean;
};

/**
 * Accepted / Rejected consent selector backed by Kaizen `FormRadioGroup`.
 *
 * Each channel gets its own group `id`, which is used as the shared radio
 * `name` so SMS and email consent controls can render on the same card.
 */
export const ConsentRadioGroup = ({
  id,
  value,
  onChange,
  disabled = false,
}: ConsentRadioGroupProps) => {
  const { t } = useTranslation("filters");

  const consentOptions = [
    {
      value: CONSENT_OPTIONS.accepted,
      label: t("filters.103.fields.consent.accepted"),
    },
    {
      value: CONSENT_OPTIONS.rejected,
      label: t("filters.103.fields.consent.rejected"),
    },
  ];

  return (
    <FormRadioGroup
      id={id}
      label={t("filters.103.fields.consent.radioLabel")}
      options={consentOptions}
      value={value}
      disabled={disabled}
      onChange={(event) => {
        const nextValue = event.target.value;
        if (isConsentOption(nextValue)) {
          onChange(nextValue);
        }
      }}
    />
  );
};
