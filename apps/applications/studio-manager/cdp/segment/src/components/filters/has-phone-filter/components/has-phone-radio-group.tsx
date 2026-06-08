import { RadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type HasPhoneRadioGroupProps = {
  id: string;
  value: boolean;
  onChange: (nextValue: boolean) => void;
  disabled?: boolean;
};

const toRadioOptionValue = (hasPhone: boolean): string => String(hasPhone);

const fromRadioOptionValue = (radioValue: string): boolean =>
  radioValue === "true";

/**
 * Has phone / Does not have phone selector backed by Kaizen `RadioGroup`.
 */
export const HasPhoneRadioGroup = ({
  id,
  value,
  onChange,
  disabled = false,
}: HasPhoneRadioGroupProps) => {
  const { t } = useTranslation("filters");

  const hasPhoneOptions = [
    {
      value: "true",
      label: t("filters.106.fields.hasPhone"),
    },
    {
      value: "false",
      label: t("filters.106.fields.doesNotHavePhone"),
    },
  ];

  return (
    <RadioGroup
      id={id}
      label={t("filters.106.fields.radioLabel")}
      options={hasPhoneOptions}
      value={toRadioOptionValue(value)}
      disabled={disabled}
      onChange={(event) => {
        onChange(fromRadioOptionValue(event.target.value));
      }}
    />
  );
};
