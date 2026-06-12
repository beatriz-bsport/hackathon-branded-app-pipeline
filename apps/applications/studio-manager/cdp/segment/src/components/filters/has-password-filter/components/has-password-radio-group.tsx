import { FormRadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type HasPasswordRadioGroupProps = {
  id: string;
  value: boolean;
  onChange: (nextValue: boolean) => void;
  disabled?: boolean;
};

const toRadioOptionValue = (hasPassword: boolean): string =>
  String(hasPassword);

const fromRadioOptionValue = (radioValue: string): boolean =>
  radioValue === "true";

/**
 * Has set / Has not set selector backed by Kaizen `FormRadioGroup`.
 */
export const HasPasswordRadioGroup = ({
  id,
  value,
  onChange,
  disabled = false,
}: HasPasswordRadioGroupProps) => {
  const { t } = useTranslation("filters");

  const hasPasswordOptions = [
    {
      value: "true",
      label: t("filters.400.fields.hasPassword"),
    },
    {
      value: "false",
      label: t("filters.400.fields.doesNotHavePassword"),
    },
  ];

  return (
    <FormRadioGroup
      id={id}
      label={t("filters.400.fields.radioLabel")}
      options={hasPasswordOptions}
      value={toRadioOptionValue(value)}
      disabled={disabled}
      onChange={(event) => {
        onChange(fromRadioOptionValue(event.target.value));
      }}
    />
  );
};
