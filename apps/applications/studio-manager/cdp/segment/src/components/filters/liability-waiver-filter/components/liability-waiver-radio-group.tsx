import { FormRadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type LiabilityWaiverRadioGroupProps = {
  id: string;
  value: boolean;
  onChange: (nextValue: boolean) => void;
  disabled?: boolean;
};

const toRadioOptionValue = (accepted: boolean): string => String(accepted);

const fromRadioOptionValue = (radioValue: string): boolean =>
  radioValue === "true";

/**
 * Accepted / Not accepted liability waiver selector backed by Kaizen `FormRadioGroup`.
 */
export const LiabilityWaiverRadioGroup = ({
  id,
  value,
  onChange,
  disabled = false,
}: LiabilityWaiverRadioGroupProps) => {
  const { t } = useTranslation("filters");

  const waiverOptions = [
    {
      value: "true",
      label: t("filters.410.fields.accepted"),
    },
    {
      value: "false",
      label: t("filters.410.fields.notAccepted"),
    },
  ];

  return (
    <FormRadioGroup
      id={id}
      label={t("filters.410.fields.radioLabel")}
      options={waiverOptions}
      value={toRadioOptionValue(value)}
      disabled={disabled}
      onChange={(event) => {
        onChange(fromRadioOptionValue(event.target.value));
      }}
    />
  );
};
