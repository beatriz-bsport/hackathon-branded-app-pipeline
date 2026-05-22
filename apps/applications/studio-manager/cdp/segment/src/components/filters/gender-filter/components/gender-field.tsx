import { RadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { GENDER_OPTIONS } from "../constants";
import type { GenderOption } from "../constants";

type GenderFieldProps = {
  id: string;
  value: GenderOption;
  onChange: (nextValue: GenderOption) => void;
};

/**
 * Stateless gender selector backed by Kaizen `RadioGroup`.
 */
export const GenderField = ({ id, value, onChange }: GenderFieldProps) => {
  const { t } = useTranslation("filters");

  const genderOptions = [
    {
      value: GENDER_OPTIONS.male,
      label: t("filters.5.fields.male"),
    },
    {
      value: GENDER_OPTIONS.female,
      label: t("filters.5.fields.female"),
    },
  ];

  return (
    <RadioGroup
      id={id}
      label={t("filters.5.fields.radioLabel")}
      options={genderOptions}
      value={value}
      onChange={(event) => {
        const nextValue =
          event.target.value === GENDER_OPTIONS.female
            ? GENDER_OPTIONS.female
            : GENDER_OPTIONS.male;
        onChange(nextValue);
      }}
    />
  );
};
